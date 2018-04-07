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
        let encabezados= new Headers( {
           'Content-type': 'application/JSON',
           'accept': 'application/JSON' 
        });
        let peticion=new Request (this.srvUrl, {        
            method: 'POST',
            headers: encabezados,
            body: JSON.stringify(cliente)
        });
        return fetch(peticion)
                .then (response => this.comprobarRespuesta(response) )
                .then (response => this.devolverRespuesta(response) );
    }
    guarda(cliente) {
        let encabezados= new Headers( {
           'Content-type': 'application/JSON',
           'accept': 'application/JSON' 
        });
        let peticion=new Request (this.srvUrl + '/' + cliente.id, {        
            method: 'PUT',
            headers: encabezados,
            body: JSON.stringify(cliente)
        });
        return fetch(peticion)
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
    
    /** Check valid response and returns object data
     * @throws an object exception with message details if network error or http error status*/
    comprobarRespuesta(response) {
       
        this.respuestaValida=response.ok;
        //TODO check network errors
        return response.json();
    }
    devolverRespuesta (json) {
        if (!this.respuestaValida) {
            //send validation errors
            //throw json;
            return Promise.reject(json);
        }
        return json;        
    }
}; //End clientesDAOfetch

