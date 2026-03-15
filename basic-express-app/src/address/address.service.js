import {NotFoundException} from "../exceptions/notfound.exception.js";
import {ServerException} from "../exceptions/server.exception.js";

export class AddressService {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
    }

    async createNewAddress(address){
        return this.addressRepository.createNewAddress(address);
    }
    async updateAddress(id, address){
        try {
            const updatedAddress = await this.addressRepository.updateAddress(id, address);
            if (!updatedAddress) {
                throw new NotFoundException("Address not found. Invalid address id: " + id);
            }
            return updatedAddress;
        } catch (error) {
            throw new ServerException("Failed to update address: " + error.message);
        }
    }

    async deleteAddress(address){
        return this.addressRepository.deleteAddress(address);
    }

    async findById(id){
        return this.addressRepository.findById(id);
    }
}