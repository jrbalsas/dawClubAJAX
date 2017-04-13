/*jslint browser: true*/
/*global $, jQuery*/

$(function () {
    //Configure events on page load
    clienteCtrl.init(viewModel);
});

var viewModel = {
        clientes: [],
        cliente: {},
        errMsgs: []
    };

//Clientes Controller
var clienteCtrl = {
    config: {
        wrapper: '#tbClientes',       //place for clientes list <tbody> tag
        dialog:  '#edCliente',
        frmEdit: '#frmCliente',
        btAdd:   '#btCrea',
        btDel:   '#btBorra',
        btCancel:'#btCancela',
        errMsgs: '#errMsgs',          //place for Server-side errors
        srvUrl:  'webservice/clientes'
    },
    model: {},
    init: function (model) {
        this.model = model;  //save view-model reference in controller
        
        //Attach view event-handlers
        
        var self = this; //closure var for accesing clienteCtrl object on event handlers

        $(this.config.frmEdit).submit(function (event) {
            event.preventDefault(); //Avoid default form submit
            self.frmSubmit();
        });
        $(this.config.btAdd).on('click', function () {            
            self.addCliente();
        });
        $(this.config.btDel).on('click', function () {            
            self.deleteCliente(self.model.cliente.id);
        });
        $(this.config.btCancel).on('click', function () {            
            self.frmEditHide();
        });
        $(this.config.wrapper).on('click', function (event) {
            //Identify row selected on table click (bubbling event)
            $selectedRow=$(event.target).parent();
            if ($selectedRow.is('tr'))
                //id for selected cliente is in user-defined attribute
                self.editCliente($selectedRow.attr('data-cliente-id'));
        });
        
        //Start Showing Clientes
        this.loadClientes();
    },
    //
    addCliente: function () {        
        this.model.errMsgs=[];
        this.model.cliente={id:0,socio:false};
        this.frmEditShow();
    },
    editCliente: function (id) {
        //Show selected cliente in edit form
        var self = this;
        this.model.errMsgs=[];
        //Get cliente from server and update local model
        $.getJSON(this.config.srvUrl+"/"+id)
                .done(function (cliente) {
                    self.model.cliente=cliente;
                    self.frmEditShow();
                })
                .fail(function (jqxhr) {
                    console.log(jqxhr);
                    self.model.errMsgs=jqxhr.responseJSON;
                    self.showServerErrors();
                });
    },
    frmSubmit: function () {
        //Create or Update cliente on server
        var cliente = this.model.cliente,
            self;
        
        cliente={};
   
        //recover cliente data from Form
        cliente.id=$('#id').text();
        cliente.nombre=$('[name=nombre]').val();
        cliente.dni=$('[name=dni]').val();
        cliente.socio=$('[name=socio]').prop('checked');
        
        $(this.config.errMsgs).empty(); //Delete previous server errors
        
        //Form Client-side validation
        if (this.validateCliente(cliente)) {
            self = this;
            var RESTMethod=parseInt(cliente.id)>0?'PUT':'POST'; //Edit or Create
            var RESTUrl=this.config.srvUrl;
            if (RESTMethod==='PUT') 
                RESTUrl+="/"+cliente.id;
            //$.post(this.config.srvUrl)  // only for direct form post: application/x-www-form-urlencoded
            $.ajax({
                url: RESTUrl,                
                type: RESTMethod,
                dataType: 'json',                //expected data type
                contentType: 'application/JSON',
                data: JSON.stringify(cliente)               
                })
                .done(function (json) {
                    console.log(json);
                    self.frmEditHide();
                    self.loadClientes();
                })
                .fail(function (jqxhr) {
                    console.log(jqxhr);
                    self.model.errMsgs=jqxhr.responseJSON;
                    self.showServerErrors();
                });
        }
    },
    deleteCliente: function (id) {        
        var self = this;
        id = id || 0;  //prevent undefined
        this.model.errMsgs=[];
            $.ajax({
                url: this.config.srvUrl+"/"+id,                
                type: 'DELETE',
                dataType: 'json'                //expected data type
                })
                .done(function () {
                    self.frmEditHide();
                    self.loadClientes();            
                })
                .fail(function (jqxhr) {
                    console.log(jqxhr);
                    self.model.errMsgs=jqxhr.responseJSON;
                    self.showServerErrors();
                });
    },
    validateCliente: function (cliente) {
        //Form Client-side validation
        //Shows validation errors next to form fields
        var result = true;
        if (cliente.nombre.length < 4 ) {
            $('#errNombre').show();
            result = false;
        } else {
            $('#errNombre').hide();
        }
        //Further client-side input validations... 
        //(ommited for checking server-side validation errors)
        return result;
    },
    
    frmEditShow: function () {
        //Shows Edit form
        this.frmEditUpdate();
        this.showServerErrors();
        $(this.config.dialog).modal('show');
    },
    frmEditHide: function () {
        //Hides Edit form
        $(this.config.dialog).modal('hide');
        //clean previous errors
        $(this.config.errMsgs).empty();
        $('#errNombre').hide();
        $('#errDni').hide();
    },    
    frmEditUpdate: function () {
        //Fill form controls with this.model.cliente data
        var c=this.model.cliente;
        $('#id').text( c.id );
        $('[name=nombre]').val(c.nombre);
        $('[name=dni]').val(c.dni);
        $('[name=socio]').prop('checked',c.socio);
    },
    showServerErrors: function () {
        //Show BeanValidation errors from server-side
        var errorRows = "";
        this.model.errMsgs.forEach(function (m) {
            errorRows += "<li class='text-danger'>" + m.message + "</li>";
        });
        $(this.config.errMsgs).html(errorRows);

        this.model.errMsgs=[]; //Clean server errors
    },
    loadClientes: function () {
        var self = this;
        //Get clientes from server and update local model
        $.getJSON(this.config.srvUrl)
                .done(function (clientes) {
                    self.model.clientes = clientes;
                    self.showClientes(); //force view update
                })
                .fail(function (jqxhr) {
                    console.log(jqxhr);
                    self.model.errMsgs=jqxhr.responseJSON;
                    self.showServerErrors();
                });
    },
    showClientes: function () {
        //Fill table with clientes information
        var clientesRows = "";
        this.model.clientes.forEach(function (c) {
            //Place cliente id in user-defined row attribute for easy access 
            //(see table click event)
            clientesRows += "<tr data-cliente-id='"+c.id+"'>";
            clientesRows += "<td>" + c.id + "</td>";
            clientesRows += "<td>" + c.nombre + "</td>";
            clientesRows += "<td>" + c.dni + "</td>";
            clientesRows += "<td>" + (c.socio===true?"Sí":"No") + "</td>";
            clientesRows += "</tr>";            
        });
        $(this.config.wrapper).html(clientesRows);
    }   
}; //End clienteCtrl
