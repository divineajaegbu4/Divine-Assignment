import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiProperty,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

class ProcessPaymentDto {
  @ApiProperty({ example: 'CREDIT_CARD' })
  method!: string;
}

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':orderId/pay')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Simulate paying for an order' })
  async processPayment(
    @Param('orderId') orderId: string,
    @Body() body: ProcessPaymentDto,
  ) {
    return this.paymentsService.processPayment(orderId, body.method);
  }
}
