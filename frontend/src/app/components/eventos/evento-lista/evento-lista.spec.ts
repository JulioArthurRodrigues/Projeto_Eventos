import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { EventoLista } from './evento-lista'; // Ajuste para EventoListaComponent se o nome da classe tiver sufixo
import { EventoService } from '../../../services/evento';
import { AuthService } from '../../../services/auth';
import { Evento } from '../../../models/evento.models';

describe('EventoLista', () => {
  let component: EventoLista;
  let fixture: ComponentFixture<EventoLista>;
  let eventoServiceMock: { listar: ReturnType<typeof vi.fn>; excluir: ReturnType<typeof vi.fn> };
  let authServiceMock: { logout: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  const mockEventos: Evento[] = [
    new Evento(1, 'Workshop Angular', 'Desc', '2026-12-01', 'Auditório', 'João', 50, 'Tech')
  ];

  beforeEach(async () => {
    eventoServiceMock = {
      listar: vi.fn().mockReturnValue(of(mockEventos)),
      excluir: vi.fn()
    };
    authServiceMock = { logout: vi.fn() };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EventoLista],
      providers: [
        { provide: EventoService, useValue: eventoServiceMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventoLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve carregar a lista de eventos no ngOnInit', () => {
    expect(eventoServiceMock.listar).toHaveBeenCalled();
    expect(component.eventos().length).toBe(1);
    expect(component.eventos()[0].titulo).toBe('Workshop Angular');
  });

  it('deve navegar para /eventos/novo ao clicar em Novo evento', () => {
    component.novoEvento();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/eventos/novo']);
  });

    it('deve filtrar os eventos pelo termo de busca', () => {
    component.termoBusca.set('angular');
    expect(component.eventosFiltrados().length).toBe(1);

    component.termoBusca.set('inexistente');
    expect(component.eventosFiltrados().length).toBe(0);

    component.termoBusca.set('');
    expect(component.eventosFiltrados().length).toBe(1);
  });

  it('deve navegar para /eventos/editar/:id ao clicar em Editar', () => {
    component.editar(1);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/eventos/editar', 1]);
  });

  it('deve excluir um evento quando o usuário confirmar', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    eventoServiceMock.excluir.mockReturnValue(of(void 0));

    component.excluir(1);

    expect(window.confirm).toHaveBeenCalled();
    expect(eventoServiceMock.excluir).toHaveBeenCalledWith(1);
    expect(eventoServiceMock.listar).toHaveBeenCalledTimes(2);
  });

  it('não deve excluir o evento quando o usuário cancelar', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);

    component.excluir(1);

    expect(eventoServiceMock.excluir).not.toHaveBeenCalled();
  });

  it('deve fazer logout e navegar para /login ao clicar em Sair', () => {
    component.sair();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});