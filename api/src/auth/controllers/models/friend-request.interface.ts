import { User } from "./user.class";

export type FriendRequest_Status = 'pending' | 'accepted' | 'declined';

export interface FriendRequestStatus {
    status?: FriendRequest_Status;
}


export interface FriendRequest {
    id? :number;
    creator?: User;
    receiver?:User;
    status?: FriendRequest_Status;

    
}