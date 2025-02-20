// import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
// import { from, Observable, catchError, throwError, of } from 'rxjs';
// import { switchMap, map, retry } from 'rxjs/operators';
// import { User } from '../controllers/models/user.class';
// import { Repository, UpdateResult } from 'typeorm';
// import { UserEntity } from '../controllers/models/user.entity';
// import { InjectRepository } from '@nestjs/typeorm';
// import { FriendRequest, FriendRequestStatus, FriendRequest_Status } from '../controllers/models/friend-request.interface';
// import { FriendRequestEntity } from '../controllers/models/friend-request.entity';

// @Injectable()
// export class UserService {
//     constructor(
//         @InjectRepository(UserEntity) 
//         private readonly userRepository: Repository<UserEntity>,
//         @InjectRepository(FriendRequestEntity) 
//         private readonly friendRequestRepository: Repository<FriendRequestEntity>,
//     ) {}

//     findUserById(id: number): Observable<User> {
//         return from(
//             this.userRepository.findOne({ where: { id }, relations: ['feedPosts'] })
//         ).pipe(
//             switchMap((user: User | null) => {
//                 if (!user) {
//                     return throwError(() =>
//                         new HttpException(
//                             { status: HttpStatus.NOT_FOUND, error: 'Utilisateur non trouvé' },
//                             HttpStatus.NOT_FOUND,
//                         ),
//                     );
//                 }
//                 delete user.password;
//                 return of(user); // Retourne l'utilisateur dans un Observable
//             }),
//             catchError(() => throwError(() => new NotFoundException('Utilisateur non trouvé')))
//         );
//     }
    

//     updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
//         return from(this.userRepository.update(id, { imagePath })).pipe(
//             catchError(() => throwError(() => new NotFoundException('Mise à jour impossible, utilisateur non trouvé')))
//         );
//     }

//     findImageNameByUserId(id: number): Observable<string> {
//         return from(this.userRepository.findOne({ where: { id } })).pipe(
//             map((user: User | null) => {
//                 if (!user) throw new NotFoundException('Utilisateur non trouvé');
//                 delete user.password; 
//                 return user.imagePath;
//             }),
//             catchError(() => throwError(() => new NotFoundException('Utilisateur non trouvé')))
//         );
//     }

//     hasRequestBeenSendOrReceived(creator: User, receiver: User): Observable<boolean> {
//         return from(this.friendRequestRepository.findOne({
//             where: [
//                 { creator, receiver },
//                 { creator: receiver, receiver: creator }
//             ]
//         })).pipe(
//             map((friendRequest: FriendRequest | null) => !!friendRequest)
//         );
//     }

//     sendFriendRequest(receiverId: number, creator: User): Observable<FriendRequest | { error: string }> {
//         if (receiverId === creator.id) return of({ error: 'Il est impossible de s’ajouter soi-même !' });
    
//         return from(this.userRepository.findOne({ where: { id: receiverId } })).pipe(
//             switchMap((receiver: User | null) => {
//                 if (!receiver) return of({ error: 'Destinataire non trouvé !' });
    
//                 return this.hasRequestBeenSendOrReceived(creator, receiver).pipe(
//                     switchMap((requestExists: boolean) => {
//                         if (requestExists) {
//                             return of({ error: 'Une demande d’amitié a déjà été envoyée ou reçue !' });
//                         }
    
//                         const friendRequest: FriendRequest = {
//                             creator,
//                             receiver,
//                             status: 'pending'
//                         };
    
//                         return from(this.friendRequestRepository.save(friendRequest));
//                     })
//                 );
//             }),
//             catchError(() => of({ error: 'Une erreur est survenue lors de l’envoi de la demande d’amitié' }))
//         );
//     }

