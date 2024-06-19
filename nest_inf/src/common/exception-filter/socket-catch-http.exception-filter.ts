import { ArgumentsHost, Catch, HttpException } from '@nestjs/common'
import { BaseWsExceptionFilter } from '@nestjs/websockets'

// websocket관련 Exception Filter -> baseWsExceptionFilter 상속
@Catch(HttpException)
export class SocketCatchHttpExceptionFilter extends BaseWsExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost): void {
        // host를 websocket으로 전환 (get client로 socket을 가져옴)
        const socket = host.switchToWs().getClient()

        // socket에 exception 이벤트를 emit
        socket.emit('exception', {
            data: exception.getResponse(),
        })
    }
}
