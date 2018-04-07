class ClientesDAOJquery {

    constructor() {
        this.srvUrl = 'webservice/clientes';
    }
    buscaTodos() {
        return $.getJSON(this.srvUrl)
                .catch ( this.notificarError );
    }
    busca(id = 0) {
        return $.getJSON(this.srvUrl + "/" + id)
                .catch ( this.notificarError );
    }
    crea(cliente) {
        //$.post(this.config.srvUrl)  // only for direct form post: application/x-www-form-urlencoded
        return $.ajax({
            url: this.srvUrl,
            type: 'POST',
            dataType: 'json', //expected data type
            contentType: 'application/JSON',
            data: JSON.stringify(cliente)
        }).catch ( this.notificarError );
    }
    guarda(cliente) {

        return $.ajax({
            url: this.srvUrl + '/' + cliente.id,
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/JSON',
            data: JSON.stringify(cliente)
        }).catch ( this.notificarError );
    }

    borra(id = 0) {
        return $.ajax({
            url: this.srvUrl + "/" + id,
            type: 'DELETE',
            dataType: 'json'
        }).catch ( this.notificarError );
    }

    /** Create an exception object with error mesage details 
     * @throws an object exception with message details if network error or http error status*/
    notificarError(jqxhr) {
            //TODO  detect&notify network errors
            throw  jqxhr.responseJSON;    
    }

    
}; //End clientesDAOJquery

