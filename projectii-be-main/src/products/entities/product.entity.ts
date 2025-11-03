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
  image: string; // lưu đường dẫn ảnh /uploads/products/xxx.png

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  category: string;
}
