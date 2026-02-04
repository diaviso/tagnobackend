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
import { CarpoolService } from './carpool.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { SearchTripDto } from './dto/search-trip.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';

@ApiTags('carpool')
@Controller('carpool')
export class CarpoolController {
  constructor(private readonly carpoolService: CarpoolService) {}

  @Post('trips')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un nouveau trajet de covoiturage' })
  async createTrip(@CurrentUser() user: any, @Body() dto: CreateTripDto) {
    return this.carpoolService.createTrip(user.id, dto);
  }

  @Get('trips/mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer mes trajets en tant que conducteur' })
  async getMyTrips(@CurrentUser() user: any) {
    return this.carpoolService.getMyTrips(user.id);
  }

  @Get('trips/search')
  @ApiOperation({ summary: 'Rechercher des trajets disponibles' })
  async searchTrips(@Query() query: SearchTripDto) {
    return this.carpoolService.searchTrips(query);
  }

  @Get('trips/:id')
  @ApiOperation({ summary: 'Récupérer un trajet par ID' })
  async findTrip(@Param('id') id: string) {
    return this.carpoolService.findTripById(id);
  }

  @Post('trips/:id/reservations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Réserver des places sur un trajet' })
  async createReservation(
    @Param('id') tripId: string,
    @CurrentUser() user: any,
    @Body() dto: CreateReservationDto,
  ) {
    return this.carpoolService.reserveWithTransaction(tripId, user.id, dto);
  }

  @Patch('reservations/:id/accept')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Accepter une réservation (conducteur)' })
  async acceptReservation(
    @Param('id') reservationId: string,
    @CurrentUser() user: any,
  ) {
    return this.carpoolService.acceptReservation(reservationId, user.id);
  }

  @Patch('reservations/:id/reject')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refuser une réservation (conducteur)' })
  async rejectReservation(
    @Param('id') reservationId: string,
    @CurrentUser() user: any,
  ) {
    return this.carpoolService.rejectReservation(reservationId, user.id);
  }

  @Patch('reservations/:id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Annuler ma réservation (passager)' })
  async cancelReservation(
    @Param('id') reservationId: string,
    @CurrentUser() user: any,
  ) {
    return this.carpoolService.cancelReservationByPassenger(reservationId, user.id);
  }

  @Get('reservations/mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Récupérer mes réservations en tant que passager' })
  async getMyReservations(@CurrentUser() user: any) {
    return this.carpoolService.getMyReservations(user.id);
  }

  @Patch('trips/:id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Annuler un trajet (conducteur)' })
  async cancelTrip(@Param('id') tripId: string, @CurrentUser() user: any) {
    return this.carpoolService.cancelTrip(tripId, user.id);
  }

  @Patch('trips/:id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marquer un trajet comme complété (conducteur)' })
  async completeTrip(@Param('id') tripId: string, @CurrentUser() user: any) {
    return this.carpoolService.completeTrip(tripId, user.id);
  }
}
