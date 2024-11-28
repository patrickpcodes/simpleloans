namespace SimpleLoans.Server.Api.Models;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;

using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
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
public enum CustomerStatus {
    Active,
    Inactive
}

// Models
public class Customer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string Email { get; set; }
    public DateTime Birthday { get; set; }
    public bool CanSendEmail { get; set; }
    public string Notes { get; set; }
    [JsonConverter( typeof( StringEnumConverter ) )]
    public CustomerStatus Status {get; set;} = CustomerStatus.Active;
}


public class Payment
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime DueDate { get; set; } // Scheduled payment due date
    public DateTime? UpdatedDate { get; set; } // When payment was marked as Paid, PartiallyPaid, or Missed
    public double AmountDue { get; set; } // The total amount expected for this payment
    public double AmountPaid { get; set; } = 0; // The amount actually paid towards this payment

    [JsonConverter( typeof( StringEnumConverter ) )]
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
}

public class LoanActivity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid LoanId { get; set; }
    public DateTime Date { get; set; } // Date activity occurred
    public DateTime? UpdatedDate { get; set; } // When the activity was updated (e.g., marked as Completed)

    [JsonConverter( typeof( StringEnumConverter ) )]
    public LoanActivityType Type { get; set; }

    public double Amount { get; set; }

    [JsonConverter( typeof( StringEnumConverter ) )]
    public LoanActivityReason Reason { get; set; } = LoanActivityReason.Other;

    [JsonConverter( typeof( StringEnumConverter ) )]
    public LoanActivityStatus Status { get; set; } = LoanActivityStatus.Pending;

    public string Notes { get; set; } // Detailed description of the activity
}

public class Loan
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CustomerId { get; set; }
    public DateTime CreationDate { get; set; }
    public DateTime? ClosedDate { get; set; } // When the loan is fully repaid
    public double LoanAmount { get; set; }
    public int NumberOfWeeks { get; set; }
    public string PaymentFrequency { get; set; }
    public double InterestRate { get; set; }
    public double OriginalTotalAmountToBeRepaid { get; set; } // Total at loan creation
    public double TotalAmountRepaid { get; set; } = 0; // Tracks the amount actually repaid, including fees or adjustments

    [JsonConverter( typeof( StringEnumConverter ) )]
    public LoanStatus Status { get; set; } = LoanStatus.NotStarted; // Loan's overall status

    public List<Payment> Payments { get; set; } = new List<Payment>();
}

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