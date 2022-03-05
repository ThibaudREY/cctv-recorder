import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'recordings'})
export class Recording {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column()
    camera: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    date: string;
}
