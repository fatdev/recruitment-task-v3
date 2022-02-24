import {
  ArrayNotEmpty,
  ArrayUnique,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from "class-validator";

export class MovieDTO {
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsNumberString()
  year: string;

  @IsNotEmpty()
  @IsNumberString()
  runtime: string;

  @ArrayNotEmpty()
  @ArrayUnique()
  genres: string[];

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  director: string;

  @IsOptional()
  @IsString()
  actors?: string;

  @IsOptional()
  @IsString()
  plot?: string;

  @IsOptional()
  @IsUrl()
  posterUrl?: string;
}
