using Bogus;
using SimpleLoans.Server.Api.Cosmos;
using SimpleLoans.Server.Api.Models;

namespace SimpleLoans.Server.Api;

public class DataSeeding
{
    public static async Task GenerateUsersAsync( MongoDbService mongoDbService, int count )
    {
        if(await mongoDbService.GetNumberOfCustomers() >= count )
        {
            Console.WriteLine( $"There are already {count} customers in the database." );
            return;
        }

        // Faker configuration
        var customerFaker = new Faker<Customer>()
            .RuleFor( c => c.Id, f => Guid.NewGuid() )
            .RuleFor( c => c.Name, f => f.Name.FullName() )
            .RuleFor( c => c.PhoneNumber, f => f.Phone.PhoneNumber() )
            .RuleFor( c => c.Email, f => f.Internet.Email() )
            .RuleFor( c => c.Birthday, f => DateOnly.FromDateTime(f.Date.Past( 40, DateTime.Now.AddYears( -20 ) ))) // Age between 20 and 60
            .RuleFor( c => c.Notes, f => f.Lorem.Sentence() )
            .RuleFor(c => c.SendBirthdayEmail, f => f.Random.Bool()) 
            .RuleFor(c => c.PaymentReminderType, f => f.PickRandom<PaymentReminderType>()); 

        // Generate fake data
        var fakeCustomers = customerFaker.Generate( count );

        // Save to database
        foreach( var customer in fakeCustomers )
        {
            await mongoDbService.SaveCustomerAsync( customer );
        }

        Console.WriteLine( $"{count} fake customers have been generated and saved to the database." );
    }
    public static async Task SeedMongoDb(MongoDbService mongoService){

        await GenerateUsersAsync( mongoService, 20 );

        //// Create a loan for the customer
        //var loan = new Loan
        //{
        //    CustomerId = customer.Id,
        //    CreationDate = DateTime.UtcNow,
        //    LoanAmount = 1000.00,
        //    NumberOfWeeks = 10,
        //    PaymentFrequency = "weekly",
        //    InterestRate = 5.0,
        //    OriginalTotalAmountToBeRepaid = 1050.00,
        //    TotalAmountRepaid = 0.00,
        //    Status = LoanStatus.InProgress,
        //    Payments = new List<Payment>
        //        {
        //            new Payment
        //            {
        //                DueDate = DateTime.UtcNow.AddDays(7),
        //                AmountDue = 105.00,
        //                Status = PaymentStatus.Pending
        //            },
        //            new Payment
        //            {
        //                DueDate = DateTime.UtcNow.AddDays(14),
        //                AmountDue = 105.00,
        //                Status = PaymentStatus.Pending
        //            }
        //        }
        //};

        //await mongoService.SaveLoanAsync( loan );
        //Console.WriteLine( $"Loan for customer {customer.Name} saved." );

        //// Log a loan activity (e.g., a payment made)
        //var loanActivity = new LoanActivity
        //{
        //    LoanId = loan.Id,
        //    Date = DateTime.UtcNow,
        //    Type = LoanActivityType.Payment,
        //    Amount = 50.00,
        //    Reason = LoanActivityReason.LatePayment,
        //    Status = LoanActivityStatus.Completed,
        //    Notes = "Partial payment of $50 made. Remaining $55 added to next payment."
        //};

        //await mongoService.SaveLoanActivityAsync( loanActivity );
        //Console.WriteLine( "Loan activity logged." );

        //// Retrieve loan activities for the loan
        //var activities = await mongoService.GetLoanActivitiesAsync( loan.Id );
        //Console.WriteLine( $"Loan activities for loan {loan.Id}:" );
        //foreach( var activity in activities )
        //{
        //    Console.WriteLine( $"- {activity.Type}: ${activity.Amount} ({activity.Notes})" );
        //}

        //// Retrieve customer and their loan
        //var fetchedCustomer = await mongoService.GetCustomerAsync( customer.Id );
        //Console.WriteLine( $"Fetched customer: {fetchedCustomer.Name}" );

        //var fetchedLoan = await mongoService.GetLoanAsync( loan.Id );
        //Console.WriteLine( $"Fetched loan for customer {fetchedCustomer.Name}: ${fetchedLoan.LoanAmount} with {fetchedLoan.Payments.Count} payments." );
    }
}
