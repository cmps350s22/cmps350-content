const customerDb = new Localbase("customer.db");
const customerCollection = "customers";
const customerUrl = "data/customers.json";

class CustomerRepository {
    // Customer Operations
    async initCustomers() {
        const response = await fetch(customerUrl);
        const data = await response.json();
        for (const customer of data) {
            const customerExists = await customerDb
                .collection(customerCollection)
                .doc({ customerId: customer.customerId })
                .get();
            if (customerExists == undefined)
                await customerDb.collection(customerCollection).add(customer);
        }
    }

    getCustomer(customerId) {
        return customerDb
            .collection(customerCollection)
            .doc({ customerId: customerId })
            .get();
    }

    getCustomerByName(customerName) {
        return customerDb
            .collection(customerCollection)
            .doc({ companyName: customerName })
            .get();
    }

    getCustomers() {
        return customerDb.collection(customerCollection).get();
    }

    addCustomer(customer) {
        return customerDb.collection(customerCollection).add(customer);
    }

    updateCustomer(updatedCustomer) {
        return customerDb
            .collection(customerCollection)
            .doc({ customerId: updatedCustomer.customerId })
            .update(updatedCustomer);
    }

    deleteCustomer(customerId) {
        return customerDb
            .collection(customerCollection)
            .doc({ customerId: customerId })
            .delete();
    }
}

export default new CustomerRepository();