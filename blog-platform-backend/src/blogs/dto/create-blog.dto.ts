import { IsString, MinLength, MaxLength, IsBoolean, IsOptional } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  slug!: string;

  @IsString()
  @MinLength(10)
  content!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  summary?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
