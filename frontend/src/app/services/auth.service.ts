import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private api = 'http://localhost:3000';

    login(email: string, senha: string) {
        return this.http.post<{ token: string }>('${this.api}/login', { email, senha })
            .pipe(tap(res => localStorage.setItem('token', res.token)));
    }
    logout() { localStorage.removeItem('token'); }
    get token() { return localStorage.getItem('token'); }
    estaLogado() { return !!this.token; }
}