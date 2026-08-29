import {Identifier} from "../utils/identifier.js";

export class AddressRepository {
    constructor(addressDB = []) {
        this.address = addressDB;
    }

    async createNewAddress(address) {
        address.id = Identifier.generate();
        
        this.address.push(address);

        return address;
    }

    async findById(id) {
        return this.address.find(address => address.id === id) || null;
    }

    async updateAddress(id, updatedFields) {
        const addressIndex = this.address.findIndex(address => address.id === id);
        if (addressIndex === -1) {
            return null;
        }

        this.address[addressIndex] = { ...this.address[addressIndex], ...updatedFields };
        return this.address[addressIndex];
    }

    async deleteAddress(id) {
        const addressIndex = this.address.findIndex(address => address.id === id);
        if (addressIndex === -1) {
            return false;
        }

        this.address.splice(addressIndex, 1);
        return true;
    }
}