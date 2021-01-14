import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Developers')
export default class Developers {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  age: number;

  @Column()
  hobby: string;

  @Column()
  birth: Date;
}
