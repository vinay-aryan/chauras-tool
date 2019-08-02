package com.aryan.chaauras.services.impl;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.aryan.chaauras.dto.Permission;
import com.aryan.chaauras.dto.PortalUser;
import com.aryan.chaauras.dto.Role;
import com.aryan.chaauras.services.PortalUserManagementService;
import com.aryan.chaauras.utils.EmailSender;
import com.aryan.chaauras.utils.EncryptUtils;
import com.aryan.chaauras.utils.SpringUtils;
import com.aryan.chaauras.utils.Utils;


@Service("portalUserManagementService")
public class PortalUserManagementServiceImpl implements PortalUserManagementService {

	public static PortalUserManagementServiceImpl instance;

	public static final String          SUCCESS   = "SUCCESS";

	public static final String          FAILURE   = "FAILURE";

	public static List<String>          blockedUsers      = new ArrayList<String>();
	
	
	 @Value("${user.management.resetPasswordUrl}")
	 private String                      _resetPasswordUrl;

	    @Value("${user.management.encryptionkey}")
	    private String                      encryptKey;

	    @Value("${user.management.mailUserName}")
	    private String                      _mailUsername;

	    @Value("${user.management.mailPassword}")
	    private String                      _mailPassword;

	@Autowired
	private Environment properties;
	
	
	@Autowired
	EmailSender emailSender;

	public static PortalUserManagementServiceImpl getInstance() {	
		if(instance ==  null) {
			instance = (PortalUserManagementServiceImpl) SpringUtils.getBean("portalUserManagementService");
		}
		return instance;
	}

	@Autowired
	MongoTemplate mongoTemplate;

	private static final Logger logger = Logger.getLogger(PortalUserManagementServiceImpl.class);

	public static void setInstance(PortalUserManagementServiceImpl instance) {
		PortalUserManagementServiceImpl.instance = instance;
	}


	@PostConstruct
	public void init(){
		updateBlockUsersCache();
		createAdminUser();
	}

	public void updateBlockUsersCache(){
		List<PortalUser> users = getAllUsers();
		for(PortalUser user :users ){
			if(user != null){
				if(user.isBlocked()){
					blockedUsers.add(user.getUsername());
				}
			}
		}
	}
	
	public List<String> getBlockedUsers() {
		return blockedUsers;
	}

	/**
	 * To create an ADMIN user in backend.
	 * 
	 * @throws Exception
	 */
	private  void createAdminUser() {	        	       
		List<String> roles = new ArrayList<String>();
		PortalUser user = new PortalUser();
		user.setUsername("admin");
		user.setPassword(Utils.md5("password"));
		roles.add("ADMIN");
		roles.add("DEFAULT");
		user.setRoles(roles);
		if(getUserDetails("admin") == null) {
			createUser(user);
		}

	}

	 public List<Role> getAllRoles() {
		 List<Role> roles;
		 try {
			 roles = mongoTemplate.findAll(Role.class);
		 } catch (Exception e) {
		   logger.error("error fatching roles",e);
		   return new ArrayList<Role>();
		}
		 return roles;
	 }
	 

	/**
	 * Get all users from backend.
	 * 
	 * @return
	 */
	@Override
	public List<PortalUser> getAllUsers() {
		List<PortalUser> users;
		try {
			users = mongoTemplate.findAll(PortalUser.class);
		} catch (Exception e) {
			logger.error("error in fetching all users", e);
			return new ArrayList<PortalUser>();
		}
		return users;
	}

	@Override	
	public PortalUser getUserDetails(String username) {
		Query query = Query.query(Criteria.where("username").is(username));
		PortalUser user = mongoTemplate.findOne(query, PortalUser.class);
		return user;
	}

	@Override
	public List<GrantedAuthority> getGrantedAuthoritiesForUser(PortalUser user) {
		List<GrantedAuthority> authorities = new ArrayList<>();
		List<String> roles = user.getRoles();
		for(String role : roles) {
			authorities.add(new SimpleGrantedAuthority(role));
		}
		return authorities;
	}

	@Override
	public boolean updateToolUserDetails(PortalUser user){
		try{
			mongoTemplate.save(user);
			return true;

		}catch (Exception e) {
			logger.error(e.getMessage(), e);
		} 
		return false;


	}		 

	@Override
	public String createUser(PortalUser user) {		        
		logger.info("service creating user");
		try {
			mongoTemplate.save(user);
		} catch (Exception e) {
			return FAILURE;
		}
		return SUCCESS;
	}

