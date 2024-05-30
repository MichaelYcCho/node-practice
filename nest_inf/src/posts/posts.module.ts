import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController } from './posts.controller'
import { PostsModel } from './entities/post.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from 'src/users/users.module'
import { AuthModule } from 'src/auth/auth.module'
import { CommonModule } from 'src/common/common.module'
import { MulterModule } from '@nestjs/platform-express'
import { extname } from 'path'
import * as multer from 'multer'
import { POST_IMAGE_PATH } from 'src/common/const/path.const'
import { v4 as uuid } from 'uuid'

@Module({
    imports: [
        TypeOrmModule.forFeature([PostsModel]),
        AuthModule,
        UsersModule,
        CommonModule,
        MulterModule.register({
            limits: {
                fileSize: 1024 * 1024 * 5,
            },
            fileFilter: (req, file, cb) => {
                // callback(에러, boolean) -> 첫번째 파라미터는 에러가 있을경우 에러정보를, 두번째 파라미터는 파일을 받을지 여부를 boolean으로 전달
                const ext = extname(file.originalname)
                if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                    return cb(new Error('Only images are allowed'), false)
                }
                return cb(null, true)
            },
            storage: multer.diskStorage({
                destination: function (req, file, cb) {
                    cb(null, POST_IMAGE_PATH)
                },
                filename: function (req, file, cb) {
                    cb(null, `${uuid()}${extname(file.originalname)}`)
                },
            }),
        }),
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule {}
