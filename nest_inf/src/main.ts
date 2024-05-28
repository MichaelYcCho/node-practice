import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.listen(3000)

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            // request로 들어온 data가 dto에 없다면, 해당 요청은 무시한다.
            whitelist: true,
            // 존재하면 안되는 query에 대해서 에러처리
            forbidNonWhitelisted: true,
        }),
    )
}
bootstrap()
