import { Column, Entity, PrimaryGeneratedColumn,CreateDateColumn,UpdateDateColumn } from "typeorm";


@Entity('products')
export class Products
{
    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:'varchar', length:255})
    name:string;
     @Column({type:'varchar', nullable:true})
     description:string;
     @Column({type:'decimal',precision:10,scale:2})
     price:number;
     @Column({type:'int',default:0})
     stock:number;
      @Column({ type: 'varchar', length: 100 })
      category: string;
      @Column({ type: 'boolean', default: true })
      isActive: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

     @UpdateDateColumn({ type: 'timestamp' })
     updatedAt: Date;
}