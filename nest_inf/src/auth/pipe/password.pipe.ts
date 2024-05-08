import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";


@Injectable()
export class PasswordPipe implements PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata) {
    if(value.toString().length > 8){
      throw new Error('Password is too long');
    }
    return value.toString(); 
  }
}