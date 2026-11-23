class Evento {
    constructor(id, titulo, descricao, data, local, organizador, capacidade,
        categoria) {
        this._id = id;
        this._titulo = titulo;
        this._descricao = descricao;
        this._data = data;
        this._local = local;
        this._organizador = organizador;
        this._capacidade = capacidade;
        this._categoria = categoria;
    }
    get id() { return this._id; }
    get titulo() { return this._titulo; }
    set titulo(v) { this._titulo = v; }
    get capacidade() { return this._capacidade; }
    set capacidade(v) { this._capacidade = v; }
    get descricao() { return this._descricao; }
    set descricao(v) { this._descricao = v; }
    get data() { return this._data; }
    set data(v) { this._data = v; }
    get local() { return this._local; }
    set local(v) { this._local = v; }
    get organizador() { return this._organizador; }
    set organizador(v) { this._organizador = v; }
    get categoria() { return this._categoria; }
    set categoria(v) { this._categoria = v; }

    atualizar(dados) {
        this._titulo = dados.titulo ?? this._titulo;
        this._descricao = dados.descricao ?? this._descricao;
        this._data = dados.data ?? this._data;
        this._local = dados.local ?? this._local;
        this._organizador = dados.organizador ?? this._organizador;
        this._capacidade = dados.capacidade ?? this._capacidade;
        this._categoria = dados.categoria ?? this._categoria;
    }
    
    toJSON() {
        return {
            id: this._id, titulo: this._titulo, descricao: this._descricao,
            data: this._data, local: this._local, organizador: this._organizador,
            capacidade: this._capacidade, categoria: this._categoria,
        };
    }
}
module.exports = Evento;