// mongo-connection.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    ServiceUnavailableException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AppModule } from './app.module';

@Injectable()
export class MongoConnectionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        if (!AppModule.isMongoConnected()) {
            throw new ServiceUnavailableException('Servicio en mantenimiento - Base de datos desconectada');
        }
        return next.handle();
    }
}
