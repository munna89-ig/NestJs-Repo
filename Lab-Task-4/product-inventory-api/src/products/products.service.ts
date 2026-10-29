import { Injectable,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from './entities/products.entity.js';
import { ILike, Repository } from 'typeorm';
import { getPriority } from 'os';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PartialUpdateDto } from './dto/partial-update-product.dto.js';

@Injectable()
export class ProductsService {
   constructor(@InjectRepository(Products) private readonly productRepo:Repository<Products>)
    {
      
    }
     private async getProduct(id:number):Promise<Products>
    {
         const product = await this.productRepo.findOne({ where: { id } });
         if (!product)
         {
            throw new NotFoundException(`Product with id ${id} not found`);
         } 
          return product;
    }

    async create(data:CreateProductDto)
    {
        const product= await this.productRepo.create(data)
        const saved= await this.productRepo.save(product)
        return{
            message:"Product Created successfully",
            data:saved
        }
    }

    async findAll()
    {
        const data= await this.productRepo.find({order:{createdAt:"DESC"}});
        return data;
    }

    async findOne(id:number)
    {
        const product= await this.getProduct(id)
        return product;
    }

    async update(id:number, data:PartialUpdateDto)
    {
        const product= await this.getProduct(id);
        Object.assign(product,data)

        return await this.productRepo.save(product);
    }

    async replace(id:number, data:UpdateProductDto)
    {
         const product= await this.getProduct(id);
         Object.assign(product,
            {
                name:data.name,
                description:data.description ?? null,
                price: data.price,
                stock: data.stock ?? 0,
                 category: data.category,
                isActive: data.isActive ?? true,
            } )

            return await this.productRepo.save(product);
    }

    async remove(id:number)
    {
        const res = (await this.productRepo.delete(id));
        if (res.affected) {
         return `user deleted successfullu id ${id}`;
        } else {
         return 'user not found';
        }
    }

     async findByCategory(category: string) {
       const products = await this.productRepo.find({where: { category },order: { createdAt: 'DESC' }});

       return products;
     }
     async search(keyword: string) {
    const products = await this.productRepo.find({where: { name: ILike(`%${keyword ?? ''}%`) }, order: { createdAt: 'DESC' }, });
    return products;
    }
    async toggleActive(id: number)
    {
      const product = await this.getProduct(id);
       product.isActive = !product.isActive;
       const saved = await this.productRepo.save(product);
      return product;
    }
 

}

