import { getId } from "../common.js";

const db = new Localbase("YalaPay.db");
const customers = "customers";

class CustomerRepository {

    async initCustomers() {
        const customersCount = await this.getCustomersCount();
        console.log(`customersCount: ${customersCount}`);

        if (customersCount === 0) {
            const customersUrl = "data/customers.json";
            const response = await fetch(customersUrl);
            const customers = await response.json();
            for (const customer of customers) {
                await this.addCustomer(customer);
            }
        }
    }

    getCustomer(customerId) {
        return db
            .collection(customers)
            .doc({ id: customerId })
            .get();
    }

    getCustomerByName(customerName) {
        return db
            .collection(customers)
            .doc({ companyName: customerName })
            .get();
    }

    getCustomers() {
        return db.collection(customers).get();
    }

    async getCustomersCount() {
        // Localbase = very poor library, it does NOT have a function to just return documents count
        // ToDo: getCount should be done by DB
        const customers = await this.getCustomers();
        const count = customers.length;
        return (count !== null && count !== undefined) ? count : 0;
    }

    addCustomer(customer) {
        if (!customer.id)
            customer.id = getId();

        return db.collection(customers).add(customer);
    }

    updateCustomer(customer) {
        return db
            .collection(customers)
            .doc({ id: customer.id })
            .update(customer);
    }

    deleteCustomer(customerId) {
        return db
            .collection(customers)
            .doc({ id: customerId })
            .delete();
    }
}

export default new CustomerRepository();