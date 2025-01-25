import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('feed_post') 
export class FeedPostEntity {
    @PrimaryColumn()
    id : number;

    @Column({ default: ''})
    body : string;

    @Column({ type : 'timestamp' , default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}