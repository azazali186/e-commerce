/* eslint-disable prettier/prettier */
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { ProductStatus } from '../products-status.enum';

export class SearchProductDto {
  @IsOptional()
  @IsIn([ProductStatus.ACTIVE, ProductStatus.INACTIVE])
  status: ProductStatus;
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
