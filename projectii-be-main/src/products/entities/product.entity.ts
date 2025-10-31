import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal')
  price: number;

  @Column('int')
  quantity: number;

  @Column({ nullable: true })
  image: string; // URL hoặc base64

  @Column({ default: true })
  isActive: boolean;
}
