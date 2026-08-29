import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { AddWishlistItemDto } from './dto/add-wishlist-item.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Wishlist')
@Controller('wishlist')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Get current user wishlist' })
  getWishlist(@CurrentUser() user: User) {
    return this.wishlistService.getWishlist(user);
  }

  @Post('items')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Add product to wishlist' })
  addItem(
    @CurrentUser() user: User,
    @Body() addWishlistItemDto: AddWishlistItemDto,
  ) {
    return this.wishlistService.addItem(user, addWishlistItemDto);
  }

  @Delete('items/:productId')
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Remove product from wishlist' })
  removeItem(@CurrentUser() user: User, @Param('productId') productId: string) {
    return this.wishlistService.removeItem(user, productId);
  }

  @Delete()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Clear wishlist' })
  clearWishlist(@CurrentUser() user: User) {
    return this.wishlistService.clearWishlist(user);
  }
}
