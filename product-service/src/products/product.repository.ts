/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductStatus } from './products-status.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearchProductDto } from './dto/search-product.dto';

export class ProductRepository extends Repository<Product> {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {
    super(
      productRepository.target,
      productRepository.manager,
      productRepository.queryRunner,
    );
  }
  async getProduct(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException({
        statusCode: 404,
        message: `Product not found with ${id}`,
      });
    }
    return product;
  }
  async getProducts(filterDto: SearchProductDto): Promise<Product[]> {
    const { status, search } = filterDto;
    const query = this.productRepository.createQueryBuilder('product');

    if (status) {
      query.andWhere('product.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(product.name LIKE :search OR product.sku LIKE :search)',
        {
          search: `%${search}%`,
        },
      );
    }

    const products = await query.getMany();

    return products;
  }
  async createProducts(createProductDto: CreateProductDto): Promise<Product> {
    const product = new Product();
    product.name = createProductDto.name;
    product.sku = createProductDto.sku;
    product.description = createProductDto.description;
    product.status = ProductStatus.ACTIVE;
    await product.save();

    return product;
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.getProduct(id);
    product.status = updateProductDto.status;
    await product.save();

    return product;
  }
}
