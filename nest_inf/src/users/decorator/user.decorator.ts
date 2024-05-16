import { ExecutionContext, InternalServerErrorException, createParamDecorator } from "@nestjs/common";


export const getUser = createParamDecorator((data, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user;

    if (!user){
        throw new InternalServerErrorException('User not found');
    }

    return user;
})