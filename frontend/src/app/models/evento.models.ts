export class Evento {
    constructor(
        public id: number | null = null,
        public titulo = '',
        public descricao = '',
        public data = '',
        public local = '',
        public organizador = '',
        public capacidade = 0,
        public categoria = ''
    ) { }
}