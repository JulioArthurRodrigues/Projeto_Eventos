import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';
import { Login } from './login'; // Ajuste o nome/caminho se necessário
import { AuthService } from '../../services/auth';

describe('LoginComponent', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: { login: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = { login: vi.fn() };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve navegar para /eventos quando o login der certo', () => {
    authServiceMock.login.mockReturnValue(of({ token: 'token-valido' }));
    component.email = 'teste@email.com';
    component.senha = '123456';

    component.entrar();

    expect(authServiceMock.login).toHaveBeenCalledWith('teste@email.com', '123456');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/eventos']);
    expect(component.erro()).toBe('');
  });

  it('deve exibir "Login inválido" quando o login falhar', () => {
    authServiceMock.login.mockReturnValue(throwError(() => new Error('Erro 401')));
    component.email = 'errado@email.com';
    component.senha = '000';

    component.entrar();

    expect(component.erro()).toBe('Login inválido')
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
