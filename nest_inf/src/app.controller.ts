import { Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ILike, In, LessThan, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostModel } from './posts/entities/post.entity';


@Controller()
export class AppController {
  constructor(

  ) {}

}