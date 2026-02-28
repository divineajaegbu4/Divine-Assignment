export class AddressService {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
    }

    async createNewAddress(address){
        return this.addressRepository.createNewAddress(address);
    }
    async updateAddress(address){
        return this.addressRepository.updateAddress(address);
    }

    async deleteAddress(address){
        return this.addressRepository.deleteAddress(address);
    }

    async findById(id){
        return this.addressRepository.findById(id);
    }
}