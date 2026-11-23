import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

/**
 * Serviço responsável pelo gerenciamento de autenticação do usuário,
 * comunicação com o endpoint de login e persistência do token JWT no localStorage.
 */

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private api = 'http://localhost:3000';

    /**
    * Envia as credenciais para a API e, em caso de sucesso,
    * armazena o token JWT retornado no localStorage.
    */
    login(email: string, senha: string) {
        return this.http.post<{ token: string }>(`${this.api}/login`, {
            email,
            senha
        })
            .pipe(tap(res => localStorage.setItem('token', res.token)));
    }

    /**
    * Remove o token de autenticação do localStorage, encerrando a sessão atual.
    */
    logout() { localStorage.removeItem('token'); }

    /**
    * Recupera o token JWT armazenado no navegador.
    */
    get token() { return localStorage.getItem('token'); }

    /**
    * Verifica se existe um token válido armazenado para determinar
    * se o usuário está autenticado.
    */
    estaLogado() { return !!this.token; }
}