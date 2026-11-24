import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../../services/evento';
import { Evento } from '../../../models/evento.models';

@Component({
  selector: 'app-evento-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './evento-form.html',
  styleUrl: './evento-form.css'
})
export class EventoForm implements OnInit {
  private eventoService = inject(EventoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  evento = signal<Evento>(new Evento());
  idEdicao: number | null = null;
  salvando = signal(false);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.idEdicao = Number(idParam);
      this.eventoService.buscar(this.idEdicao).subscribe((dados) => {
        // Atualiza o signal e avisa o Angular imediatamente para preencher os inputs
        this.evento.set(dados);
      });
    }
  }

  atualizarCampo<K extends keyof Evento>(campo: K, valor: Evento[K]) {
    this.evento.update((atual) => ({
      ...atual,
      [campo]: valor
    }));
  }

  salvar() {
    if (this.salvando()) return;
    this.salvando.set(true);

    const request$ = this.idEdicao
      ? this.eventoService.atualizar(this.idEdicao, this.evento())
      : this.eventoService.criar(this.evento());

    request$.subscribe({
      next: () => {
        this.salvando.set(false);
        this.voltar();
      },
      error: () => {
        this.salvando.set(false);
      }
    });
  }

  voltar() {
    this.router.navigate(['/eventos']);
  }

  sair() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}