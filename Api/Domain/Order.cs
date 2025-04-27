using Api.Domain;

public class Order
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? CustomerId { get; set; }
    public UserApp? Customer { get; set;}
    public decimal TotalPrice { get; set; }
    public string? Address { get; set; }
    public string? Status { get; set; } = "Pending";
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public List<OrderProduct> Products { get; set; } = new();
}
