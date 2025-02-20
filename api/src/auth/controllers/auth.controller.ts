import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from './models/user.class';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() user: User): Observable<User> {
        return this.authService.registerAccount(user);
    }

    @Post('login')
    login(@Body() user: User): Observable<{ token: string }> {
        return this.authService.login(user).pipe(map((jwt: string) => ({ token: jwt })));
    }

    @Post('reset-password')
    resetPasswordDemand(@Body() { email }: { email: string }) {
        return this.authService.resetPasswordDemand(email);
    }

    @Post('reset-password-confirmation')
    resetPasswordConfirmation(@Body() body: { email: string; otp: string; newPassword: string }) {
        // Validation des données
        if (!body.email || !body.otp || !body.newPassword) {
            throw new HttpException('Données invalides', HttpStatus.BAD_REQUEST);
        }
        
        return this.authService.resetPasswordConfirmation(body.email, body.otp, body.newPassword);
    }
}