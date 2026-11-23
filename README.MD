# Sistema de Gerenciamento de Eventos

Aplicação web desenvolvida em Angular para gerenciamento completo (CRUD) de eventos, contando com autenticação via token JWT, proteção de rotas, interceptador HTTP, filtro de busca em tempo real e suíte de testes unitários automatizados.

---

## Tecnologias Utilizadas

* **Frontend:** Angular 22.3.0 (Standalone Components, Signals, Template-Driven Forms)
* **Linguagem:** TypeScript
* **Estilização:** CSS3 puro (layout responsivo em cards)
* **Testes Unitários:** Vitest & Angular Testing Utilities (`HttpTestingController`)
* **Backend:** Node.js (API REST na porta `3000`)

---

## Como Rodar o Projeto

### 1. Backend (API)
Acesse a pasta do servidor backend pelo terminal, instale as dependências e inicie a API:

```bash
npm install
node server.js
```
> O servidor será iniciado em `http://localhost:3000`.

### 2. Frontend (Angular)
Em um novo terminal, acesse a pasta do projeto Angular, instale as dependências e execute a aplicação:

```bash
npm install
npx ng serve
```
> Acesse no navegador: `http://localhost:4200`

---

## Credenciais de Acesso (Usuário de Teste)

Para acessar o sistema na tela de login, utilize:

* **E-mail:** `admin@eventos.com`
* **Senha:** `123456`

---

## Rotas da Aplicação

| Rota | Componente | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `/login` | `Login` | Público | Tela de autenticação do usuário |
| `/eventos` | `EventoLista` | Protegido (`authGuard`) | Listagem de eventos com busca em tempo real e exclusão |
| `/eventos/novo` | `EventoForm` | Protegido (`authGuard`) | Formulário para cadastro de um novo evento |
| `/eventos/editar/:id` | `EventoForm` | Protegido (`authGuard`) | Formulário preenchido para edição de um evento existente |

---

## Testes Unitários

O projeto possui testes unitários cobrindo serviços, interceptador, guarda de rotas e componentes:

* **`AuthService` (`auth.spec.ts`):** Valida login (POST), armazenamento/remoção de token no `localStorage` e status de autenticação.
* **`EventoService` (`evento.service.spec.ts`):** Valida todas as operações CRUD (`listar`, `buscar`, `criar`, `atualizar`, `excluir`) e a injeção do header `Authorization: Bearer <token>` pelo `authInterceptor`.
* **`authGuard` (`auth-guard.spec.ts`):** Verifica o bloqueio de rotas para usuários não autenticados e a liberação quando logado.
* **Componentes (`login.spec.ts`, `evento-lista.spec.ts`, `evento-form.spec.ts`):** Testam navegação, exibição de erros, filtros de pesquisa, confirmações de exclusão e envio de formulários.

Para executar toda a suíte de testes, rode na pasta do frontend:

```bash
ng test
```

## Decisões Técnicas e Desafios Resolvidos

* **Reatividade no Angular 22 (Zoneless):** Como a aplicação opera sem `Zone.js`, estados assíncronos vindos de requisições HTTP (lista de eventos, carregamento de edição e mensagens de erro de login) foram gerenciados com `signal()` e `computed()` para garantir a atualização imediata da interface.
* **Segurança e Autenticação:** Implementação de `HttpInterceptorFn` para anexar automaticamente o token JWT nas requisições e `CanActivateFn` (`authGuard`) para proteger as rotas internas.
* **Estratégia de Testes com Vitest:** Uso de `HttpTestingController` para isolar chamadas de API nos serviços e `TestBed.runInInjectionContext` para testar guards funcionais sem depender de um servidor ativo.

