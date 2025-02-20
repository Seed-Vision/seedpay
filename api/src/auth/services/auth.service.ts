import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../controllers/models/user.entity';
import { User } from '../controllers/models/user.class';
import { MailerService } from 'src/mailer/mailer.service';
import * as speakeasy from 'speakeasy';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
        private readonly mailerService: MailerService,
    ) {}

    hashPassword(password: string): Observable<string> {
        return from(bcrypt.hash(password, 12));
    }

    registerAccount(user: User): Observable<User> {
        const { firstName, lastName, email, password } = user;

        return this.hashPassword(password).pipe(
            switchMap((hashedPassword: string) =>
                from(
                    this.userRepository.save({
                        firstName,
                        lastName,
                        email,
                        password: hashedPassword,
                    }),
                ).pipe(
                    map((user: User) => {
                        delete user.password;
                        this.sendConfirmationEmail(user.email);
                        return user;
                    }),
                    catchError(err => {
                        return throwError(() => new HttpException('Erreur lors de l\'inscription', HttpStatus.INTERNAL_SERVER_ERROR));
                    }),
                ),
            ),
        );
    }

    private async sendConfirmationEmail(userEmail: string) {
        const token = await this.jwtService.signAsync({ email: userEmail }, { expiresIn: '1h' });

        const confirmationUrl = `http://localhost:3000/auth/confirm?token=${token}`;

        await this.mailerService.sendSignupConfirmation(userEmail, confirmationUrl);
    }

    validateUser(email: string, password: string): Observable<User> {
        return from(
            this.userRepository.findOne({
                where: { email },
                select: ['id', 'firstName', 'lastName', 'email', 'password', 'role'],
            }),
        ).pipe(
            switchMap((user: User | null) => {
                if (!user) {
                    return throwError(() =>
                        new HttpException(
                            { status: HttpStatus.NOT_FOUND, error: 'Email non trouvé' },
                            HttpStatus.NOT_FOUND,
                        ),
                    );
                }

                return from(bcrypt.compare(password, user.password)).pipe(
                    map((isValidPassword: boolean) => {
                        if (!isValidPassword) {
                            throw new HttpException(
                                { status: HttpStatus.UNAUTHORIZED, error: 'Mot de passe incorrect' },
                                HttpStatus.UNAUTHORIZED,
                            );
                        }
                        delete user.password;
                        return user;
                    }),
                );
            }),
            catchError(err => {
                return throwError(() => err);
            }),
        );
    }

    login(user: User): Observable<string> {
        const { email, password } = user;

        return this.validateUser(email, password).pipe(
            switchMap((validatedUser: User) => {
                if (!validatedUser) {
                    return throwError(() =>
                        new HttpException(
                            { status: HttpStatus.UNAUTHORIZED, error: 'Invalid Credentials' },
                            HttpStatus.UNAUTHORIZED,
                        ),
                    );
                }
                return from(this.jwtService.signAsync({ user: validatedUser }));
            }),
            catchError(err => {
                return throwError(() => err);
            }),
        );
    }

    // 🔹 Génération et envoi du OTP pour réinitialisation de mot de passe
    resetPasswordDemand(email: string) {
        return from(
            this.userRepository.findOne({ where: { email } })
        ).pipe(
            switchMap(user => {
                if (!user) {
                    return throwError(() =>
                        new HttpException(
                            { status: HttpStatus.NOT_FOUND, error: 'Email non trouvé' },
                            HttpStatus.NOT_FOUND,
                        ),
                    );
                }

                // Générer un OTP sécurisé avec Speakeasy
                const otp = speakeasy.totp({
                    secret: process.env.SPEAKEASY_SECRET,
                    digits: 5,
                    step: 60 * 15,
                    encoding: 'base32',
                });

                console.log(`OTP généré pour ${email} :`, otp);

                // Envoi de l'email contenant l'OTP
                return from(this.mailerService.sendPasswordResetOTP(user.email, otp));
            }),
            catchError(err => {
                return throwError(() => new HttpException('Erreur lors de la demande de réinitialisation', HttpStatus.INTERNAL_SERVER_ERROR));
            })
        );
    }

    // 🔹 Vérification de l'OTP saisi par l'utilisateur
    verifyOTP(email: string, otp: string): boolean {
        return speakeasy.totp.verify({
            secret: process.env.SPEAKEASY_SECRET,
            encoding: 'base32',
            token: otp,
            window: 1, // Permet une légère tolérance dans le temps
        });
    }

    // 🔹 Réinitialisation du mot de passe avec confirmation de l'OTP
    resetPasswordConfirmation(email: string, otp: string, newPassword: string): Observable<any> {
        return from(this.userRepository.findOne({ where: { email } })).pipe(
            switchMap(user => {
                if (!user) {
                    return throwError(() =>
                        new HttpException(
                            { status: HttpStatus.NOT_FOUND, error: 'Email non trouvé' },
                            HttpStatus.NOT_FOUND,
                        ),
                    );
                }

                // Vérification de l'OTP
                const isOtpValid = this.verifyOTP(email, otp);
                if (!isOtpValid) {
                    return throwError(() =>
                        new HttpException(
                            { status: HttpStatus.BAD_REQUEST, error: 'OTP invalide' },
                            HttpStatus.BAD_REQUEST,
                        ),
                    );
                }

                // Hachage du nouveau mot de passe
                return this.hashPassword(newPassword).pipe(
                    switchMap(hashedPassword => {
                        user.password = hashedPassword;
                        return from(this.userRepository.save(user)).pipe(
                            map(() => ({
                                status: 'success',
                                message: 'Mot de passe réinitialisé avec succès',
                            })),
                        );
                    }),
                );
            }),
            catchError(err => {
                return throwError(() => new HttpException('Erreur lors de la réinitialisation du mot de passe', HttpStatus.INTERNAL_SERVER_ERROR));
            }),
        );
    }
}