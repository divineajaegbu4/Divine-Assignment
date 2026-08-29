import { PageOptionsDto } from '../../common/dto/page-options.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewQueryDto extends PageOptionsDto {
  @ApiPropertyOptional({ description: 'Filter by rating' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  readonly rating?: number;
}
