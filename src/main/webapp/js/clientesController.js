/*jslint browser: true*/
/*global $, jQuery*/

$( () => { //Bootstrapting MVC
 
    const apiUrl="http://localhost:8080/club/api/clientes";
    //const apiUrl="http://localhost:8080/api/clientes"; //payara-micro url

    //Select DAO implementation
    //let clientesDAO= new ClientesDAOJquery( apiUrl );
    let clientesDAO= new ClientesDAOfetch( apiUrl );

    let viewModel = { 
        clientes: [],   //Client list
        cliente: {},    //Current client
        errMsgs: []     //JSON error from JAX-RS webservice
    };
    //Create controller + Dependency Injection
    let ctrl=new ClienteCtrl(viewModel, clientesDAO);

    //Attach view event handlers
    ctrl.init();
});

//Clientes Controller

class ClienteCtrl {

    constructor ( vm , clientesDAO) {
        this.clientesDAO=clientesDAO; // DAO injection
        this.model=vm; //save view-model reference in controller
        this.config= {
            wrapper: '#tbClientes',       //place for clientes list <tbody> tag
            dialog:  '#edCliente',
            frmEdit: '#frmCliente',
            btAdd:   '#btCrea',
            btDel:   '#btBorra',
            btCancel:'#btCancela',
            errMsgs: '#errMsgs',          //place for Server-side errors
        };
    }
    
    init () {        
        //Attach view event-handlers
        
        $(this.config.frmEdit).submit( event=> {
            event.preventDefault(); //Avoid default form submit
            this.frmSubmit();
        });
        $(this.config.btAdd).on('click', ()=> {            
            this.addCliente();
        });
        $(this.config.btDel).on('click', ()=> {            
            this.deleteCliente(this.model.cliente.id);
        });
        $(this.config.btCancel).on('click', ()=> {            
            this.frmEditHide();
        });
        $(this.config.wrapper).on('click', event=> {
            //Identify row selected on table click (bubbling event)
            let $selectedRow=$(event.target).parent();
            if ($selectedRow.is('tr'))
                //id for selected cliente is in user-defined attribute
                this.editCliente($selectedRow.attr('data-cliente-id'));
        });
        
        //Start Showing Clientes
        this.loadClientes();
    }
    //
    addCliente () {        
        this.model.errMsgs=[];
        this.model.cliente={id:0,socio:false};
        this.frmEditShow();
    }
    editCliente (id) {
        //Show selected cliente in edit form
        this.model.errMsgs=[];
        //Get cliente from server and update local model
        this.clientesDAO.busca(id)
                .then(cliente=>{
                    this.model.cliente=cliente;
                    this.frmEditShow();
                })
                .catch( errores => {
                    console.log(errores);
                    this.model.errMsgs=errores;
                    this.showServerErrors();
                });
    }
    frmSubmit () {
        //Create or Update cliente on server
        let cliente = this.model.cliente;
        
        cliente={};
   
        //recover cliente data from Form
        cliente.id=$('#id').text();
        cliente.nombre=$('[name=nombre]').val();
        cliente.dni=$('[name=dni]').val();
        cliente.socio=$('[name=socio]').prop('checked');
        
        $(this.config.errMsgs).empty(); //Delete previous server errors
        
        //Form Client-side validation
        if (this.validateCliente(cliente)) {
            
            
            let operacion=null;
            if (cliente.id>0) {
                operacion= this.clientesDAO.guarda(cliente);
            } else {
                operacion=this.clientesDAO.crea(cliente);
            }
            operacion
                    .then( json => {
                        console.log(json);
                        this.frmEditHide();
                        this.loadClientes();
                    })
                    .catch( errores => {
                        console.log(errores);
                        this.model.errMsgs=errores;
                        this.showServerErrors();
                    });
            }                    
    }
    deleteCliente (id=0) {        
        this.clientesDAO.borra(id)
                .then(() => {
                    this.frmEditHide();
                    this.loadClientes();            
                })
                .catch(errores  => {
                    console.log(errores);
                    this.model.errMsgs=errores;
                    this.showServerErrors();
                });
    }
    validateCliente (cliente) {
        //Form Client-side validation
        //Shows validation errors next to form fields
        let result = true;
        if (cliente.nombre.length < 4 ) {
            $('#errNombre').show();
            result = false;
        } else {
            $('#errNombre').hide();
        }
        //Further client-side input validations... 
        //(ommited for checking server-side validation errors)
        return result;
    }   
    frmEditShow () {
        //Shows Edit form
        this.frmEditUpdate();
        this.showServerErrors();
        $(this.config.dialog).modal('show');
    }
    frmEditHide () {
        //Hides Edit form
        $(this.config.dialog).modal('hide');
        //clean previous errors
        $(this.config.errMsgs).empty();
        $('#errNombre').hide();
        $('#errDni').hide();
    }    
    frmEditUpdate () {
        //Fill form controls with this.model.cliente data
        let c=this.model.cliente;
        $('#id').text( c.id );
        $('[name=nombre]').val(c.nombre);
        $('[name=dni]').val(c.dni);
        $('[name=socio]').prop('checked',c.socio);
    }
    showServerErrors () {
        //Show BeanValidation errors from server-side
        console.log(this.model.errMsgs);
        let errorRows = "";
        this.model.errMsgs.forEach( m => {
            errorRows += "<li class='text-danger'>" + m.message + "</li>";
        });
        $(this.config.errMsgs).html(errorRows);

        this.model.errMsgs=[]; //Clean server errors
    }
    loadClientes () {
        //Get clientes from server and update local model
        this.clientesDAO.buscaTodos()
                .then( clientes => {
                    this.model.clientes = clientes;
                    this.showClientes(); //force view update
                })
                .catch( errores => {
                    console.log(errores);
                    this.model.errMsgs=errores;
                    this.showServerErrors();
                });
    }
    showClientes () {
        //Fill table with clientes information
        let clientesRows = "";
        this.model.clientes.forEach( c => {
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
