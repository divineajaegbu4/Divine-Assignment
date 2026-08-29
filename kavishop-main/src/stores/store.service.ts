import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoreQueryDto } from './dto/store-query.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto, merchant: User): Promise<Store> {
    const existingStore = await this.storeRepository.findOne({
      where: { name: createStoreDto.name },
    });
    if (existingStore) {
      throw new BadRequestException('Store with this name already exists');
    }

    const store = this.storeRepository.create({
      ...createStoreDto,
      merchant: merchant,
    });

    return this.storeRepository.save(store);
  }

  async findById(id: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { id } });
    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async findAll(queryDto: StoreQueryDto): Promise<PageDto<Store>> {
    const queryBuilder = this.storeRepository.createQueryBuilder('store');
    queryBuilder.leftJoinAndSelect('store.merchant', 'merchant');

    if (queryDto.search) {
      queryBuilder.andWhere('store.name ILIKE :search', {
        search: `%${queryDto.search}%`,
      });
    }

    if (queryDto.startDate) {
      queryBuilder.andWhere('store.created_at >= :startDate', {
        startDate: new Date(queryDto.startDate),
      });
    }

    if (queryDto.endDate) {
      queryBuilder.andWhere('store.created_at <= :endDate', {
        endDate: new Date(queryDto.endDate),
      });
    }

    const orderColumn = queryDto.orderBy
      ? `store.${queryDto.orderBy}`
      : 'store.created_at';

    queryBuilder
      .orderBy(orderColumn, queryDto.order)
      .skip(queryDto.skip)
      .take(queryDto.limit);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({
      itemCount,
      pageOptionsDto: queryDto,
    });
    return new PageDto(entities, pageMetaDto);
  }

  async update(
    id: string,
    updateStoreDto: UpdateStoreDto,
    merchant: User,
  ): Promise<Store> {
    const store = await this.findById(id);
    if (store.merchant.id !== merchant.id) {
      throw new BadRequestException('You do not own this store');
    }

    Object.assign(store, updateStoreDto);
    return this.storeRepository.save(store);
  }

  async remove(id: string, merchant: User): Promise<void> {
    const store = await this.findById(id);
    if (store.merchant.id !== merchant.id) {
      throw new BadRequestException('You do not own this store');
    }

    await this.storeRepository.remove(store);
  }
}
