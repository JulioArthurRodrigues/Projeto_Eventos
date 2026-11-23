import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { vi } from 'vitest';
import { authGuard } from './auth-guard';
import { AuthService } from '../services/auth';

describe('authGuard', () => {
  let authServiceMock: { estaLogado: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn>; createUrlTree: ReturnType<typeof vi.fn> };

  const routeMock = {} as ActivatedRouteSnapshot;
  const stateMock = {} as RouterStateSnapshot;

  beforeEach(() => {
    authServiceMock = { estaLogado: vi.fn() };
    routerMock = {
      navigate: vi.fn(),
      createUrlTree: vi.fn().mockReturnValue('/login')
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('deve permitir o acesso (retornar true) quando o usuário estiver logado', () => {
    authServiceMock.estaLogado.mockReturnValue(true);

    const resultado = TestBed.runInInjectionContext(() => authGuard(routeMock, stateMock));

    expect(resultado).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('deve bloquear o acesso e redirecionar para /login quando não estiver logado', () => {
    authServiceMock.estaLogado.mockReturnValue(false);

    const resultado = TestBed.runInInjectionContext(() => authGuard(routeMock, stateMock));

    expect(resultado).not.toBe(true);
    // Verifica se usou router.navigate(['/login']) OU router.createUrlTree(['/login'])
    const redirecionou =
      routerMock.navigate.mock.calls.length > 0 ||
      routerMock.createUrlTree.mock.calls.length > 0;
    expect(redirecionou).toBe(true);
  });
});
