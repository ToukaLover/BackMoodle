import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExcludeController } from '@nestjs/swagger';
@ApiExcludeController()
@Controller('auth')
export class AuthController {

    constructor(private jwt: AuthService) { }

    @Post("token")
    getToken(@Body() body) {
        return this.jwt.signIn(body.username, body.role)
    }

}