//     getFriendRequestStatus(receiverId: number, currentUser: User): Observable<FriendRequestStatus> {
//         return this.findUserById(receiverId).pipe(
//             switchMap((receiver: User) => {
//                 return from(this.friendRequestRepository.findOne({
//                     where: [
//                         { creator: currentUser, receiver },
//                         { creator: receiver, receiver: currentUser }
//                     ]
//                 }));
//             }),
//             switchMap((friendRequest: FriendRequest | null) => {
//                 if (!friendRequest) {
//                     return of({ status: 'pending' as FriendRequest_Status }); // Assurez-vous que le status est 'pending' comme FriendRequest_Status
//                 }
//                 return of({ status: friendRequest.status as FriendRequest_Status }); // S'assurer que le status est bien de type FriendRequest_Status
//             })
//         );
//     }
//     getFriendToFriendRequestUserById(friendRequestId: number): Observable<FriendRequest>  {
//         return from(this.friendRequestRepository.findOne({
//             where: [{ id: friendRequestId}]
//         }))

//     }

//     respondToFriendRequest(
//         statusResponse: FriendRequest_Status,
//         friendRequestId: number
//     ): Observable<FriendRequestStatus> {
//         return this.getFriendToFriendRequestUserById(friendRequestId).pipe(
//             switchMap((friendRequest: FriendRequest) => {
//                 return from(this.friendRequestRepository.save({
//                     ...friendRequest,
//                     status:statusResponse
//                 }))
//             })
//         )
//     }
//     getFriendRequestsFromRecipients(
//         currentUser : User,
//     ): Observable<FriendRequest[]> {
//         return from(
//             this.friendRequestRepository.find({
//                 where : [{ receiver : currentUser }]
//             })
//         )
//     }
// }

