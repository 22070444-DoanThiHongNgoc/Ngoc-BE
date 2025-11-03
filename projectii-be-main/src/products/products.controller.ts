import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/request/create-product.dto';
import { UpdateProductDto } from './dto/request/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // 🟢 CREATE PRODUCT (with image upload)
  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueName}${ext}`);
        },
      }),
    }),
  )
  async create(@Body() dto: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
    if (file) {
      dto.image = `/uploads/products/${file.filename}`;
    }
    return this.productsService.create(dto);
  }

  // 🔍 GET ALL PRODUCTS (search + filter)
  @Get()
  findAll(@Query('search') search?: string, @Query('isActive') isActive?: string) {
    const active = isActive !== undefined ? isActive === 'true' : undefined;
    return this.productsService.findAll(search, active);
  }

  // 🔝 GET TOP PRODUCTS BY PRICE
  @Get('top')
  findTop() {
    return this.productsService.findTopByPrice();
  }

  // 🔍 GET ONE PRODUCT BY ID
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  // ✏️ UPDATE PRODUCT (with optional new image)
  @Put(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `${uniqueName}${ext}`);
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      dto.image = `/uploads/products/${file.filename}`;
    }
    return this.productsService.update(id, dto);
  }

  // 🗑️ DELETE PRODUCT
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}
