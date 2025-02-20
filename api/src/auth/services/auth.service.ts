import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../controllers/models/user.entity';
import { User } from '../controllers/models/user.class';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private jwtService: JwtService,
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
                        return user;
                    }),
                    catchError(err => {
                        return throwError(() => new HttpException('Erreur lors de l\'inscription', HttpStatus.INTERNAL_SERVER_ERROR));
                    }),
                ),
            ),
        );
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
}
