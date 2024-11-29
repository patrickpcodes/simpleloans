using System.Security.Cryptography.X509Certificates;
using Microsoft.AspNetCore.Mvc;
using SimpleLoans.Server.Api.Cosmos;
using SimpleLoans.Server.Api.Models;
using MongoDB.Driver;
using MongoDB.Bson;
using Newtonsoft.Json;

namespace SimpleLoans.Server.Api.Controllers;

[ApiController]
[Route( "api/[controller]" )]
public class LoansController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;

    public LoansController( MongoDbService mongoDbService )
    {
        _mongoDbService = mongoDbService;
    }

    // 1. Get all loans for a customer
    [HttpGet( "customer/{customerId}" )]
    public async Task<ActionResult<List<Loan>>> GetAllLoansForCustomer( Guid customerId )
    {
        var loans = await _mongoDbService.LoanCollection
                                         .Find( l => l.CustomerId == customerId )
                                         .ToListAsync();

        if ( !loans.Any() )
        {
            return NoContent(); // 204 No Content
        }

        return Ok( loans );
    }

    // 2. Get loan by ID
    [HttpGet( "{id}" )]
    public async Task<ActionResult<Loan>> GetLoanById( Guid id )
    {
        var loan = await _mongoDbService.LoanCollection
                                        .Find( l => l.Id == id )
                                        .FirstOrDefaultAsync();

        if ( loan == null )
        {
            return NotFound( new { message = $"Loan with ID {id} not found." } );
        }

        return Ok( loan );
    }

    [HttpPost]
    public async Task<IActionResult> CreateLoan( [FromBody] LoanDetails newLoanDetails )
    {
        if ( newLoanDetails == null )
        {
            return BadRequest( new { message = "Loan details are required." } );
        }

        //TODO Check if any loans are currently Open 
        
        var newLoan = new Loan();
        // Set defaults for the loan
        newLoan.Id = Guid.NewGuid();
        newLoan.CustomerId = newLoanDetails.CustomerId;
        newLoan.CreationDate = DateTime.UtcNow;
        newLoan.LoanAmount = newLoanDetails.StartingAmount;
        newLoan.InterestRate = newLoanDetails.Interest;
        newLoan.NumberOfWeeks = newLoanDetails.NumberOfWeeks;
        newLoan.PaymentFrequency = newLoanDetails.Frequency;
        newLoan.OriginalTotalAmountToBeRepaid = newLoanDetails.StartingAmount;
        newLoan.TotalAmountRepaid = 0m;
        newLoan.Status = LoanStatus.InProgress; // Default to InProgress
        newLoan.ClosedDate = null;

        newLoan.Payments = GeneratePayments( newLoanDetails );

        foreach ( var payment in newLoan.Payments )
        {
            payment.Id = Guid.NewGuid();
            payment.Status = PaymentStatus.Pending; // Default status for new payments
        }

        // Save loan to database
        await _mongoDbService.LoanCollection.InsertOneAsync( newLoan );

        // Save history
        var history = new History
        {
            Type = "Loan",
            ReferenceId = newLoan.Id,
            Timestamp = DateTime.UtcNow,
            UserId = Guid.Parse(
                "0CE43205-356E-430A-BC67-08DD0DEEB514" ), // Replace with real user ID when authentication is implemented
            DisplayName = "Patrick P",
            Changes = new List<Change>
            {
                new Change { Field = "Created", OldValue = null, NewValue = "Loan created." }
            }
        };
        await _mongoDbService.SaveHistoryAsync( history );

        return CreatedAtAction( nameof(GetLoanById), new { id = newLoan.Id }, newLoan );
    }

    [HttpPut( "{id}" )]
    public async Task<IActionResult> UpdateLoan( Guid id, [FromBody] Loan updatedLoan )
    {
        var existingLoan = await _mongoDbService.LoanCollection.Find( l => l.Id == id ).FirstOrDefaultAsync();

        if ( existingLoan == null )
        {
            return NotFound( new { message = $"Loan with ID {id} not found." } );
        }

        var changes = new List<Change>();

        // Compare loan-level fields
        if ( existingLoan.Status != updatedLoan.Status )
        {
            changes.Add( new Change
            {
                Field = "Status",
                OldValue = existingLoan.Status.ToString(),
                NewValue = updatedLoan.Status.ToString()
            } );
        }

        if ( existingLoan.ClosedDate != updatedLoan.ClosedDate )
        {
            changes.Add( new Change
            {
                Field = "ClosedDate",
                OldValue = existingLoan.ClosedDate?.ToString( "yyyy-MM-dd" ),
                NewValue = updatedLoan.ClosedDate?.ToString( "yyyy-MM-dd" )
            } );
        }

        // Compare payments
        foreach ( var updatedPayment in updatedLoan.Payments )
        {
            var existingPayment = existingLoan.Payments.FirstOrDefault( p => p.Id == updatedPayment.Id );
            if ( existingPayment == null )
            {
                // New payment added
                changes.Add( new Change
                {
                    Field = "Payments",
                    OldValue = null,
                    NewValue =
                        $"New payment added: {updatedPayment.AmountDue} due on {updatedPayment.DueDate:yyyy-MM-dd}."
                } );
                continue;
            }

            if ( existingPayment.AmountDue != updatedPayment.AmountDue )
            {
                changes.Add( new Change
                {
                    Field = $"Payment {existingPayment.Id} - AmountDue",
                    OldValue = existingPayment.AmountDue.ToString(),
                    NewValue = updatedPayment.AmountDue.ToString()
                } );
            }

            if ( existingPayment.Status != updatedPayment.Status )
            {
                changes.Add( new Change
                {
                    Field = $"Payment {existingPayment.Id} - Status",
                    OldValue = existingPayment.Status.ToString(),
                    NewValue = updatedPayment.Status.ToString()
                } );
            }
        }

        // Update the loan in the database
        await _mongoDbService.LoanCollection.ReplaceOneAsync( l => l.Id == id, updatedLoan );

        // Save history if there are changes
        if ( changes.Any() )
        {
            var history = new History
            {
                Type = "Loan",
                ReferenceId = id,
                Timestamp = DateTime.UtcNow,
                UserId = Guid.NewGuid(), // Replace with authenticated user ID
                Changes = changes
            };
            await _mongoDbService.SaveHistoryAsync( history );
        }

        return Ok( updatedLoan );
    }

    // 3. Generate payment schedule
    [HttpPost( "generate" )]
    public ActionResult<List<Payment>> GeneratePaymentSchedule( [FromBody] LoanDetails loanDetails )
    {
        if ( loanDetails == null )
        {
            return BadRequest( new { message = "Loan details are required." } );
        }

        var payments = GeneratePayments( loanDetails );
        return Ok( payments );
    }

    // Logic to generate payments
    private List<Payment> GeneratePayments( LoanDetails loanDetails )
    {
        var payments = new List<Payment>();
        decimal paymentAmount = loanDetails.TotalToPayBack / loanDetails.NumberOfWeeks;
        DateOnly currentDate = loanDetails.StartDate;
        int daysToAdd = loanDetails.Frequency switch
        {
            PaymentFrequency.Weekly => 7,
            PaymentFrequency.BiWeekly => 14,
            PaymentFrequency.Monthly => 30,
            _ => throw new ArgumentOutOfRangeException()
        };

        decimal totalPaidSoFar = 0;

        for ( int i = 0; i < loanDetails.NumberOfWeeks; i++ )
        {
            decimal amountDue;

            if ( i == loanDetails.NumberOfWeeks - 1 )
            {
                // Last payment: Adjust the amount to account for any rounding errors
                amountDue = loanDetails.TotalToPayBack - totalPaidSoFar;
                amountDue = Math.Round( amountDue, 2, MidpointRounding.AwayFromZero );
            }
            else
            {
                amountDue = Math.Round( paymentAmount, 2, MidpointRounding.AwayFromZero );
            }

            totalPaidSoFar += amountDue;

            payments.Add( new Payment
            {
                Id = Guid.NewGuid(),
                DueDate = currentDate,
                AmountDue = amountDue,
                Status = PaymentStatus.Pending,
            } );

            currentDate = currentDate.AddDays( daysToAdd );
        }

        return payments;
    }
}

public class LoanDetailsWrapper
{
    public LoanDetails LoanDetails { get; set; }
}