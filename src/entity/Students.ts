import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('Students')
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
  class_: string;

  @Column()
  birth: Date;
}
