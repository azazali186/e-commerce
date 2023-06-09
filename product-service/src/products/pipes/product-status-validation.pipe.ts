/* eslint-disable prettier/prettier */
import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ProductStatus } from '../products-status.enum';

export class ProductStatusValidationPipes implements PipeTransform {
  readonly productStatus = [ProductStatus.ACTIVE, ProductStatus.INACTIVE];
  transform(value: any) {
    let val = value.status;
    if (val) {
      val = val.toUpperCase();
      if (!this.isValidStatus(val)) {
        throw new BadRequestException({
          statusCode: 400,
          message: `invalid product status ${val}`,
        });
      }
      value.status = val;
    }

    return value;
  }
  private isValidStatus(status: any) {
    const idx = this.productStatus.indexOf(status);
    return idx !== -1;
  }
}
