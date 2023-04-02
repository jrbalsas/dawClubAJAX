package com.daw.club.webservices;

import com.daw.club.model.Cliente;
import com.daw.club.model.dao.ClienteDAO;
import com.daw.club.model.dao.qualifiers.DAOMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.UriInfo;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

/**
 * Clientes JSON REST Web Service
 *
 * @author jrbalsas
 */
@Path("clientes")
@Produces(MediaType.APPLICATION_JSON)

@RequestScoped 
public class ClientesRESTService {

    @Context
    private UriInfo context;

    @Inject     @DAOMap
    ClienteDAO clienteDAO;

    public ClientesRESTService() {
    }

    @GET
    public List<Cliente> getClientes() {
        return clienteDAO.buscaTodos();
    }

    @GET
    @Path("/{id}")
    public Response getCliente(@PathParam("id") int id) {
        Response response;
        Cliente c=clienteDAO.buscaId(id);
        if( c!=null) {
            response= Response.ok(c).build();
        } else {
            //Error messages
            List<Map<String,Object>> errores=new ArrayList<>();
            Map<String,Object> err=new HashMap<>(); 
            err.put("message", "El cliente no existe");
            errores.add(err);
            response=Response.status(Response.Status.BAD_REQUEST)
                             .entity(errores).build();            
        }
        return response;
    }

    @DELETE
    @Path("/{id}")
    public Response borraCliente(@PathParam("id") int id) {
        Response response;
        
        if (clienteDAO.borra(id)==true) {
            response= Response.ok(id).build();
        } else {
            //Error messages
            List<Map<String,Object>> errores=new ArrayList<>();
            Map<String,Object> err=new HashMap<>(); 
            err.put("message", "El cliente no existe");
            errores.add(err);
            response=Response.status(Response.Status.BAD_REQUEST)
                             .entity(errores).build();
        }
        
        return response;        
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response creaCliente(@Valid Cliente c) {
        Response response;
        if (clienteDAO.crea(c)==true) {
            Integer newId=c.getId();
            response= Response.ok(c).build();
        } else {
            //Error messages
            List<Map<String,Object>> errores=new ArrayList<>();
            Map<String,Object> err=new HashMap<>(); 
            err.put("message", "No se ha podido crear el cliente");
            err.put("cliente", c);
            errores.add(err);
            response=Response.status(Response.Status.BAD_REQUEST)
                             .entity(errores).build();
        }
        return response;
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response modificaCliente(@Valid Cliente c, @PathParam("id") Integer id) {
        Response response;
        c.setId(id);
        if (clienteDAO.guarda(c)) {
            response= Response.ok(c).build();
        } else {
            //Error messages
            List<Map<String,Object>> errores=new ArrayList<>();
            Map<String,Object> err=new HashMap<>(); //Error messages
            err.put("message", "No se ha podido modificar el cliente");
            err.put("cliente", c);
            errores.add(err);
            response=Response.status(Response.Status.BAD_REQUEST)
                             .entity(errores).build();
        }
        return response;
    }
}
