
export class Order {
  constructor({ totalPrice, address, status = "Pending", products = [] }) {
    this.totalPrice = totalPrice;
    this.address = address;
    this.status = status;
    this.date = new Date().toISOString();
    this.products = products;
  }
}
