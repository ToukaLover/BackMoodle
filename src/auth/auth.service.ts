import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) { }

  //Funcion que crea el webToken, uso el servicio que me da nest para los jwt
  async signIn(
    username: string,
    role: string
  ) {
    const payload = { username, role };

    const access_token = await this.jwtService.signAsync(payload);

    return access_token;
  }


  //Funcion que verifica el token que recibe
  async verify(
    token: string
  ) {
    try {

      //Lo verifica con la clave secreta que defino

      const bool = await this.jwtService.verifyAsync(token, { secret: jwtConstants.secret })

      //Si este token no es valido, devuelve false
      
      return bool
    
    } catch (error) {
      console.error("Error Controlado: "+error)
    }
  }

}
