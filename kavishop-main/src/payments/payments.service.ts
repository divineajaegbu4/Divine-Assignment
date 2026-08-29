import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { Order, OrderStatus } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async processPayment(orderId: string, method: string): Promise<Payment> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `Order cannot be paid because its status is ${order.status}`,
      );
    }

    // Simulate payment processing
    const isSuccess = Math.random() > 0.1; // 90% success rate

    const payment = this.paymentsRepository.create({
      order,
      amount: order.total_amount,
      status: isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED,
      method,
    });

    await this.paymentsRepository.save(payment);

    if (isSuccess) {
      order.status = OrderStatus.PAID;
      await this.ordersRepository.save(order);
    } else {
      throw new BadRequestException('Payment failed. Please try again.');
    }

    return payment;
  }
}
