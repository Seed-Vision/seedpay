import { Module } from '@nestjs/common';
import { FeexpayService } from './feexpay.service';
import { FeexpayController } from './feexpay.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],  // Importation de HttpModule pour utiliser Axios dans le service
  providers: [FeexpayService],
  controllers: [FeexpayController]
})
export class FeexpayModule {}
