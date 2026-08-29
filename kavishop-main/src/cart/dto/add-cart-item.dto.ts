import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  product_id!: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity!: number;
}
