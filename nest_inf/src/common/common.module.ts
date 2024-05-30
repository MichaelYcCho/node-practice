import { BadRequestException, Module } from '@nestjs/common'
import { CommonService } from './common.service'
import * as multer from 'multer'
import { TEMP_FOLDER_PATH } from 'src/common/const/path.const'
import { v4 as uuid } from 'uuid'
import { MulterModule } from '@nestjs/platform-express'
import { extname } from 'path'
import { CommonController } from './common.controller'
import { AuthModule } from 'src/auth/auth.module'
import { UsersModule } from 'src/users/users.module'

@Module({
    imports: [
        AuthModule,
        UsersModule,
        MulterModule.register({
            limits: {
                // 바이트 단위로 입력(10MB)
                fileSize: 1024 * 1024 * 10,
            },
            fileFilter: (req, file, cb) => {
                // callback(에러, boolean) -> 첫번째 파라미터는 에러가 있을경우 에러정보를, 두번째 파라미터는 파일을 받을지 여부를 boolean으로 전달
                const ext = extname(file.originalname)

                if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
                    return cb(new BadRequestException('jpg/jpeg/png 파일만 업로드 가능합니다!'), false)
                }

                return cb(null, true)
            },
            storage: multer.diskStorage({
                destination: function (req, res, cb) {
                    cb(null, TEMP_FOLDER_PATH)
                },
                filename: function (req, file, cb) {
                    // xxx.png
                    cb(null, `${uuid()}${extname(file.originalname)}`)
                },
            }),
        }),
    ],
    controllers: [CommonController],
    providers: [CommonService],
    exports: [CommonService],
})
export class CommonModule {}
