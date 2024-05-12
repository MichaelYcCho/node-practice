import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "../auth.service";


@Injectable()
export class BasicTokenGuard implements CanActivate{
    constructor(private readonly authService: AuthService){}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const rawToken = req.headers['authorization'];

        if(!rawToken){
         throw new Error('Token not found');
        }

        const token = this.authService.extractTokenFromHeader(rawToken, true);

        const {email, password} = this.authService.decodeBasicToken(token);

        const user = await this.authService.authenticateWithEmailAndPassword({
            email, password
        });
        
        req.user = user;

        return true;
    }
}