import { Controller, Post, UploadedFile, UseGuards, UseInterceptors, Request, BadRequestException, Logger, Res, Get, Param, NotFoundException, HttpCode, Put, Body } from '@nestjs/common';
import { JwtGuard } from '../guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { isFileExtensionSafe, saveImageToStorage, removeFile } from '../helpers/image-storage';
import { UserService } from '../services/user.service';
import { switchMap, catchError, of, Observable } from 'rxjs';
import { join } from 'path';
import { existsSync } from 'fs';
import { User } from './models/user.class';
import { FriendRequest, FriendRequestStatus } from './models/friend-request.interface';

@Controller('user')
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService) {}

    @UseGuards(JwtGuard)
    @Post('upload')
    @UseInterceptors(FileInterceptor('file', saveImageToStorage))
    uploadImage(@UploadedFile() file: Express.Multer.File, @Request() req): Observable<{ avatarUrl: string }> {
        if (!file) {
            throw new BadRequestException('Aucun fichier téléchargé ou fichier invalide. Veuillez télécharger une image.');
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
                    this.logger.error(`Type de fichier non autorisé. Types valides: image/jpeg, image/jpg, image/png`);
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

    @UseGuards(JwtGuard)
    @Get(':userId')
    findUserById(@Param('userId') userStringId: string): Observable<User> {
        const userId = parseInt(userStringId);
        return this.userService.findUserById(userId);
    }

    @UseGuards(JwtGuard)
    @Post('friend-request/send/:receiverId')
    @HttpCode(201) // Envoi un code 201 pour une requête réussie
    sendFriendRequest(@Param('receiverId') receiverStringId: string, @Request() req): Observable<FriendRequest | { error: string }> {
        const receiverId = parseInt(receiverStringId);
        
        if (isNaN(receiverId)) {
            throw new BadRequestException('L\'ID du destinataire est invalide.');
        }
    
        const creator = req.user; // Récupérer l'utilisateur authentifié
        return this.userService.sendFriendRequest(receiverId, creator);
    }

    @UseGuards(JwtGuard)
    @Get('friend-request/status/:receiverId')
    getFriendRequestStatus(@Param('receiverId') receiverStringId: string, @Request() req): Observable<FriendRequestStatus> {
        const receiverId = parseInt(receiverStringId);
        return this.userService.getFriendRequestStatus(receiverId, req.user);
    }


    @UseGuards(JwtGuard)
    @Put('friend-request/response/:friendRequestId')
    respondToFriendRequest(
        @Param('friendRequestId') friendRequestStringId: string, 
        @Body() statusResponse: FriendRequestStatus): Observable<FriendRequestStatus> {
        const friendRequestId = parseInt(friendRequestStringId);
        return this.userService.respondToFriendRequest(statusResponse.status, friendRequestId );
    }

    @UseGuards(JwtGuard)
    @Get('friend-request/me/:received-requests')
    getFriendRequestsFromRecipients(
         @Request() req,
        ): Observable<FriendRequestStatus[]> {
        return this.userService.getFriendRequestsFromRecipients(req.user);
    }
}
