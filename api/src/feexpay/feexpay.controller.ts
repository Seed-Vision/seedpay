import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FeexpayService } from './feexpay.service';
import { JwtGuard } from '../auth/guards/jwt.guard'; 

@Controller('feexpay')
export class FeexpayController {
  constructor(private readonly feexpayService: FeexpayService) {}

  // Route protégée, nécessite un utilisateur authentifié
  @UseGuards(JwtGuard)
  @Post('payment')
  async createPayment(@Body() data: any, @Request() req) {
    // Vérifier que l'utilisateur est bien authentifié
    const user = req.user;
    if (!user) {
      throw new Error('Utilisateur non authentifié');
    }

    console.log('Utilisateur authentifié:', user);

    try {
      // Appel au service pour créer un paiement via l'API Feexpay
      const result = await this.feexpayService.createPayment(data, user);
      return result;  // Retourne le résultat de la requête de paiement
    } catch (error) {
      // Gérer les erreurs si quelque chose échoue dans l'API Feexpay
      console.error('Erreur dans la création du paiement:', error.message);
      throw error;  // Relancer l'erreur pour être gérée par un middleware ou un handler global
    }
  }
}
