import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  async getCart(user: User): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: user.id } },
      relations: { items: true },
    });
    if (!cart) {
      cart = this.cartRepository.create({ user });
      cart = await this.cartRepository.save(cart);
      cart.items = [];
    }
    return cart;
  }

  async addItem(user: User, addCartItemDto: AddCartItemDto): Promise<Cart> {
    const cart = await this.getCart(user);
    const product = await this.productsService.findById(
      addCartItemDto.product_id,
    );

    if (product.stock_quantity < addCartItemDto.quantity) {
      throw new BadRequestException('Not enough stock available');
    }

    let cartItem = cart.items.find((item) => item.product.id === product.id);

    if (cartItem) {
      cartItem.quantity += addCartItemDto.quantity;
      if (cartItem.quantity > product.stock_quantity) {
        throw new BadRequestException('Total quantity exceeds available stock');
      }
      await this.cartItemRepository.save(cartItem);
    } else {
      cartItem = this.cartItemRepository.create({
        cart,
        product,
        quantity: addCartItemDto.quantity,
      });
      await this.cartItemRepository.save(cartItem);
    }

    return this.getCart(user);
  }

  async updateItem(
    user: User,
    itemId: string,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { user: { id: user.id } } },
      relations: { cart: true, product: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    if (updateCartItemDto.quantity > cartItem.product.stock_quantity) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    cartItem.quantity = updateCartItemDto.quantity;
    await this.cartItemRepository.save(cartItem);

    return this.getCart(user);
  }

  async removeItem(user: User, itemId: string): Promise<Cart> {
    const cartItem = await this.cartItemRepository.findOne({
      where: { id: itemId, cart: { user: { id: user.id } } },
    });

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemRepository.remove(cartItem);

    return this.getCart(user);
  }

  async clearCart(user: User): Promise<void> {
    const cart = await this.getCart(user);
    if (cart.items.length > 0) {
      await this.cartItemRepository.remove(cart.items);
    }
  }
}
