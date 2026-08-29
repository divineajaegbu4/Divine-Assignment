import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { StoreService } from '../stores/store.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private storesService: StoreService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    merchant: User,
  ): Promise<Product> {
    const store = await this.storesService.findById(createProductDto.store_id);
    if (store.merchant.id !== merchant.id) {
      throw new ForbiddenException(
        'You can only add products to your own store',
      );
    }

    const { category_id, ...rest } = createProductDto;
    const product = this.productsRepository.create({
      ...rest,
      store,
      category: category_id ? { id: category_id } : undefined,
    });
    return this.productsRepository.save(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    merchant: User,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { store: { merchant: true } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.store.merchant.id !== merchant.id) {
      throw new ForbiddenException('You can only update your own products');
    }

    const { category_id, ...rest } = updateProductDto;
    if (category_id) {
      product.category = { id: category_id } as any;
    }
    Object.assign(product, rest);
    return this.productsRepository.save(product);
  }

  async findAll(queryDto: ProductQueryDto): Promise<PageDto<Product>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    queryBuilder.leftJoinAndSelect('product.store', 'store');
    queryBuilder.leftJoinAndSelect('product.category', 'category');

    if (queryDto.search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${queryDto.search}%`,
      });
    }

    if (queryDto.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: queryDto.minPrice,
      });
    }

    if (queryDto.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: queryDto.maxPrice,
      });
    }

    if (queryDto.category) {
      queryBuilder.andWhere(
        '(category.slug = :category OR category.id = :category)',
        { category: queryDto.category },
      );
    }

    if (queryDto.startDate) {
      queryBuilder.andWhere('product.created_at >= :startDate', {
        startDate: new Date(queryDto.startDate),
      });
    }

    if (queryDto.endDate) {
      queryBuilder.andWhere('product.created_at <= :endDate', {
        endDate: new Date(queryDto.endDate),
      });
    }

    const orderColumn = queryDto.orderBy
      ? `product.${queryDto.orderBy}`
      : 'product.created_at';

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

  async findByStore(
    storeId: string,
    queryDto: ProductQueryDto,
  ): Promise<PageDto<Product>> {
    const queryBuilder = this.productsRepository.createQueryBuilder('product');
    queryBuilder.leftJoinAndSelect('product.store', 'store');
    queryBuilder.leftJoinAndSelect('product.category', 'category');
    queryBuilder.where('store.id = :storeId', { storeId });

    if (queryDto.search) {
      queryBuilder.andWhere('product.name ILIKE :search', {
        search: `%${queryDto.search}%`,
      });
    }

    if (queryDto.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', {
        minPrice: queryDto.minPrice,
      });
    }

    if (queryDto.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', {
        maxPrice: queryDto.maxPrice,
      });
    }

    if (queryDto.category) {
      queryBuilder.andWhere(
        '(category.slug = :category OR category.id = :category)',
        { category: queryDto.category },
      );
    }

    if (queryDto.startDate) {
      queryBuilder.andWhere('product.created_at >= :startDate', {
        startDate: new Date(queryDto.startDate),
      });
    }

    if (queryDto.endDate) {
      queryBuilder.andWhere('product.created_at <= :endDate', {
        endDate: new Date(queryDto.endDate),
      });
    }

    const orderColumn = queryDto.orderBy
      ? `product.${queryDto.orderBy}`
      : 'product.created_at';

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

  async findById(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async remove(id: string, merchant: User): Promise<void> {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: { store: { merchant: true } },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.store.merchant.id !== merchant.id) {
      throw new ForbiddenException('You can only delete your own products');
    }

    await this.productsRepository.remove(product);
  }
}
