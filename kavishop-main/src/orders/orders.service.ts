import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CartService } from '../cart/cart.service';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { PageDto } from '../common/dto/page.dto';
import { PageMetaDto } from '../common/dto/page-meta.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CheckoutDto } from './dto/checkout.dto';
import { Address } from '../addresses/entities/address.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    private cartService: CartService,
    private dataSource: DataSource,
  ) {}

  async checkout(user: User, checkoutDto: CheckoutDto): Promise<Order> {
    const cart = await this.cartService.getCart(user);
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const address = await queryRunner.manager.findOne(Address, {
        where: { id: checkoutDto.addressId, user: { id: user.id } },
      });
      if (!address) {
        throw new BadRequestException('Shipping address not found');
      }
      const shipping_address_snapshot = `${address.street}, ${address.city}, ${address.state} ${address.postal_code}, ${address.country}`;

      let totalAmount = 0;
      const orderItemsToCreate: Partial<OrderItem>[] = [];

      for (const cartItem of cart.items) {
        // Find product within transaction to lock it (pessimistic write)
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: cartItem.product.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product || product.stock_quantity < cartItem.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product ${product?.name || cartItem.product.id}`,
          );
        }

        // Deduct stock
        product.stock_quantity -= cartItem.quantity;
        await queryRunner.manager.save(product);

        const price = Number(product.price);
        totalAmount += price * cartItem.quantity;

        orderItemsToCreate.push({
          quantity: cartItem.quantity,
          price_at_purchase: price,
          product_name: product.name,
          product: product,
        });
      }

      // Create Order
      let order = queryRunner.manager.create(Order, {
        user,
        total_amount: totalAmount,
        status: OrderStatus.PENDING,
        shipping_address_snapshot,
      });
      order = await queryRunner.manager.save(order);

      // Create OrderItems
      for (const item of orderItemsToCreate) {
        const orderItem = queryRunner.manager.create(OrderItem, {
          ...item,
          order,
        });
        await queryRunner.manager.save(orderItem);
      }

      // Empty Cart (Delete CartItems)
      for (const cartItem of cart.items) {
        const itemToRemove = await queryRunner.manager.findOne(CartItem, {
          where: { id: cartItem.id },
        });
        if (itemToRemove) {
          await queryRunner.manager.remove(itemToRemove);
        }
      }

      await queryRunner.commitTransaction();

      const savedOrder = await this.ordersRepository.findOne({
        where: { id: order.id },
        relations: { items: true },
      });
      if (!savedOrder) throw new Error('Order not found after saving');
      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findCustomerOrders(
    user: User,
    queryDto: OrderQueryDto,
  ): Promise<PageDto<Order>> {
    const queryBuilder = this.ordersRepository.createQueryBuilder('order');
    queryBuilder.leftJoinAndSelect('order.items', 'items');
    queryBuilder.leftJoinAndSelect('items.product', 'product');
    queryBuilder.where('order.user_id = :userId', { userId: user.id });

    if (queryDto.status) {
      queryBuilder.andWhere('order.status = :status', {
        status: queryDto.status,
      });
    }

    if (queryDto.startDate) {
      queryBuilder.andWhere('order.created_at >= :startDate', {
        startDate: new Date(queryDto.startDate),
      });
    }

    if (queryDto.endDate) {
      queryBuilder.andWhere('order.created_at <= :endDate', {
        endDate: new Date(queryDto.endDate),
      });
    }

    const orderColumn = queryDto.orderBy
      ? `order.${queryDto.orderBy}`
      : 'order.created_at';

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

  async findMerchantOrders(
    merchant: User,
    queryDto: OrderQueryDto,
  ): Promise<PageDto<OrderItem>> {
    const queryBuilder =
      this.orderItemsRepository.createQueryBuilder('orderItem');
    queryBuilder.leftJoinAndSelect('orderItem.order', 'order');
    queryBuilder.leftJoinAndSelect('order.user', 'user');
    queryBuilder.leftJoinAndSelect('orderItem.product', 'product');
    queryBuilder.leftJoinAndSelect('product.store', 'store');
    queryBuilder.leftJoinAndSelect('store.merchant', 'merchant');

    queryBuilder.where('merchant.id = :merchantId', {
      merchantId: merchant.id,
    });

    if (queryDto.status) {
      queryBuilder.andWhere('order.status = :status', {
        status: queryDto.status,
      });
    }

    if (queryDto.startDate) {
      queryBuilder.andWhere('orderItem.created_at >= :startDate', {
        startDate: new Date(queryDto.startDate),
      });
    }

    if (queryDto.endDate) {
      queryBuilder.andWhere('orderItem.created_at <= :endDate', {
        endDate: new Date(queryDto.endDate),
      });
    }

    const orderColumn = queryDto.orderBy
      ? `orderItem.${queryDto.orderBy}`
      : 'orderItem.created_at';

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

  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
    merchant: User,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: { items: { product: { store: { merchant: true } } } },
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Check if the merchant owns at least one product in the order to be able to change its overall status
    const isMerchantOrder = order.items.some(
      (item) =>
        item.product &&
        item.product.store &&
        item.product.store.merchant &&
        item.product.store.merchant.id === merchant.id,
    );

    if (!isMerchantOrder) {
      throw new BadRequestException(
        'You cannot update an order that does not belong to your store',
      );
    }

    order.status = updateOrderStatusDto.status;
    return this.ordersRepository.save(order);
  }
}
