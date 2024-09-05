import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { isArray } from 'lodash';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] | string };
    let message: string;

    if (Array.isArray(res.message)) {
      message = res.message.join(',');
    } else {
      message = res.message || exception.message;
    }
    response.json({
      code: exception.getStatus(),
      message: 'fail',
      data: message
    }).end();
  }
}
