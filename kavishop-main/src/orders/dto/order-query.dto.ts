import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { OrderStatus } from '../entities/order.entity';

export class OrderQueryDto extends PageOptionsDto {
  @ApiPropertyOptional({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  readonly status?: OrderStatus;
}
