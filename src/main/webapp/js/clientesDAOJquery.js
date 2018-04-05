class ClientesDAOJquery {

    constructor() {
        this.srvUrl = 'webservice/clientes';
    }
    buscaTodos() {
        return $.getJSON(this.srvUrl);
    }
    busca(id = 0) {
        return $.getJSON(this.srvUrl + "/" + id);
    }
    crea(cliente) {
        //$.post(this.config.srvUrl)  // only for direct form post: application/x-www-form-urlencoded
        return $.ajax({
            url: this.srvUrl,
            type: 'POST',
            dataType: 'json', //expected data type
            contentType: 'application/JSON',
            data: JSON.stringify(cliente)
        });
    }
    guarda(cliente) {

        return $.ajax({
            url: this.srvUrl + '/' + cliente.id,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/JSON',
            data: JSON.stringify(cliente)
        });
    }

    borra(id = 0) {
        return $.ajax({
            url: this.srvUrl + "/" + id,
            type: 'DELETE',
            dataType: 'json'
        });
    }
}; //End clientesDAOJquery

