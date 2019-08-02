package com.aryan.chaauras.security;

import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import com.aryan.chaauras.dto.PortalUser;
import com.aryan.chaauras.services.PortalUserManagementService;
import com.aryan.chaauras.services.impl.PortalUserManagementServiceImpl;
import com.aryan.chaauras.utils.Utils;

@Component("toolAuthenticationProvider")
public class ToolAuthenticator  implements AuthenticationProvider{

	@Autowired(required = false)
	PortalUserManagementService portalUserManagementService;							
	
	@Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		if(portalUserManagementService == null ) {
			portalUserManagementService = PortalUserManagementServiceImpl.getInstance();
		}
        UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication;
        PortalUser user = portalUserManagementService.getUserDetails(token.getName());
        if( user != null && !user.isBlocked() && (user.getPassword().equals(Utils.md5((String)token.getCredentials())) || user.getPassword().equals(token.getCredentials()))){
        	Collection<GrantedAuthority> authorities = portalUserManagementService.getGrantedAuthoritiesForUser(user);
        	return new UsernamePasswordAuthenticationToken(token.getName(), Utils.md5((String)token.getCredentials()), authorities);
        }
        else {
            throw new UsernameNotFoundException("Invalid username/password");
        }
    
//        final String name = authentication.getName();
//        String password = authentication.getCredentials().toString();
// 
//        // use the credentials to try to authenticate against the third party system
//            List<GrantedAuthority> grantedAuths = new ArrayList<>();
//            GrantedAuthority g = new GrantedAuthority() {
//				
//				@Override
//				public String getAuthority() {
//					return "ROLE"+name;
//				}
//			};
//			grantedAuths.add(g);
//            return new UsernamePasswordAuthenticationToken(name, password, grantedAuths);
    }
 
    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

}
