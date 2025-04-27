using Api.Dtos;

public class OrderProductDto
{
    public Guid ProductId { get; set; }
    public ProductDto? Product { get; set; }
    public int Quantity { get; set; }
}