import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { from, Observable, catchError, throwError, of } from 'rxjs';
import { switchMap, map, retry } from 'rxjs/operators';
import { User } from '../controllers/models/user.class';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../controllers/models/user.entity';
import { Role } from '../controllers/models/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest, FriendRequestStatus, FriendRequest_Status } from '../controllers/models/friend-request.interface';
import { FriendRequestEntity } from '../controllers/models/friend-request.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) 
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(FriendRequestEntity) 
        private readonly friendRequestRepository: Repository<FriendRequestEntity>,
    ) {}

    // Récupérer un utilisateur par ID
    findUserById(id: number): Observable<User> {
        return from(
            this.userRepository.findOne({ where: { id }, relations: ['feedPosts'] })
        ).pipe(
            switchMap((user: User | null) => {
                if (!user) {
                    return throwError(() =>
                        new HttpException(
                            { status: HttpStatus.NOT_FOUND, error: 'Utilisateur non trouvé' },
                            HttpStatus.NOT_FOUND,
                        ),
                    );
                }
                delete user.password;
                return of(user); // Retourne l'utilisateur dans un Observable
            }),
            catchError(() => throwError(() => new NotFoundException('Utilisateur non trouvé')))
        );
    }

    // Mettre à jour l'image de profil de l'utilisateur
    updateUserImageById(id: number, imagePath: string): Observable<UpdateResult> {
        return from(this.userRepository.update(id, { imagePath })).pipe(
            catchError(() => throwError(() => new NotFoundException('Mise à jour impossible, utilisateur non trouvé')))
        );
    }

    // Récupérer le nom de l'image d'un utilisateur
    findImageNameByUserId(id: number): Observable<string> {
        return from(this.userRepository.findOne({ where: { id } })).pipe(
            map((user: User | null) => {
                if (!user) throw new NotFoundException('Utilisateur non trouvé');
                delete user.password; 
                return user.imagePath;
            }),
            catchError(() => throwError(() => new NotFoundException('Utilisateur non trouvé')))
        );
    }


    getAllUsers(): Observable<User[]> {
        return from(this.userRepository.find({ relations: ['feedPosts'] })).pipe(
            map((users: User[]) => {
                // Optionnel : Supprimer le mot de passe pour chaque utilisateur avant de les renvoyer
                users.forEach(user => delete user.password);
                return users;
            }),
            catchError(() => throwError(() => new NotFoundException('Aucun utilisateur trouvé')))
        );
    }

    
    deleteUserById(id: number): Observable<DeleteResult> {
        return from(this.userRepository.delete(id)).pipe(
            switchMap((deleteResult: DeleteResult) => {
                if (deleteResult.affected === 0) {
                    return throwError(() => new NotFoundException('Utilisateur non trouvé'));
                }
                return of(deleteResult);
            }),
            catchError(() => throwError(() => new NotFoundException('Erreur lors de la suppression de l\'utilisateur')))
        );
    }

    
    assignAdminRole(id: number): Observable<UpdateResult> {
        return from(this.userRepository.update(id, { role: Role.ADMIN })).pipe(
            switchMap((updateResult: UpdateResult) => {
                if (updateResult.affected === 0) {
                    return throwError(() => new NotFoundException('Utilisateur non trouvé'));
                }
                return of(updateResult);
            }),
            catchError(() => throwError(() => new NotFoundException('Erreur lors de l\'assignation du rôle admin')))
        );
    }
    
    

    // Vérifier si une demande d'ami a déjà été envoyée ou reçue
    hasRequestBeenSendOrReceived(creator: User, receiver: User): Observable<boolean> {
        return from(this.friendRequestRepository.findOne({
            where: [
                { creator, receiver },
                { creator: receiver, receiver: creator }
            ]
        })).pipe(
            map((friendRequest: FriendRequest | null) => !!friendRequest)
        );
    }

    // Envoyer une demande d'ami
    sendFriendRequest(receiverId: number, creator: User): Observable<FriendRequest | { error: string }> {
        if (receiverId === creator.id) return of({ error: 'Il est impossible de s’ajouter soi-même !' });
    
        return from(this.userRepository.findOne({ where: { id: receiverId } })).pipe(
            switchMap((receiver: User | null) => {
                if (!receiver) return of({ error: 'Destinataire non trouvé !' });
    
                return this.hasRequestBeenSendOrReceived(creator, receiver).pipe(
                    switchMap((requestExists: boolean) => {
                        if (requestExists) {
                            return of({ error: 'Une demande d’amitié a déjà été envoyée ou reçue !' });
                        }
    
                        const friendRequest: FriendRequest = {
                            creator,
                            receiver,
                            status: 'pending'
                        };
    
                        return from(this.friendRequestRepository.save(friendRequest));
                    })
                );
            }),
            catchError(() => of({ error: 'Une erreur est survenue lors de l’envoi de la demande d’amitié' }))
        );
    }

    // Obtenir le statut d'une demande d'ami
    getFriendRequestStatus(receiverId: number, currentUser: User): Observable<FriendRequestStatus> {
        return this.findUserById(receiverId).pipe(
            switchMap((receiver: User) => {
                return from(this.friendRequestRepository.findOne({
                    where: [
                        { creator: currentUser, receiver },
                        { creator: receiver, receiver: currentUser }
                    ]
                }));
            }),
            switchMap((friendRequest: FriendRequest | null) => {
                if (!friendRequest) {
                    return of({ status: 'pending' as FriendRequest_Status }); // Assurez-vous que le status est 'pending' comme FriendRequest_Status
                }
                return of({ status: friendRequest.status as FriendRequest_Status }); // S'assurer que le status est bien de type FriendRequest_Status
            })
        );
    }

    // Récupérer la demande d'ami en fonction de son ID
    getFriendToFriendRequestUserById(friendRequestId: number): Observable<FriendRequest>  {
        return from(this.friendRequestRepository.findOne({
            where: [{ id: friendRequestId}]
        }))
    }

    // Répondre à une demande d'ami
    respondToFriendRequest(
        statusResponse: FriendRequest_Status,
        friendRequestId: number
    ): Observable<FriendRequestStatus> {
        return this.getFriendToFriendRequestUserById(friendRequestId).pipe(
            switchMap((friendRequest: FriendRequest) => {
                return from(this.friendRequestRepository.save({
                    ...friendRequest,
                    status:statusResponse
                }))
            })
        )
    }

    // Récupérer toutes les demandes d'amis reçues
    getFriendRequestsFromRecipients(
        currentUser : User,
    ): Observable<FriendRequest[]> {
        return from(
            this.friendRequestRepository.find({
                where : [{ receiver : currentUser }]
            })
        )
    }
}

