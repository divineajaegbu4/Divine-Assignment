import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({ description: 'The ID of the shipping address' })
  @IsUUID()
  @IsNotEmpty()
  addressId!: string;
}
