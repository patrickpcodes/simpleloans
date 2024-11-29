using System.Text.Json;
using System;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace SimpleLoans.Server.Api.Models;

// Enums
public enum PaymentStatus
{
    Pending,
    Paid,
    PartiallyPaid,
    Missed
}

public enum LoanActivityType
{
    Payment,
    Fee
}

public enum LoanActivityReason
{
    LatePayment,
    Adjustment,
    Other
}

public enum LoanActivityStatus
{
    Completed,
    Pending,
    Applied
}

public enum LoanStatus
{
    NotStarted,
    InProgress,
    Complete
}
public enum CustomerStatus
{
    Active,
    Inactive
}
public enum PaymentReminderType
{
    Never,
    DayOf,
    DayBefore,
    Daily
}

// Models
public class Customer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    [JsonConverter(typeof(DateOnlyJsonConverter))]
    public DateOnly Birthday { get; set; }
    public string Notes { get; set; }
    public bool SendBirthdayEmail { get; set; }
    
    [JsonConverter( typeof( JsonStringEnumConverter ) )]
    public PaymentReminderType PaymentReminderType { get; set; } 
    [JsonConverter( typeof( JsonStringEnumConverter ) )]
    public CustomerStatus Status { get; set; } = CustomerStatus.Active;
}


public class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    [JsonConverter(typeof(DateOnlyJsonConverter))]
    public DateOnly DueDate { get; set; } // Scheduled payment due date
    public DateOnly? DatePaid { get; set; }
    public DateTime? UpdatedDate { get; set; } // When payment was marked as Paid, PartiallyPaid, or Missed
    public decimal AmountDue { get; set; } // The total amount expected for this payment
    public decimal AmountPaid { get; set; } = 0m; // The amount actually paid towards this payment
    public decimal Fee { get; set; } = 0m;
    [JsonConverter( typeof( JsonStringEnumConverter ) )]
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;

    public string Notes { get; set; }
}

public class LoanActivity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LoanId { get; set; }
    public DateTime Date { get; set; } // Date activity occurred
    public DateTime? UpdatedDate { get; set; } // When the activity was updated (e.g., marked as Completed)

    [JsonConverter( typeof( JsonStringEnumConverter ) )]
    public LoanActivityType Type { get; set; }

    public double Amount { get; set; }

    [JsonConverter( typeof( JsonStringEnumConverter ) )]
    public LoanActivityReason Reason { get; set; } = LoanActivityReason.Other;

    [JsonConverter( typeof( JsonStringEnumConverter ) )]
    public LoanActivityStatus Status { get; set; } = LoanActivityStatus.Pending;

    public string Notes { get; set; } // Detailed description of the activity
}

public class Loan
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CustomerId { get; set; }
    public DateTime CreationDate { get; set; }
    public DateTime? ClosedDate { get; set; } // When the loan is fully repaid
    public decimal LoanAmount { get; set; }
    public decimal InterestRate { get; set; }
    public int NumberOfWeeks { get; set; }
    [JsonConverter( typeof( JsonStringEnumConverter ) )]
    public PaymentFrequency PaymentFrequency { get; set; }
    public decimal OriginalTotalAmountToBeRepaid { get; set; } // Total at loan creation
    public decimal TotalAmountRepaid { get; set; } = 0; // Tracks the amount actually repaid, including fees or adjustments

    [JsonConverter( typeof( JsonStringEnumConverter ) )]
    public LoanStatus Status { get; set; } = LoanStatus.NotStarted; // Loan's overall status

    public List<Payment> Payments { get; set; } = new List<Payment>();
}

public class LoanDetails
{
    public Guid CustomerId { get; set; }
    [JsonConverter(typeof(DateOnlyJsonConverter))]
    public DateOnly StartDate { get; set; }
    public int NumberOfWeeks { get; set; }
    public decimal StartingAmount { get; set; }
    public decimal Interest { get; set; }
    public decimal TotalToPayBack { get; set; }

    [JsonConverter( typeof( JsonStringEnumConverter ) )]
    public PaymentFrequency Frequency { get; set; }
}

[JsonConverter( typeof( JsonStringEnumConverter ) )]
public enum PaymentFrequency
{
    Weekly,
    [EnumMember( Value = "Bi-Weekly" )]
    BiWeekly,
    Monthly
}
//public class PaymentFrequencyConverter : JsonConverter
//{
//    public override bool CanConvert( Type objectType )
//    {
//        return objectType == typeof( PaymentFrequency );
//    }

//    public override object ReadJson( JsonReader reader, Type objectType, object existingValue, Newtonsoft.Json.JsonSerializer serializer )
//    {
//        string orderStatusString = reader.Value.ToString();
//        return orderStatusString switch
//        {
//            "Weekly" => PaymentFrequency.Weekly,
//            "Bi-Weekly" => PaymentFrequency.BiWeekly,
//            "Monthly" => PaymentFrequency.Monthly,
//            _ => throw new ArgumentException( $"Invalid order status string: {orderStatusString}" )
//        };
//    }

//    public override void WriteJson( JsonWriter writer, object value, Newtonsoft.Json.JsonSerializer serializer )
//    {
//        string orderStatusString = value switch
//        {
//            PaymentFrequency.Weekly => "Weekly",
//            PaymentFrequency.BiWeekly => "Bi-Weekly",
//            PaymentFrequency.Monthly => "Monthly",
//            _ => throw new ArgumentException( $"Invalid order status value: {value}" )
//        };
//        writer.WriteValue( orderStatusString );
//    }
//}
public class History
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Type { get; set; } // e.g., "Customer"
    public Guid ReferenceId { get; set; } // ID of the updated entity
    public List<Change> Changes { get; set; } = new List<Change>();
    public Guid UserId { get; set; } // Who made the changes
    public string DisplayName { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow; // When the change was made

}

public class Change
{
    public string Field { get; set; } // Field name that changed
    public string OldValue { get; set; } // Previous value
    public string NewValue { get; set; } // Updated value
}

public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    private const string Format = "yyyy-MM-dd";

    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        return DateOnly.ParseExact(reader.GetString(), Format, null);
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(Format));
    }
}