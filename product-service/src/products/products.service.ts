/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  async findAll(filterDto: SearchProductDto): Promise<Product[]> {
    return this.productRepository.getProducts(filterDto);
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    return this.productRepository.createProducts(createProductDto);
  }

  async findOne(id: number): Promise<Product> {
    return this.productRepository.getProduct(id);
  }
  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productRepository.updateProduct(id, updateProductDto);
  }

  async remove(id: number): Promise<void> {
    const products = await this.productRepository.delete(id);
    if (products.affected === 0) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Product not found with ${id}`,
      });
    }
  }
}
