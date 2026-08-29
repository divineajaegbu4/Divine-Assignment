import {
  Controller,
  Post,
  Get,
  UseGuards,
  Query,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { CheckoutDto } from './dto/checkout.dto';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async checkout(@CurrentUser() user: User, @Body() checkoutDto: CheckoutDto) {
    return this.ordersService.checkout(user, checkoutDto);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER)
  async getCustomerOrders(
    @CurrentUser() user: User,
    @Query() queryDto: OrderQueryDto,
  ) {
    return this.ordersService.findCustomerOrders(user, queryDto);
  }

  @Get('merchant/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  async getMerchantOrders(
    @CurrentUser() user: User,
    @Query() queryDto: OrderQueryDto,
  ) {
    return this.ordersService.findMerchantOrders(user, queryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.MERCHANT)
  @Patch('orders/:id/status')
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
    @CurrentUser() user: User,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto, user);
  }
}
