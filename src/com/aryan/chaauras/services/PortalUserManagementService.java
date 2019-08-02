package com.aryan.chaauras.services;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.core.GrantedAuthority;

import com.aryan.chaauras.dto.Permission;
import com.aryan.chaauras.dto.PortalUser;
import com.aryan.chaauras.dto.Role;

public interface PortalUserManagementService {
	
	 public List<PortalUser> getAllUsers();
	 public List<Role> getAllRoles();
	 public List<String> getBlockedUsers();
	 public PortalUser getUserDetails(String username);
	 public List<GrantedAuthority> getGrantedAuthoritiesForUser(PortalUser user);
	 public boolean updateToolUserDetails(PortalUser user);
	 public String createUser(PortalUser user);
	 public List<Role> getRolesOfLoggedInUser(HttpServletRequest request);
	 public boolean validateUsernameEmailIdMapping(String username, String emailId);
	 public void updateBlockUsersCache();
	 public boolean validateAndResetPassword(String username, String cipheredUsername, String newPassword);
	 public boolean updateRole(String roleName, List<Permission> permissionsList);

}
