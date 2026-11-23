import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear(); // Limpa o storage antes de cada teste

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve fazer login, retornar o token e salvar no localStorage', () => {
    const mockResponse = { token: 'token-jwt-falso-123' };

    service.login('usuario@teste.com', '123456').subscribe((res) => {
      expect(res.token).toBe('token-jwt-falso-123');
      expect(localStorage.getItem('token')).toBe('token-jwt-falso-123');
      expect(service.estaLogado()).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:3000/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      email: 'usuario@teste.com',
      senha: '123456'
    });

    req.flush(mockResponse);
  });

  it('deve remover o token ao chamar logout()', () => {
    localStorage.setItem('token', 'token-existente');
    expect(service.estaLogado()).toBe(true);

    service.logout();

    expect(service.token).toBeNull();
    expect(service.estaLogado()).toBe(false);
  });
});

