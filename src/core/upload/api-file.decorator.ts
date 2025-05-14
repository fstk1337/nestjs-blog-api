import {
  applyDecorators,
  NestInterceptor,
  Type,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export function ApiFile(interceptor: Type<NestInterceptor>) {
  return applyDecorators(
    UseInterceptors(interceptor),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
}
