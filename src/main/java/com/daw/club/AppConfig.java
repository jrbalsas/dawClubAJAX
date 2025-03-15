package com.daw.club;

import com.daw.club.model.Cliente;
import com.daw.club.model.dao.ClienteDAO;
import com.daw.club.model.dao.qualifiers.DAOMap;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.enterprise.event.Startup;
import jakarta.enterprise.inject.Default;
import jakarta.inject.Inject;
import jakarta.security.enterprise.authentication.mechanism.http.BasicAuthenticationMechanismDefinition;
import jakarta.security.enterprise.authentication.mechanism.http.FormAuthenticationMechanismDefinition;
import jakarta.security.enterprise.authentication.mechanism.http.LoginToContinue;
import org.glassfish.soteria.identitystores.annotation.Credentials;
import org.glassfish.soteria.identitystores.annotation.EmbeddedIdentityStoreDefinition;

import java.util.logging.Logger;

/** Configure App
 *
 * @author jrbalsas
 */
/*
    SELECT some IdentityStore implementations
*/
/* Soteria RI in memory IdentityStore (org.glassfish.soteria dependency needed in pom.xml */
@EmbeddedIdentityStoreDefinition({
        @Credentials(callerName = "admin", password = "secret1", groups = {"ADMINISTRADORES"}),
        @Credentials(callerName = "user", password = "secret2", groups = {"USUARIOS"})
})
/*
 * SELECT ONE HttpAuthenticationMchanismDefinition
 */
/* Use browser authentication dialog */
@BasicAuthenticationMechanismDefinition(
        realmName = "Club de Tenis"
)
/* Estandard form validation with j_security_check action*/
//@FormAuthenticationMechanismDefinition(
//        loginToContinue = @LoginToContinue(
//                loginPage = "/login.jsf",
//                errorPage = "/login.jsf?error",
//                useForwardToLogin = false
//        )
//)

@Default
@ApplicationScoped
public class AppConfig {

        @Inject @DAOMap
        //@Inject @DAOJpa
        ClienteDAO clienteDAO;

        private Logger logger = Logger.getLogger(AppConfig.class.getName());

        public void onStartup(@Observes Startup event) {
                logger.info(">>>Inicializando aplicación");

                createSampleData();
        }

        public void createSampleData() {
                logger.info("Creando clientes de prueba");

                clienteDAO.crea( new Cliente(0, "Paco López", "11111111-A", false) );
                clienteDAO.crea( new Cliente(0, "María Jiménez", "22222222-B", true) );
                clienteDAO.crea( new Cliente(0, "Carlos García", "33333333-C", true) );
        }
}
