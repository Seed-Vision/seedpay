import { 
    Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, 
    BadRequestException, Logger, Res, Get, Param, NotFoundException, 
    HttpCode, Put, Body, Delete 
} from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, saveImageToStorage, removeFile } from '../helpers/image-storage';

import { switchMap, catchError, of, Observable } from 'rxjs';
import { join } from 'path';
import { existsSync } from 'fs';
import { User } from './models/user.class';
import { FriendRequest, FriendRequestStatus } from './models/friend-request.interface';
import { Role } from './models/role.enum';
import { UpdateResult, DeleteResult } from 'typeorm';
import { UserService } from '../services/user.service';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService) {}

    // Récupérer tous les utilisateurs
   
    @UseGuards(JwtGuard, RolesGuard)  // Vérifie si l'utilisateur est authentifié et admin
    @Roles(Role.ADMIN)
    @Get('all')
    getAllUsers(): Observable<User[]> {
        return this.userService.getAllUsers();
    }

    // Récupérer un utilisateur par ID
    @UseGuards(JwtGuard)
    @Get(':id')
    findUserById(@Param('id') userId: number): Observable<User> {
        return this.userService.findUserById(userId);
    }

    // Supprimer un utilisateur
    @UseGuards(JwtGuard, RolesGuard)  // Vérifie si l'utilisateur est authentifié et admin
    @Roles(Role.ADMIN)
    @Delete(':id')
    deleteUserById(@Param('id') userId: number): Observable<DeleteResult> {
        return this.userService.deleteUserById(userId);
    }

    // Donner le rôle admin à un utilisateur
    @UseGuards(JwtGuard)
    @Put('assign-admin/:id')
    assignAdminRole(@Param('id') userId: number): Observable<UpdateResult> {
        return this.userService.assignAdminRole(userId);
    }

    // Upload d'image de profil
    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): Observable<{ avatarUrl: string }> {
        if (!file) {
            throw new BadRequestException('Aucun fichier téléchargé ou fichier invalide.');
        }

        const userId = req.user.id;
        const fullImagePath = join(process.cwd(), 'images', file.filename);

        return isFileExtensionSafe(fullImagePath).pipe(
            switchMap((isFileLegit: boolean) => {
                if (isFileLegit) {
                    return this.userService.updateUserImageById(userId, fullImagePath).pipe(
                        switchMap(() => {
                            const avatarUrl = `/user/image/${file.filename}`;
                            return of({ avatarUrl });
                        }),
                    );
                } else {
                    removeFile(fullImagePath);
                    this.logger.error('Type de fichier non autorisé.');
                    throw new BadRequestException('Type de fichier non autorisé.');
                }
            }),
            catchError((err) => {
                removeFile(fullImagePath);
                this.logger.error(`Erreur lors de la validation du fichier: ${err.message}`);
                throw new BadRequestException(`Erreur lors de la validation du fichier: ${err.message}`);
            })
        );
    }

    // Récupérer l'image d'un utilisateur
    @UseGuards(JwtGuard)
    @Get('image/:imageName')
    findImage(@Param('imageName') imageName: string, @Res() res): void {
        const imagePath = join(process.cwd(), 'images', imageName);

        if (existsSync(imagePath)) {
            res.sendFile(imageName, { root: './images' });
        } else {
            this.logger.error(`Image introuvable: ${imageName}`);
            throw new NotFoundException('Image non trouvée.');
        }
    }

    // Récupérer le nom de l'image d'un utilisateur
    @UseGuards(JwtGuard)
    @Get('image-name')
    findUserImageName(@Request() req): Observable<{ imageName: string }> {
        const userId = req.user.id;
        return this.userService.findImageNameByUserId(userId).pipe(
            switchMap((imageName: string) => {
                return of({ imageName });
            }),
            catchError((err) => {
                this.logger.error(`Erreur lors de la récupération du nom d'image: ${err.message}`);
                throw new BadRequestException('Erreur lors de la récupération du nom de l\'image.');
            })
        );
    }

    // Envoyer une demande d'ami
    @UseGuards(JwtGuard)
    @Post('friend-request/send/:receiverId')
    @HttpCode(201)
    sendFriendRequest(@Param('receiverId') receiverId: number, @Request() req): Observable<FriendRequest | { error: string }> {
        if (isNaN(receiverId)) {
            throw new BadRequestException('L\'ID du destinataire est invalide.');
        }
        return this.userService.sendFriendRequest(receiverId, req.user);
    }

    // Obtenir le statut d'une demande d'ami
    @UseGuards(JwtGuard)
    @Get('friend-request/status/:receiverId')
    getFriendRequestStatus(@Param('receiverId') receiverId: number, @Request() req): Observable<FriendRequestStatus> {
        return this.userService.getFriendRequestStatus(receiverId, req.user);
    }

    // Répondre à une demande d'ami
    @UseGuards(JwtGuard)
    @Put('friend-request/response/:friendRequestId')
    respondToFriendRequest(@Param('friendRequestId') friendRequestId: number, @Body() statusResponse: FriendRequestStatus): Observable<FriendRequestStatus> {
        return this.userService.respondToFriendRequest(statusResponse.status, friendRequestId);
    }

    // Récupérer les demandes d'amis reçues
    @UseGuards(JwtGuard)
    @Get('friend-request/me/received-requests')
    getFriendRequestsFromRecipients(@Request() req): Observable<FriendRequestStatus[]> {
        return this.userService.getFriendRequestsFromRecipients(req.user);
    }
}
