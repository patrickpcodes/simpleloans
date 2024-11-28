using Microsoft.AspNetCore.Mvc;
using SimpleLoans.Server.Api.Cosmos;
using SimpleLoans.Server.Api.Models;
using MongoDB.Driver;
using MongoDB.Bson;

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

        if( !loans.Any() )
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

        if( loan == null )
        {
            return NotFound( new { message = $"Loan with ID {id} not found." } );
        }

        return Ok( loan );
    }

    // 3. Generate payment schedule
    [HttpPost( "generate-payment-schedule" )]
    public ActionResult<List<Payment>> GeneratePaymentSchedule( [FromBody] LoanDetails loanDetails )
    {
        if( loanDetails == null )
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
        decimal remainingAmount = loanDetails.TotalToPayBack;
        decimal paymentAmount = loanDetails.TotalToPayBack / loanDetails.NumberOfWeeks;
        DateTime currentDate = loanDetails.StartDate;
        int daysToAdd = loanDetails.Frequency switch
        {
            PaymentFrequency.Weekly => 7,
            PaymentFrequency.BiWeekly => 14,
            PaymentFrequency.Monthly => 30,
            _ => throw new ArgumentOutOfRangeException()
        };

        for( int i = 0; i < loanDetails.NumberOfWeeks; i++ )
        {
            payments.Add( new Payment
            {
                Id = Guid.NewGuid(),
                DueDate = currentDate,
                AmountDue = Math.Round( (double)paymentAmount, 2 ),
                Status = PaymentStatus.Pending,
            } );

            currentDate = currentDate.AddDays( daysToAdd );
        }

        return payments;
    }

}
