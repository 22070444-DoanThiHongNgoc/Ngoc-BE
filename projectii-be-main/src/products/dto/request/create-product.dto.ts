export class CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string; // ✅ Thêm dòng này
  isActive?: boolean;
  category?: string;
}
