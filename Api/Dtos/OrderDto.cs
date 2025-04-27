using Api.Dtos;

public class OrderDto
{
    public Guid Id { get; set; }
    public string? CustomerId { get; set; }
    public ProfileDto? Customer { get; set; }
    public decimal TotalPrice { get; set; }
    public string? Address { get; set; }
    public string? Status { get; set; }
    public DateTime Date { get; set; }
    public List<OrderProductDto>? Products { get; set; } = new();
}
