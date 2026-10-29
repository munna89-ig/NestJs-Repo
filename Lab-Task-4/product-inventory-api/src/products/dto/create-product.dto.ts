import { Type } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min } from "class-validator";


export class CreateProductDto
{
    @IsString()
    @IsNotEmpty()

    name:string;
    @IsString()
    @IsOptional()
    description?:string;

    @Type(()=>Number)
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    price:number;
     @Type(()=>Number)
    @IsOptional()
    @IsInt()
    @Min(0)
    stock?:number;
    @IsString()
    @IsNotEmpty()
    category:string;
    @IsBoolean()
    @IsOptional()
    isActive?:boolean;
}