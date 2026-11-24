import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { EventoForm } from './evento-form'; // Ajuste para EventoFormComponent se o nome da classe tiver sufixo
import { EventoService } from '../../../services/evento';
import { Evento } from '../../../models/evento.models';

describe('EventoForm', () => {
  let component: EventoForm;
  let fixture: ComponentFixture<EventoForm>;
  let eventoServiceMock: {
    buscar: ReturnType<typeof vi.fn>;
    criar: ReturnType<typeof vi.fn>;
    atualizar: ReturnType<typeof vi.fn>;
  };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  it('deve criar um novo evento quando nÃ£o houver :id na rota', async () => {
    eventoServiceMock = {
      buscar: vi.fn(),
      criar: vi.fn(),
      atualizar: vi.fn()
    };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EventoForm],
      providers: [
        { provide: EventoService, useValue: eventoServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const novoEvento = new Evento(null, 'Hackathon', 'Desc', '2026-10-10', 'SP', 'Ana', 100, 'Dev');
    component.evento.set(novoEvento);
    eventoServiceMock.criar.mockReturnValue(of(novoEvento));

    component.salvar();

    expect(eventoServiceMock.buscar).not.toHaveBeenCalled();
    expect(eventoServiceMock.criar).toHaveBeenCalledWith(novoEvento);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/eventos']);
  });

  it('deve carregar e atualizar o evento quando houver :id na rota', async () => {
    const eventoExistente = new Evento(5, 'Meetup', 'Desc', '2026-11-20', 'RJ', 'Carlos', 30, 'JS');

    eventoServiceMock = {
      buscar: vi.fn().mockReturnValue(of(eventoExistente)),
      criar: vi.fn(),
      atualizar: vi.fn().mockReturnValue(of(eventoExistente))
    };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [EventoForm],
      providers: [
        { provide: EventoService, useValue: eventoServiceMock },
        { provide: Router, useValue: routerMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '5' } } }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventoForm);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(eventoServiceMock.buscar).toHaveBeenCalledWith(5);
    expect(component.evento().titulo).toBe('Meetup');

    component.salvar();

    expect(eventoServiceMock.atualizar).toHaveBeenCalledWith(5, eventoExistente);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/eventos']);
  });
});