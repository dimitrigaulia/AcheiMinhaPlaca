namespace PlacaSegura.Domain.Enums;

public enum UserRole
{
    User = 0,
    Admin = 1
}

public enum ReportType
{
    Lost = 0,
    Found = 1
}

public enum ReportStatus
{
    Active = 0,
    Matched = 1,
    Closed = 2,
    Removed = 3
}

public enum ClaimStatus
{
    Pending = 0,
    Verified = 1,
    Rejected = 2
}

public enum MatchStatus
{
    Open = 0,
    HandedOver = 1,
    Cancelled = 2
}

public enum ReportFlagStatus
{
    Open = 0,
    Reviewed = 1
}
