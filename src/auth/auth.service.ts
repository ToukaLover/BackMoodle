import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(
    username: string,
    role: string
  ) {
    const payload = { username, role };

    const access_token = await this.jwtService.signAsync(payload);



    return access_token;
  }



  async verify(
    token:string
  ){
    const bool = await this.jwtService.verifyAsync(token,{secret:jwtConstants.secret})
    
    return bool
  }

}
