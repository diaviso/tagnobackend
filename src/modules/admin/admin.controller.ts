import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AdminService } from './admin.service';
import { AdminVehicleQueryDto, RejectVehicleDto, AdminUserQueryDto, UpdateUserRoleDto } from './dto/admin-vehicle.dto';

@ApiTags('admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // ============== STATISTICS ==============
  @Get('statistics')
  @ApiOperation({ summary: 'Obtenir les statistiques globales' })
  async getStatistics() {
    return this.adminService.getStatistics();
  }

  // ============== VEHICLES ==============
  @Get('vehicles')
  @ApiOperation({ summary: 'Lister les véhicules (filtrable par status)' })
  async findVehicles(@Query() query: AdminVehicleQueryDto) {
    return this.adminService.findVehicles(query.status);
  }

  @Get('vehicles/:id')
  @ApiOperation({ summary: 'Obtenir les détails d\'un véhicule' })
  async getVehicleById(@Param('id') id: string) {
    return this.adminService.getVehicleById(id);
  }

  @Patch('vehicles/:id/approve')
  @ApiOperation({ summary: 'Approuver un véhicule' })
  async approveVehicle(@Param('id') id: string) {
    return this.adminService.approveVehicle(id);
  }

  @Patch('vehicles/:id/reject')
  @ApiOperation({ summary: 'Rejeter un véhicule' })
  async rejectVehicle(
    @Param('id') id: string,
    @Body() dto: RejectVehicleDto,
  ) {
    return this.adminService.rejectVehicle(id, dto.comment);
  }

  // ============== USERS ==============
  @Get('users')
  @ApiOperation({ summary: 'Lister les utilisateurs' })
  async findUsers(@Query() query: AdminUserQueryDto) {
    return this.adminService.findUsers(query.search);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Obtenir les détails d\'un utilisateur' })
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Patch('users/:id/role')
  @ApiOperation({ summary: 'Modifier le rôle d\'un utilisateur' })
  async updateUserRole(
    @Param('id') id: string,
    @Body() dto: UpdateUserRoleDto,
  ) {
    return this.adminService.updateUserRole(id, dto.role);
  }

  @Patch('users/:id/toggle-active')
  @ApiOperation({ summary: 'Activer/désactiver un utilisateur' })
  async toggleUserActive(@Param('id') id: string) {
    return this.adminService.toggleUserActive(id);
  }
}
