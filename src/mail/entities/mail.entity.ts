import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Mail{
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column()
    to: string;
    @Column()
    from: string;
    @Column()
    subject: string;
    @Column()
    text: string;
    @Column()
    html: string;
    @Column()
    emailSend: boolean;
    @Column()
    timestamp: string;
}