import { IsNotEmpty, IsString, IsUrl, Length } from "class-validator";

export class ImageDetail {
    @IsString()
    @IsNotEmpty()
    @IsUrl()
    @Length(5, 2048)
    src: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    alt: string;
}