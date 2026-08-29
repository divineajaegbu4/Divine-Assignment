import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { WishlistItem } from './entities/wishlist-item.entity';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { User } from '../users/entities/user.entity';
import { ProductsService } from '../products/products.service';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(WishlistItem)
    private wishlistItemRepository: Repository<WishlistItem>,
    private productsService: ProductsService,
  ) {}

  async getWishlist(user: User): Promise<Wishlist> {
    let wishlist = await this.wishlistRepository.findOne({
      where: { user: { id: user.id } },
      relations: { items: { product: true } },
    });

    if (!wishlist) {
      wishlist = this.wishlistRepository.create({ user });
      wishlist = await this.wishlistRepository.save(wishlist);
      wishlist.items = [];
    }

    return wishlist;
  }

  async addItem(
    user: User,
    addWishlistItemDto: AddWishlistItemDto,
  ): Promise<Wishlist> {
    const wishlist = await this.getWishlist(user);
    const product = await this.productsService.findById(
      addWishlistItemDto.product_id,
    );

    const existingItem = wishlist.items.find(
      (item) => item.product.id === product.id,
    );
    if (existingItem) {
      throw new BadRequestException('Product is already in your wishlist');
    }

    const newItem = this.wishlistItemRepository.create({
      wishlist,
      product,
    });

    await this.wishlistItemRepository.save(newItem);
    return this.getWishlist(user);
  }

  async removeItem(user: User, productId: string): Promise<Wishlist> {
    const wishlist = await this.getWishlist(user);

    const itemIndex = wishlist.items.findIndex(
      (item) => item.product.id === productId,
    );
    if (itemIndex > -1) {
      const item = wishlist.items[itemIndex];
      await this.wishlistItemRepository.remove(item);
    } else {
      throw new NotFoundException('Product is not in your wishlist');
    }

    return this.getWishlist(user);
  }

  async clearWishlist(user: User): Promise<void> {
    const wishlist = await this.getWishlist(user);
    if (wishlist.items.length > 0) {
      await this.wishlistItemRepository.remove(wishlist.items);
    }
  }
}
