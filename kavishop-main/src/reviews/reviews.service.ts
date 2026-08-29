import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { User } from '../users/entities/user.entity';
import { ReviewQueryDto } from './dto/review-query.dto';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(
    productId: string,
    user: User,
    createReviewDto: CreateReviewDto,
  ): Promise<Review> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      product,
      user,
    });

    return this.reviewsRepository.save(review);
  }

  async findByProduct(
    productId: string,
    queryDto: ReviewQueryDto,
  ): Promise<PageDto<Review>> {
    const queryBuilder = this.reviewsRepository.createQueryBuilder('review');
    queryBuilder.leftJoinAndSelect('review.user', 'user');
    queryBuilder.where('review.product_id = :productId', { productId });

    if (queryDto.rating) {
      queryBuilder.andWhere('review.rating = :rating', {
        rating: queryDto.rating,
      });
    }

    queryBuilder
      .orderBy('review.created_at', queryDto.order)
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

  async remove(id: string, user: User): Promise<void> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.reviewsRepository.remove(review);
  }
}
