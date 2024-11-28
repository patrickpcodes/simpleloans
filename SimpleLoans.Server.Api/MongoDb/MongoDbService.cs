using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using MongoDB.Bson.Serialization.Serializers;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using MongoDB.Driver;
using SimpleLoans.Server.Api.Models;

namespace SimpleLoans.Server.Api.Cosmos;

public class MongoDbService
{
    private readonly IMongoDatabase _database;

    public MongoDbService( IOptions<MongoDbSettings> settings )
    {
        var mongoSettings = settings.Value;
        // Register a Guid serializer with Standard representation globally
        BsonSerializer.RegisterSerializer( new GuidSerializer( GuidRepresentation.Standard ) );


        var client = new MongoClient( mongoSettings.ConnectionString );
        _database = client.GetDatabase( mongoSettings.DatabaseName );
    }

    // Collections
    public IMongoCollection<Customer> CustomerCollection => _database.GetCollection<Customer>( "Customers" );
    public IMongoCollection<Loan> LoanCollection => _database.GetCollection<Loan>( "Loans" );
    public IMongoCollection<LoanActivity> LoanActivityCollection => _database.GetCollection<LoanActivity>( "LoanActivities" );
    public IMongoCollection<History> HistoryCollection => _database.GetCollection<History>( "History" );
    // Customer operations
    public async Task SaveCustomerAsync( Customer customer )
    {
        await CustomerCollection.ReplaceOneAsync(
            filter: Builders<Customer>.Filter.Eq( c => c.Id, customer.Id ),
            replacement: customer,
            options: new ReplaceOptions { IsUpsert = true }
        );
    }

    public async Task<Customer> GetCustomerAsync( Guid id )
    {
        return await CustomerCollection.Find( c => c.Id == id ).FirstOrDefaultAsync();
    }

    // Loan operations
    public async Task SaveLoanAsync( Loan loan )
    {
        await LoanCollection.ReplaceOneAsync(
            filter: Builders<Loan>.Filter.Eq( l => l.Id, loan.Id ),
            replacement: loan,
            options: new ReplaceOptions { IsUpsert = true }
        );
    }

    public async Task<Loan> GetLoanAsync( Guid id )
    {
        return await LoanCollection.Find( l => l.Id == id ).FirstOrDefaultAsync();
    }

    // LoanActivity operations
    public async Task SaveLoanActivityAsync( LoanActivity activity )
    {
        await LoanActivityCollection.ReplaceOneAsync(
            filter: Builders<LoanActivity>.Filter.Eq( a => a.Id, activity.Id ),
            replacement: activity,
            options: new ReplaceOptions { IsUpsert = true }
        );
    }

    public async Task<List<LoanActivity>> GetLoanActivitiesAsync( Guid loanId )
    {
        return await LoanActivityCollection.Find( a => a.LoanId == loanId ).ToListAsync();
    }

    public async Task DeleteAllAsync()
    {
        // Delete all documents from the Customers collection
        await CustomerCollection.DeleteManyAsync( Builders<Customer>.Filter.Empty );

        // Delete all documents from the Loans collection
        await LoanCollection.DeleteManyAsync( Builders<Loan>.Filter.Empty );

        // Delete all documents from the LoanActivities collection
        await LoanActivityCollection.DeleteManyAsync( Builders<LoanActivity>.Filter.Empty );

        Console.WriteLine( "All data has been deleted from the database." );
    }
    public async Task SaveHistoryAsync( History history )
    {
        await HistoryCollection.InsertOneAsync( history );
    }

    public async Task<int> GetNumberOfCustomers()
    {
        var totalCustomers = await CustomerCollection.CountDocumentsAsync( Builders<Customer>.Filter.Empty );
        return (int)totalCustomers;
    }
}
