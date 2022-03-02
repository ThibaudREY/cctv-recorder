// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-unsafe-assignment
const {Column, Entity, PrimaryGeneratedColumn, Table} = require("typeorm");

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
@Entity()
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
@Table({name: 'recordings'})
export class Recording {

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @PrimaryGeneratedColumn()
    id: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @Column()
    path: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @Column()
    camera: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    date: string;

}
