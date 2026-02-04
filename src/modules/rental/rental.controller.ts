import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RentalService } from './rental.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { SearchOfferDto } from './dto/search-offer.dto';

@ApiTags('rental')
@Controller('rental')
export class RentalController {
  constructor(private readonly rentalService: RentalService) {}

  @Post('offers')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une offre de location' })
  async createOffer(@CurrentUser() user: any, @Body() dto: CreateOfferDto) {
    return this.rentalService.createOffer(user.id, dto);
  }

  @Patch('offers/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifier une offre de location' })
  async updateOffer(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateOfferDto,
  ) {
    return this.rentalService.updateOffer(id, user.id, dto);
  }

  @Get('offers/mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer mes offres de location' })
  async getMyOffers(@CurrentUser() user: any) {
    return this.rentalService.getMyOffers(user.id);
  }

  @Get('offers/search')
  @ApiOperation({ summary: 'Rechercher des offres de location disponibles' })
  async searchOffers(@Query() query: SearchOfferDto) {
    return this.rentalService.searchOffers(query);
  }

  @Get('offers/:id')
  @ApiOperation({ summary: 'Récupérer une offre par ID' })
  async findOffer(@Param('id') id: string) {
    return this.rentalService.findOfferById(id);
  }

  @Post('offers/:id/bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une réservation de location' })
  async createBooking(
    @Param('id') offerId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateBookingDto,
  ) {
    return this.rentalService.createBookingWithOverlapCheck(offerId, user.id, dto);
  }

  @Patch('bookings/:id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accepter une réservation (propriétaire)' })
  async acceptBooking(
    @Param('id') bookingId: string,
    @CurrentUser() user: any,
  ) {
    return this.rentalService.acceptBooking(bookingId, user.id);
  }

  @Patch('bookings/:id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refuser une réservation (propriétaire)' })
  async rejectBooking(
    @Param('id') bookingId: string,
    @CurrentUser() user: any,
  ) {
    return this.rentalService.rejectBooking(bookingId, user.id);
  }

  @Patch('bookings/:id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Annuler ma réservation (locataire)' })
  async cancelBooking(
    @Param('id') bookingId: string,
    @CurrentUser() user: any,
  ) {
    return this.rentalService.cancelBookingByRenter(bookingId, user.id);
  }

  @Patch('bookings/:id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marquer une location comme terminée (propriétaire)' })
  async completeBooking(
    @Param('id') bookingId: string,
    @CurrentUser() user: any,
  ) {
    return this.rentalService.completeBooking(bookingId, user.id);
  }

  @Get('bookings/mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer mes réservations de location' })
  async getMyBookings(@CurrentUser() user: any) {
    return this.rentalService.getMyBookings(user.id);
  }
}
