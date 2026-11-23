import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth-guard';
import { EventoForm } from './components/eventos/evento-form/evento-form';
import { EventoLista } from './components/eventos/evento-lista/evento-lista';

export const routes: Routes = [
  { path: '', redirectTo: 'eventos', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'eventos', component: EventoLista, canActivate: [authGuard] },
  { path: 'eventos/novo', component: EventoForm, canActivate: [authGuard] },
  { path: 'eventos/editar/:id', component: EventoForm, canActivate: [authGuard] },
  { path: '**', redirectTo: 'eventos' }
];
