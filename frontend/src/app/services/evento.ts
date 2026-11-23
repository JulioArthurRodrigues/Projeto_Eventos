import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Evento } from '../models/evento.models';

/**
* Serviço responsável pelas operações CRUD de eventos junto à API REST.
* Todas as requisições passam pelo `authInterceptor` para inclusão do token JWT.
*/
@Injectable({ providedIn: 'root' })
export class EventoService {
    private http = inject(HttpClient);
    private url = 'http://localhost:3000/eventos';
    
    /**
    * Obtém a lista completa de eventos cadastrados.
    *
    */
    listar() { return this.http.get<Evento[]>(this.url); }

    /**
    * Busca os detalhes de um evento específico pelo seu identificador.
    */
    buscar(id: number) { return this.http.get<Evento>(`${this.url}/${id}`); }

    /**
    * Cadastra um novo evento na base de dados.
    */
    criar(e: Evento) { return this.http.post<Evento>(this.url, e); }

    /**
    * Atualiza os dados de um evento existente.
    */
    atualizar(id: number, e: Evento) {
        return this.http.put<Evento>
            (`${this.url}/${id}`, e);
    }

    /**
    * Remove permanentemente um evento da base de dados.
    */
    excluir(id: number) { return this.http.delete<void>(`${this.url}/${id}`); }
}