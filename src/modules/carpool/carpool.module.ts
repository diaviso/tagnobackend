import { Module } from '@nestjs/common';
import { CarpoolController } from './carpool.controller';
import { CarpoolService } from './carpool.service';
import { VehiclesModule } from '../vehicles/vehicles.module';

@Module({
  imports: [VehiclesModule],
  controllers: [CarpoolController],
  providers: [CarpoolService],
  exports: [CarpoolService],
})
export class CarpoolModule {}
