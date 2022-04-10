export class Invoice{
    constructor(invoiceNo, customerId, CustomerName, amount, invoiceDate, dueDate){
        this.invoiceNo = invoiceNo;
        this.customerId = customerId;
        this.CustomerName = CustomerName;
        this.amount = amount;
        this.invoiceDate = invoiceDate;
        this.dueDate = dueDate;
    }
}
