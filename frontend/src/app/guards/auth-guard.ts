import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

/**
* Guarda de rota funcional (`CanActivateFn`) que protege rotas privadas.
* Permite o acesso apenas se `AuthService.estaLogado()` for verdadeiro;
* caso contrário, redireciona o usuário para a tela `/login`.
*/
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.estaLogado()) return true;
  router.navigate(['/login']);
  return false;
};
