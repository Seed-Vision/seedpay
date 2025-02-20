import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { FriendRequest_Status } from "./friend-request.interface";




@Entity('request')
export class FriendRequestEntity {
    @PrimaryGeneratedColumn()
    id: number;


    @ManyToOne(()=> UserEntity, (userEntity) => userEntity.sendFriendRequests)
    creator : UserEntity;

    @ManyToOne(()=> UserEntity, (userEntity) => userEntity.receivedFriendRequests)
    receiver : UserEntity;


    @Column()
    status: FriendRequest_Status;


}