	/**
	 * Get all roles of the logged in user from backend.
	 * 
	 * @param request
	 * @return
	 */
	@Override
	public List<Role> getRolesOfLoggedInUser(HttpServletRequest request) {
		List<Role> roles = getAllRoles();
		List<Role> rolesOfLoggedInUser = new ArrayList<Role>();
		for(Role role : roles) {
			if(request.isUserInRole(role.getRoleName())) {
				rolesOfLoggedInUser.add(role);
			}
		}
		return rolesOfLoggedInUser;
	}	    
	
	 public boolean validateUsernameEmailIdMapping(String username, String emailId) {	       
	        boolean isValid = false;
	        String content = null;
	        if(StringUtils.isBlank(username) || StringUtils.isBlank(emailId)) {
	            isValid = false;
	        } else {
	           Query query = Query.query(Criteria.where("email").is(emailId).and("username").is(username));
	           PortalUser user = mongoTemplate.findOne(query, PortalUser.class);
	           if(user != null) {
		            try {
		                sendEmail(username, emailId);
		                isValid = true;
		            }catch (Exception e) {
		                isValid = false;
		                logger.error("Exception in sending email with reset password link", e);
		            }
	          }	else {
	            isValid = false;
	        }
	        }
	        return isValid;
	    }
	 
	 public boolean updateRole(String roleName, List<Permission> permissions) {
	        try {	     
	        	Role role = getRoleByName(roleName);
	        	if(role == null) {
		            role = new Role();
		            role.setRoleName(roleName);
		            role.setPermissions(removeDuplicatesFromList(permissions));	 	           
		            mongoTemplate.insert(role);
	           } else {
	        	   role.setPermissions(permissions);
	        	   mongoTemplate.save(role);
	          }
	        } catch (Exception e) {
	            logger.error(String.format("error in updating role for roleName :%s %s", roleName, e.getMessage()));
	            return false;
	        }
	        return true;
	 }
	 
	 
	 public Role getRoleByName(String roleName) {
		 Query query = Query.query(Criteria.where("roleName").is(roleName));
		 return mongoTemplate.findOne(query, Role.class);
	 }
	 
	/* * Removing duplicates from the permission list.
     * 
     * @param permissions
     * @return
     */
    private List<Permission> removeDuplicatesFromList(List<Permission> permissions) {
        List<Permission> listWoDuplicates = new ArrayList<Permission>();
        for(int i = 0; i < permissions.size(); i++) {
            String permission = permissions.get(i).getName();
            boolean isPresent = false;       
            for(Permission perm : listWoDuplicates) {
                String permName = perm.getName();
                if(permission.equals(permName)) {
                    isPresent = true;
                    break;
                }
            }
            if(!isPresent) {
                listWoDuplicates.add(permissions.get(i));
            }
        }
        return listWoDuplicates;
    }
	 
	  /**
	     * Send Reset password link email
	     * 
	     * @param username
	     * @param emailId
	     * @throws Exception
	     */
	    public void sendEmail(String username, String emailId) throws Exception {
	        List<String> to = new ArrayList<>();
	        to.add(emailId);
	        StringBuilder builder = new StringBuilder("Click on the following link to reset ur password");
	        builder.append("<br/>").append(_resetPasswordUrl).append("?rp_cU=").append(URLEncoder.encode(EncryptUtils.encrypt(username, encryptKey), "utf-8")).append("&rp_u=").append(username)
	                .append("&ts=").append(System.currentTimeMillis()).append("<br/>");
	        emailSender.sendGmail(_mailUsername, to, null, null, "Reset Password", builder.toString(), _mailUsername, _mailPassword, null, null, null);
	    }
	    
	    
	    /**
	     * Validate link and reset user's password
	     * 
	     * @param username
	     * @param emailId
	     * @return
	     */
	    public boolean validateAndResetPassword(String username, String cipheredUsername, String newPassword) {
	        boolean isValid = false;
	        try {
	            if(StringUtils.isBlank(username) || StringUtils.isBlank(newPassword) || StringUtils.isBlank(cipheredUsername)) {
	                isValid = false;
	            }
	            else if(username.equals(EncryptUtils.decrypt(cipheredUsername, encryptKey))) {
	               Query query = Query.query(Criteria.where("username").is(username));
	               Update update = new Update();
	               update.set("password", newPassword);
	               mongoTemplate.updateFirst(query, update, PortalUser.class);	            		   
	            }
	        } catch (Exception e) {
	            logger.error("Exception in reseting password", e);
	        }
	        return isValid;
	    }
}
