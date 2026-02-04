import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AddPhotoDto } from './dto/add-photo.dto';
import { AddDocumentDto } from './dto/add-document.dto';

@ApiTags('vehicles')
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau véhicule' })
  async create(@CurrentUser() user: any, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(user.id, dto);
  }

  @Get('mine')
  @ApiOperation({ summary: 'Récupérer mes véhicules' })
  async findMine(@CurrentUser() user: any) {
    return this.vehiclesService.findByOwner(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un véhicule par ID' })
  async findOne(@Param('id') id: string) {
    return this.vehiclesService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un véhicule' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(id, user.id, dto);
  }

  @Post(':id/photos')
  @ApiOperation({ summary: 'Ajouter une photo au véhicule' })
  async addPhoto(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: AddPhotoDto,
  ) {
    return this.vehiclesService.addPhoto(id, user.id, dto);
  }

  @Post(':id/documents')
  @ApiOperation({ summary: 'Ajouter un document au véhicule' })
  async addDocument(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() dto: AddDocumentDto,
  ) {
    return this.vehiclesService.addDocument(id, user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un véhicule' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.vehiclesService.delete(id, user.id);
  }

  @Delete(':id/photos/:photoId')
  @ApiOperation({ summary: 'Supprimer une photo du véhicule' })
  async deletePhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
    @CurrentUser() user: any,
  ) {
    return this.vehiclesService.deletePhoto(id, photoId, user.id);
  }

  @Patch(':id/photos/:photoId/main')
  @ApiOperation({ summary: 'Définir une photo comme principale' })
  async setMainPhoto(
    @Param('id') id: string,
    @Param('photoId') photoId: string,
    @CurrentUser() user: any,
  ) {
    return this.vehiclesService.setMainPhoto(id, photoId, user.id);
  }

  @Delete(':id/documents/:documentId')
  @ApiOperation({ summary: 'Supprimer un document du véhicule' })
  async deleteDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @CurrentUser() user: any,
  ) {
    return this.vehiclesService.deleteDocument(id, documentId, user.id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Activer/désactiver un véhicule' })
  async toggleActive(@Param('id') id: string, @CurrentUser() user: any) {
    return this.vehiclesService.toggleActive(id, user.id);
  }
}
