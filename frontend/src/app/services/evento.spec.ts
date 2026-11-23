import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { EventoService } from './evento';
import { Evento } from '../models/evento.models';
import { authInterceptor } from '../interceptors/auth-interceptor';

describe('EventoService (com authInterceptor)', () => {
  let service: EventoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        EventoService,
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(EventoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('deve listar todos os eventos (GET) e enviar o header Authorization se houver token', () => {
    localStorage.setItem('token', 'meu-token-secreto');
    const mockEventos = [{ id: 1, nome: 'Evento 1' }] as unknown as Evento[];

    service.listar().subscribe((eventos) => {
      expect(eventos).toEqual(mockEventos);
    });

    const req = httpMock.expectOne('http://localhost:3000/eventos');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer meu-token-secreto');

    req.flush(mockEventos);
  });

  it('deve buscar um evento por ID (GET)', () => {
    const mockEvento = { id: 10, nome: 'Show' } as unknown as Evento;

    service.buscar(10).subscribe((evento) => {
      expect(evento).toEqual(mockEvento);
    });

    const req = httpMock.expectOne('http://localhost:3000/eventos/10');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBe(false); // Sem token no storage

    req.flush(mockEvento);
  });

  it('deve criar um novo evento (POST)', () => {
    const novoEvento = { nome: 'Conferência' } as unknown as Evento;

    service.criar(novoEvento).subscribe((res) => {
      expect(res).toEqual(novoEvento);
    });

    const req = httpMock.expectOne('http://localhost:3000/eventos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(novoEvento);

    req.flush(novoEvento);
  });

  it('deve atualizar um evento existente (PUT)', () => {
    const eventoAtualizado = { id: 5, nome: 'Workshop Atualizado' } as unknown as Evento;

    service.atualizar(5, eventoAtualizado).subscribe((res) => {
      expect(res).toEqual(eventoAtualizado);
    });

    const req = httpMock.expectOne('http://localhost:3000/eventos/5');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(eventoAtualizado);

    req.flush(eventoAtualizado);
  });

  it('deve excluir um evento (DELETE)', () => {
    service.excluir(5).subscribe((res) => {
      expect(res).toBeNull();
    });

    const req = httpMock.expectOne('http://localhost:3000/eventos/5');
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
  });
});

