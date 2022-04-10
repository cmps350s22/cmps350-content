export class ChequeDeposit{
    constructor(depositId, depositDate, bankAccountNo, depositStatus, chequeNos){
        this.depositId = depositId;
        this.depositDate = depositDate;
        this.bankAccountNo = bankAccountNo;
        this.depositStatus = depositStatus;
        this.chequeNos = chequeNos;
    }
}