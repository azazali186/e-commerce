/* eslint-disable prettier/prettier */
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Aj189628@',
  database: 'nest-ecommerce-products',
  entities: [],
  autoLoadEntities: true,
  synchronize: true,
};
