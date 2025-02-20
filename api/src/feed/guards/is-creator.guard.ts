import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { FeedService } from '../services/feed.service';
import { User } from 'src/auth/controllers/models/user.class';
import { request } from 'http';
import { FeedPost } from '../models/post.interface';
import { UserService } from 'src/auth/services/user.service';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(private authService:AuthService, private feedService: FeedService , private userService: UserService)
   {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request = context.switchToHttp().getRequest();
    
    const {  user , params } : { user: User; params: { id: number } } = request;

    if (!user || !params ) return false;

    if (user.role === 'admin') return true; //permettre aux administrateurs de faire des demandes


    const userId = user.id;
    const feedId = params.id;

    //Determiner si l'utilisateur connnecté est le même que l'utilisateur qui a crée la publication du fil d'actualité

    return this.userService.findUserById(userId).pipe(
      switchMap((foundUser: User | null) => {
        if (!foundUser) return of(false); // L'utilisateur n'existe pas
        return this.feedService.findPostById(feedId).pipe(
          map((feedPost: FeedPost | null) => {
            if (!feedPost || !feedPost.author) return false; // Si le post n'existe pas ou n'a pas d'auteur
            return foundUser.id === feedPost.author.id; // Vérifie si c'est bien l'auteur
          })
        );
      })
    );
    
  }
}
