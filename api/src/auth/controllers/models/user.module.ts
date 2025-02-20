import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { FriendRequestEntity } from './friend-request.entity'; 
import { UserController } from '../user.controller';
import { UserService } from 'src/auth/services/user.service';


@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, FriendRequestEntity])], // Ajoute FriendRequestEntity
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
