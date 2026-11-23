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

  salvar() {
    if (this.idEdicao) {
      this.eventoService.atualizar(this.idEdicao, this.evento()).subscribe(() => {
        this.voltar();
      });
    } else {
      this.eventoService.criar(this.evento()).subscribe(() => {
        this.voltar();
      });
    }
  }

  voltar() {
    this.router.navigate(['/eventos']);
  }
}
