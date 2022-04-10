export class Payment{
    constructor(paymentId, invoiceNo, amount, paymentDate, paymentMode, chequeNo){
        this.paymentId = paymentId;
        this.invoiceNo = invoiceNo;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.paymentMode = paymentMode;
        this.chequeNo = chequeNo;
    }
}