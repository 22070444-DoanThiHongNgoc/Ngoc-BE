import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  status?: string; // chỉ cho phép update trạng thái để đơn giản
}
