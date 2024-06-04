import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, map, tap } from 'rxjs'

@Injectable()
export class LogInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
        /**
         * 요청이 들어올때 REQ 요청이 들어온 타임스탬프
         * [REQ] {요청 path} {요청 시간}
         *
         * 요청이 끝날때 (응답이 나갈때) 타임스탬프
         * [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
         */
        const now = new Date()

        const req = context.switchToHttp().getRequest()

        // /posts
        // /common/image
        const path = req.originalUrl

        // [REQ] {요청 path} {요청 시간}
        console.log(`[REQ] ${path} ${now.toLocaleString('kr')}`)

        // return next.handle()이 샐행될때 라우트의 로직이 전부 실행되고 응답 반환(observable(rxjs에서 사용하는 객체, 일종의 stream으로 이해하면 됨))
        // 응답에 대한 변형(pipe)
        // 모니터링을 할때는 tap, 변형을 할때는 map
        return next.handle().pipe(
            tap(
                // [RES] {요청 path} {응답 시간} {얼마나 걸렸는지 ms}
                (observable) =>
                    console.log(
                        `[RES] ${path} ${new Date().toLocaleString('kr')} ${new Date().getMilliseconds() - now.getMilliseconds()}ms`,
                    ),
            ),
        )
    }
}
