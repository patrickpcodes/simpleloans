using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SimpleLoans.Server.Api.Cosmos;
using SimpleLoans.Server.Api.Models;
using System.Threading.Channels;

namespace SimpleLoans.Server.Api.Controllers;

[ApiController]
[Route( "api/[controller]" )]
public class CustomersController : ControllerBase
{
    private readonly MongoDbService _mongoDbService;

    public CustomersController( MongoDbService mongoDbService )
    {
        _mongoDbService = mongoDbService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Customer>>> GetAllCustomers()
    {
        var customers = await _mongoDbService.CustomerCollection.Find( _ => true ).ToListAsync();

        if( customers == null || !customers.Any() )
        {
            return NoContent(); // Returns 204 if no customers found
        }

        return Ok( customers.OrderBy(c=> c.Name).ToList() ); // Returns 200 with the list of customers
    }

    [HttpGet( "{id}" )]
    public async Task<ActionResult<object>> GetCustomerById( string id )
    {
        // Find the customer by ID
        var customer = await _mongoDbService.CustomerCollection.Find( c => c.Id == Guid.Parse( id ) ).FirstOrDefaultAsync();

        if( customer == null )
        {
            return NotFound( new { message = $"Customer with ID {id} not found." } );
        }

        // Find the history associated with this customer
        var history = await _mongoDbService.HistoryCollection.Find( h => h.ReferenceId == customer.Id ).ToListAsync();

        // Return both customer and history as an object
        return Ok( new
        {
            Customer = customer,
            History = history
        } );
    }

    [HttpPost]
    public async Task<IActionResult> CreateCustomer( [FromBody] Customer newCustomer )
    {
        if( newCustomer == null )
        {
            return BadRequest( new { message = "Customer data is required." } );
        }

        // Ensure the customer ID is unique
        newCustomer.Id = Guid.NewGuid();

        // Insert the new customer into the database
        await _mongoDbService.CustomerCollection.InsertOneAsync( newCustomer );

        var history = new History
        {
            Type = "Customer",
            ReferenceId = newCustomer.Id,
            Changes = new List<Change>() { new Change { Field = "Created", OldValue = "", NewValue = "" } },
            //TODO IMplement Me
            UserId = Guid.Parse( "0CE43205-356E-430A-BC67-08DD0DEEB514" ), // Replace with real user ID when authentication is implemented
            DisplayName = "Patrick P"
        };

        await _mongoDbService.SaveHistoryAsync( history );

        return CreatedAtAction( nameof( GetCustomerById ), new { id = newCustomer.Id }, newCustomer );
    }


    [HttpPut( "{id}" )]
    public async Task<IActionResult> UpdateCustomer( string id, [FromBody] Customer updatedCustomer )
    {
        var customer = await _mongoDbService.CustomerCollection.Find( c => c.Id == Guid.Parse( id ) ).FirstOrDefaultAsync();
        if( customer == null )
        {
            return NotFound( new { message = $"Customer with ID {id} not found." } );
        }

        // Track changes
        var changes = new List<Change>();
        if( customer.Name != updatedCustomer.Name )
        {
            changes.Add( new Change { Field = "Name", OldValue = customer.Name, NewValue = updatedCustomer.Name } );
        }
        if( customer.PhoneNumber != updatedCustomer.PhoneNumber )
        {
            changes.Add( new Change { Field = "PhoneNumber", OldValue = customer.PhoneNumber, NewValue = updatedCustomer.PhoneNumber } );
        }
        if( customer.Email != updatedCustomer.Email )
        {
            changes.Add( new Change { Field = "Email", OldValue = customer.Email, NewValue = updatedCustomer.Email } );
        }
        if( customer.Birthday != updatedCustomer.Birthday )
        {
            changes.Add( new Change { Field = "Birthday", OldValue = customer.Birthday.ToString( "yyyy-MM-dd" ), NewValue = updatedCustomer.Birthday.ToString( "yyyy-MM-dd" ) } );
        }
        if( customer.SendBirthdayEmail != updatedCustomer.SendBirthdayEmail )
        {
            changes.Add( new Change { Field = "CanSendEmail", OldValue = customer.SendBirthdayEmail.ToString(), NewValue = updatedCustomer.SendBirthdayEmail.ToString() } );
        }

        if ( customer.PaymentReminderType != updatedCustomer.PaymentReminderType )
        {
            changes.Add(new Change{Field="PaymentRemindedType", OldValue = customer.PaymentReminderType.ToString(), NewValue = updatedCustomer.PaymentReminderType.ToString()});
        }
        if( customer.Notes != updatedCustomer.Notes )
        {
            changes.Add( new Change { Field = "Notes", OldValue = customer.Notes, NewValue = updatedCustomer.Notes } );
        }

        // Return 304 Not Modified if there are no changes
        if( !changes.Any() )
        {
            return StatusCode( 304 );
        }

        // Save history if there are changes
        
            var history = new History
            {
                Type = "Customer",
                ReferenceId = customer.Id,
                Changes = changes,
                UserId = Guid.Parse( "0CE43205-356E-430A-BC67-08DD0DEEB514" ), // Replace with real user ID when authentication is implemented
                DisplayName = "Patrick P"
            };

            await _mongoDbService.SaveHistoryAsync( history );
        

        // Update the customer
        await _mongoDbService.CustomerCollection.ReplaceOneAsync( c => c.Id == customer.Id, updatedCustomer );

        // Fetch the updated history
        var updatedHistory = await _mongoDbService.HistoryCollection
            .Find( h => h.ReferenceId == customer.Id )
            .SortByDescending( h => h.Timestamp )
            .ToListAsync();

        return Ok( new
        {
            Customer = updatedCustomer,
            History = updatedHistory
        } );
    }
}