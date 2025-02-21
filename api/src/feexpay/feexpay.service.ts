import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FeexpayService {
  constructor(private readonly httpService: HttpService) {}

  // Méthode mise à jour pour créer un paiement via Feexpay
  async createPayment(data: any, user: any) {
    const url = `https://api.feexpay.me/api/transactions/public/requesttopay/mtn`; // URL correcte de l'API Feexpay
    const headers = {
      'Authorization': `Bearer ${process.env.FEEXPAY_API_KEY}`, // Utilisation du bon token API
      'Content-Type': 'application/json',
    };

    // Ajout d'informations sur l'utilisateur dans les données de paiement
    const paymentData = {
      ...data,
      userId: user.id,  // Ajout de l'ID utilisateur
      userEmail: user.email,  // Ajout de l'email utilisateur
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post(url, paymentData, { headers })
      );
      console.log('Réponse de Feexpay:', response.data); // Log pour le débogage
      return response.data;
    } catch (error) {
      console.error('Erreur de l\ API Feexpay:', error.response?.data || error.message);
      throw new Error(`Erreur de l'API Feexpay: ${error.message}`);
    }
  }
}
