import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
} from '@nestjs/common'
import { Observable, catchError, tap } from 'rxjs'
import { DataSource } from 'typeorm'

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
    constructor(private readonly dataSource: DataSource) {}

    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const req = context.switchToHttp().getRequest()

        // 트랜잭션과 관련 모든 Query를 핸들링할 QueryRunner 생성
        const queryRunner = this.dataSource.createQueryRunner()

        await queryRunner.connect()
        // 쿼리 러너에서 트랜잭션을 시작한다.
        // 이 시점부터 같은 QueryRunner를 사용하면 트랜잭션 안에서 데이터베이스 액션을 실행
        await queryRunner.startTransaction()

        req.queryRunner = queryRunner

        return next.handle().pipe(
            catchError(async (e) => {
                await queryRunner.rollbackTransaction()
                await queryRunner.release()

                throw new InternalServerErrorException(e.message)
            }),
            tap(async () => {
                await queryRunner.commitTransaction()
                await queryRunner.release()
            }),
        )
    }
}
