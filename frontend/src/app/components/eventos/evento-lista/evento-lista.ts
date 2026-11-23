import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from '../../../services/evento';
import { AuthService } from '../../../services/auth';
import { Evento } from '../../../models/evento.models';

@Component({
  selector: 'app-evento-lista',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './evento-lista.html',
  styleUrl: './evento-lista.css'
})
export class EventoLista implements OnInit {
  private eventoService = inject(EventoService);
  private authService = inject(AuthService);
  private router = inject(Router);

  eventos = signal<Evento[]>([]);
  termoBusca = signal('');

  eventosFiltrados = computed(() => {
    const termo = this.termoBusca().toLowerCase().trim();
    if (!termo) return this.eventos();

    return this.eventos().filter(
      (e) =>
        e.titulo?.toLowerCase().includes(termo) ||
        e.local?.toLowerCase().includes(termo) ||
        e.categoria?.toLowerCase().includes(termo)
    );
  });

  ngOnInit() {
    this.carregarEventos();
  }

  carregarEventos() {
    this.eventoService.listar().subscribe({
      next: (dados) => this.eventos.set(dados),
      error: (err) => console.error('Erro ao listar eventos:', err)
    });
  }

  novoEvento() {
    this.router.navigate(['/eventos/novo']);
  }

  editar(id: number | null) {
    if (id) {
      this.router.navigate(['/eventos/editar', id]);
    }
  }

  excluir(id: number | null) {
    if (id && confirm('Tem certeza que deseja excluir este evento?')) {
      this.eventoService.excluir(id).subscribe(() => {
        this.carregarEventos();
      });
    }
  }

  sair() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
