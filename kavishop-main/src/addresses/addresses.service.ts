import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  async create(
    user: User,
    createAddressDto: CreateAddressDto,
  ): Promise<Address> {
    if (createAddressDto.is_default) {
      await this.addressesRepository.update(
        { user: { id: user.id } },
        { is_default: false },
      );
    }

    const address = this.addressesRepository.create({
      ...createAddressDto,
      user,
    });

    return this.addressesRepository.save(address);
  }

  async findAll(user: User): Promise<Address[]> {
    return this.addressesRepository.find({
      where: { user: { id: user.id } },
      order: { is_default: 'DESC', created_at: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Address> {
    const address = await this.addressesRepository.findOne({
      where: { id, user: { id: user.id } },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async update(
    id: string,
    user: User,
    updateAddressDto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.findOne(id, user);

    if (updateAddressDto.is_default && !address.is_default) {
      await this.addressesRepository.update(
        { user: { id: user.id } },
        { is_default: false },
      );
    }

    Object.assign(address, updateAddressDto);
    return this.addressesRepository.save(address);
  }

  async remove(id: string, user: User): Promise<void> {
    const address = await this.findOne(id, user);
    await this.addressesRepository.remove(address);
  }
}
