/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from './products-status.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SearchProductDto } from './dto/search-product.dto';

export class ProductRepository extends Repository<Product> {
  static async createProducts(
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    const product = new Product();
    product.name = createProductDto.name;
    product.sku = createProductDto.sku;
    product.description = createProductDto.description;
    product.status = ProductStatus.ACTIVE;
    await product.save();

    return product;
  }

  static async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Product not found with ${id}`,
      });
    }
    product.status = updateProductDto.status;
    await product.save();

    return product;
  }
}
