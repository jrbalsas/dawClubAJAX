package com.daw.club.webservices;

import java.util.ArrayList;
import java.util.List;

import com.daw.club.model.dto.ErrorValidacion;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

/** Capture Bean Validation exceptions and generate JSON response with 
 *  an array of error messages, e.g [{"name":"propname","error":"error text"},..]
 *
 * @author jrbalsas
 */
@Provider
public class ClubValidationExceptionManager implements ExceptionMapper<ConstraintViolationException> {

    @Override
    public Response toResponse(ConstraintViolationException e) {
        //convert bean-validation contstraintviolation set to json array
        //p.e. [{"name":"age", "message":"the age must be over 18"}]

        List<Object> errors = new ArrayList<>();

        for (ConstraintViolation<?> cv : e.getConstraintViolations()) {
            
            //attribute name is the last part, e.g. method.arg0.propname
            String[] parts=cv.getPropertyPath().toString().split("\\.");

/*  Temporal DTO object for bean validation message ( jdk<14 )
            Object m = new Object () { //Temp anonymous inner class
                public String name = parts[parts.length-1];
                public String message = cv.getMessage();
            };
*/
            //Using DTO record for bean validation message (jdk 14+)
            errors.add( new ErrorValidacion(parts[parts.length-1], cv.getMessage() ) );
        }
        return Response
                .status(Response.Status.BAD_REQUEST)
                .entity(errors)
                .build();
    }

}
