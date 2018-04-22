class ClientesDAOfetch {

    constructor() {
        this.srvUrl = 'webservice/clientes';
        this.respuestaValida=false; //status of last ajax request
    }
    buscaTodos() {
        return fetch(this.srvUrl)
                .then (response => this.comprobarRespuesta(response) )
                .then (response => this.devolverRespuesta(response) );
    }
    busca(id = 0) {
        return fetch(this.srvUrl + "/" + id)
                .then (response => this.comprobarRespuesta(response) )
                .then (response => this.devolverRespuesta(response) );
    }
    crea(cliente) {
    
        return fetch(this.srvUrl, {
                    method: 'POST',
                    body: JSON.stringify(cliente),
                    headers: {
                        'Content-type': 'application/JSON',
                        'accept': 'application/JSON' 
                    }
                })
                .then (response => this.comprobarRespuesta(response) )
                .then (response => this.devolverRespuesta(response) );
    }
    guarda(cliente) {
        return fetch(this.srvUrl, {
                    method: 'PUT',
                    body: JSON.stringify(cliente),
                    headers: {
                        'Content-type': 'application/JSON',
                        'accept': 'application/JSON' 
                    }
                })
                .then (response => this.comprobarRespuesta(response) )
                .then (response => this.devolverRespuesta(response) );
    }
    borra(id = 0) {
        return fetch(this.srvUrl + "/" + id,{
                    method: 'DELETE'
               })
                .then (response => this.comprobarRespuesta(response) )
                .then (response => this.devolverRespuesta(response) );
    }
    
    /** Saves response status and returns object data*/
    comprobarRespuesta(response) {
       
        this.respuestaValida=response.ok;
        //TODO check network errors
        return response.json();
    }
    devolverRespuesta (json) {
        //Resolves or reject promise with response data
        if (!this.respuestaValida) {
            //send validation errors
            //Rejects promise, forces catch response in DAO
            return Promise.reject(json);
        }
        return json;        
    }
}; //End clientesDAOfetch

