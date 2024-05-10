import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";


@Injectable()
export class PasswordPipe implements PipeTransform {
  async transform(value: string, metadata: ArgumentMetadata) {
    if(value.toString().length > 8){
      throw new Error('Password is too long');
    }
    return value.toString(); 
  }
}


@Injectable()
export class MaxLengthPipe implements PipeTransform {
  constructor(private readonly length: number, private readonly subject: string) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if(value.toString().length > this.length){
      throw new BadRequestException(`Value is too long, ${this.subject}`);
    }
    return value.toString(); 
  }
}

@Injectable()
export class MinLengthPipe implements PipeTransform {
  constructor(private readonly length: number) {}

  transform(value: any, metadata: ArgumentMetadata) {
    if(value.toString().length < this.length){
      throw new BadRequestException('Value is too short');
    }
    return value.toString(); 
  }
}