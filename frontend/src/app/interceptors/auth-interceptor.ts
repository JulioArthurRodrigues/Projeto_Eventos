import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

/**
* Interceptador HTTP funcional que clona as requisições de saída e anexa
* o cabeçalho `Authorization: Bearer <token>` caso o usuário esteja autenticado.
*/
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).token;
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
