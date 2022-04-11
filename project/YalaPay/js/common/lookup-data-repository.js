import { fetchJson } from "./common.js";

const db = new Localbase("YalaPay.db");

class LookupDataRepository {
    getLookupData(key) {
        return db.collection("lookupData").doc(key).get();
    }

    async getLookupDataCount() {
        // Localbase = very poor library, it does NOT have a function to just return documents count
        const lookupData = await db.collection("lookupData").get();
        const count = lookupData.length;
        return (count !== null && count !== undefined) ? count : 0;
    }

    async initLookupData() {
        const lookupDataCount = await this.getLookupDataCount();
        console.log(`LookupData count: ${lookupDataCount}`);

        if (lookupDataCount === 0) {
            const banks = await fetchJson("data/banks.json");
            await db.collection("lookupData").add({banks}, "banks");

            const bankAccounts = await fetchJson("data/bank-accounts.json");
            await db.collection("lookupData").add({bankAccounts}, "bankAccounts");

            const chequeStatus = await fetchJson("data/cheque-status.json");
            await db.collection("lookupData").add({chequeStatus}, "chequeStatus");

            const invoiceStatus = await fetchJson("data/invoice-status.json");
            await db.collection("lookupData").add({invoiceStatus}, "invoiceStatus");

            const depositStatus = await fetchJson("data/deposit-status.json");
            await db.collection("lookupData").add({depositStatus}, "depositStatus");
            
            const paymentModes = await fetchJson("data/payment-modes.json");
            await db.collection("lookupData").add({paymentModes}, "paymentModes");

            const returnReasons = await fetchJson("data/return-reasons.json");
            await db.collection("lookupData").add({returnReasons}, "returnReasons");
        }
    }
}

export default new LookupDataRepository();