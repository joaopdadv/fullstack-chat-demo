import { PartialType } from '@nestjs/mapped-types';
import { IsBase64, IsOptional } from 'class-validator';
import { RegisterDto } from 'src/auth/Validation';

export class UpdateUserDto extends PartialType(RegisterDto) {
}
