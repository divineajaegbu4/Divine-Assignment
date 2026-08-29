import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryQueryDto } from './dto/category-query.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    let parent: Category | null = null;
    if (createCategoryDto.parent_id) {
      parent = await this.categoriesRepository.findOne({
        where: { id: createCategoryDto.parent_id },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
    }

    const slug = this.generateSlug(createCategoryDto.name);
    const existing = await this.categoriesRepository.findOne({
      where: [{ name: createCategoryDto.name }, { slug }],
    });
    if (existing) {
      throw new BadRequestException(
        'Category with this name or slug already exists',
      );
    }

    const category = this.categoriesRepository.create({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      slug,
      parent: parent || undefined,
    });

    return this.categoriesRepository.save(category);
  }

  async findAll(queryDto: CategoryQueryDto): Promise<PageDto<Category>> {
    const queryBuilder =
      this.categoriesRepository.createQueryBuilder('category');
    queryBuilder.leftJoinAndSelect('category.parent', 'parent');
    queryBuilder.leftJoinAndSelect('category.subCategories', 'subCategories');

    if (queryDto.search) {
      queryBuilder.andWhere(
        'category.name ILIKE :search OR category.description ILIKE :search',
        { search: `%${queryDto.search}%` },
      );
    }

    if (queryDto.startDate) {
      queryBuilder.andWhere('category.created_at >= :startDate', {
        startDate: new Date(queryDto.startDate),
      });
    }

    if (queryDto.endDate) {
      queryBuilder.andWhere('category.created_at <= :endDate', {
        endDate: new Date(queryDto.endDate),
      });
    }

    const orderColumn = queryDto.orderBy
      ? `category.${queryDto.orderBy}`
      : 'category.created_at';

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

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: { parent: true, subCategories: true },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.parent_id) {
      if (updateCategoryDto.parent_id === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }
      const parent = await this.categoriesRepository.findOne({
        where: { id: updateCategoryDto.parent_id },
      });
      if (!parent) {
        throw new NotFoundException('Parent category not found');
      }
      category.parent = parent;
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      category.name = updateCategoryDto.name;
      category.slug = this.generateSlug(category.name);

      const existing = await this.categoriesRepository.findOne({
        where: { slug: category.slug },
      });
      if (existing && existing.id !== id) {
        throw new BadRequestException(
          'Another category with this name/slug already exists',
        );
      }
    }

    if (updateCategoryDto.description !== undefined) {
      category.description = updateCategoryDto.description;
    }

    return this.categoriesRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categoriesRepository.remove(category);
  }
}
