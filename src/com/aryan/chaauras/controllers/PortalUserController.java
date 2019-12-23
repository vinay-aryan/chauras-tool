/**
 * 
 */
package com.aryan.chaauras.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.aryan.chaauras.common.Language;
import com.aryan.chaauras.constants.Constants;
import com.aryan.chaauras.dto.NavigationEnum;
import com.aryan.chaauras.dto.Permission;
import com.aryan.chaauras.dto.PortalUser;
import com.aryan.chaauras.dto.Role;
import com.aryan.chaauras.dto.SubNavEnum;
import com.aryan.chaauras.services.PortalUserManagementService;
import com.aryan.chaauras.utils.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/users")
public class PortalUserController {

	   @Autowired
	    private PortalUserManagementService                          portalUserManageService;

	    private static final Logger                            logger            = Logger.getLogger(PortalUserController.class);

	    private static Map<String, List<Permission>> rolePermissionMap = new HashMap<String, List<Permission>>();

	    private static Map<String, List<String>>               userRoleMap       = new HashMap<String, List<String>>();

	    private static Map<String, Boolean>                    userBlockMap      = new HashMap<>();

	    private static Map<String, String>                     userPasswordMap   = new HashMap<String, String>();
	    
	    /**
	     * Open Users page with all tabs
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/", "/index" })
	    public ModelAndView getToolUserPage(HttpServletRequest request, HttpServletResponse response) {
	        logger.info("open tool user page");
	        Map<String, Object> models = getModels();
	        return new ModelAndView("user/tabStart", models);
	    }

	    /**
	     * Creating a new User for tool.
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/createUser" })
	    public @ResponseBody
	    String createUser(HttpServletRequest request, HttpServletResponse response) {
	        logger.info("Creating User: createUser()");
	        String result = "FAILURE";
	        PortalUser user = new PortalUser();
	        String username = request.getParameter("username");
	        String password = request.getParameter("password");
	        String userEmailId = request.getParameter("emailId");
	        String languages = request.getParameter("languages");
	        String roleStr = request.getParameter("roles");
	        List<String> roles = null;
	        List<String> langs = null;
	        if(!StringUtils.isEmpty(username)) {
	            result += "User already exists!!";
	            if(!userPasswordMap.containsKey(username)) {
	                if(!StringUtils.isEmpty(roleStr)) {
	                    String roleArr[] = roleStr.split(",");
	                    roles = Arrays.asList(roleArr);
	                    
                    	roles.add("USER");
	                }
	                user.setPassword(Utils.md5(password));
	                user.setUsername(username);
	                user.setRoles(roles);
	                user.setEmailId(userEmailId);
	                user.setLanguage(langs);
	                result = portalUserManageService.createUser(user);
	            }
	        }
	        return result;
	    }

	    /**
	     * Update an existing User for tool.
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/updateUser" })
	    public @ResponseBody
	    String updateUser(HttpServletRequest request, HttpServletResponse response) {
	        logger.info("Updating User: updateUser()");
	        String result = "FAILURE";
	        PortalUser user = new PortalUser();
	        String username = request.getParameter("username");
	        String password = request.getParameter("password");
	        String userEmailId = request.getParameter("emailId");
	        String languages = request.getParameter("languages");
	        String roleStr = request.getParameter("roles");
	        List<String> roles = null;
	        List<String> langs = null;
	        if(!StringUtils.isEmpty(username)) {
	            result += "User already exists!!";
	            if(!userPasswordMap.containsKey(username)) {
	                if(!StringUtils.isEmpty(roleStr)) {
	                    String roleArr[] = roleStr.split(",");
	                    roles = Arrays.asList(roleArr);
	                }
	                if(!StringUtils.isEmpty(languages)) {
	                	String langArr[] = languages.split(",");
	                    langs = Arrays.asList(langArr);
	                }
	                user.setPassword(Utils.md5(password));
	                user.setUsername(username);
	                user.setRoles(roles);
	                user.setEmailId(userEmailId);
	                user.setLanguage(langs);
	                result = portalUserManageService.createUser(user);
	            }
	        }
	        return result;
	    }
	    
	    
	    /**
	     * Update Block Status
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/updateBlockUsers" })
	    public @ResponseBody
	    String updateBlockUsers(HttpServletRequest request, HttpServletResponse response) {
	        logger.info("Updating Block users");
	        String result = "FAILED";
	        String username = request.getParameter("username");
	        String blockStatus = request.getParameter("blockStatus");
	        logger.info("username - " + username);
	        PortalUser user = portalUserManageService.getUserDetails(username);
	        boolean isBlocked = false;
	        if(!StringUtils.isBlank(blockStatus) && blockStatus.equals("Block")) {
	            isBlocked = true;
	        }
	        user.setBlocked(isBlocked);
	        logger.info("user is " + user.toJsonObject().toString());
	        if(portalUserManageService.updateToolUserDetails(user)) {
	            result = "SUCCESS";
	        }
	        portalUserManageService.updateBlockUsersCache();
	        return result;
	    }
	   
	    /**
	     * Get model map for this controller and local maps caching.
	     * 
	     * @return
	     */
	    private Map<String, Object> getModels() {
	        Map<String, Object> models = new HashMap<String, Object>();
	        List<Role> roles = portalUserManageService.getAllRoles();
	        List<PortalUser> users = portalUserManageService.getAllUsers();
	        for(Role role : roles) {
	            rolePermissionMap.put(role.getRoleName(), role.getPermissions());
	        }
	        for(PortalUser user : users) {
	            userRoleMap.put(user.getUsername(), user.getRoles());
	            userPasswordMap.put(user.getUsername(), user.getPassword());
	            userBlockMap.put(user.getUsername(), user.isBlocked());
	        }
	        logger.info(userBlockMap.toString());
	        models.put("roles", roles);
	        models.put("permissions", NavigationEnum.values());
	        models.put("subPermissions", SubNavEnum.values());
	        models.put("languages", Language.values());
	        models.put("users", users);
	        return models;
	    }
	/*    
	    public static void main(String[] args) {
	    	 for(Language language : Language.values()){
	             System.out.println("Language is :"+ language.getDisplayName());
	      }
	   }
	*/

	    /**
	     * Unauthorized access page
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/unauthorized" })
	    public ModelAndView openUnauthorizedPage(HttpServletRequest request, HttpServletResponse response) {
	        logger.info("open unauthorized page");
	        return new ModelAndView("userTool/unauthorized");
	    }

	    
	    @RequestMapping(value = { "/roles/index" })
	    public ModelAndView manageRoles(HttpServletRequest request, HttpServletResponse response) {
	        Map<String, Object> models = getModels();
	        return new ModelAndView("userTool/manageRoles", models);
	    }

	    /**
	     * Getting selected permissions for a particular role. Being used as an ajax call.
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/getPermissionsForRole" })
	    public @ResponseBody
	    List<String> getPermissionsForRole(HttpServletRequest request, HttpServletResponse response) {
	        String roleName = request.getParameter("roleName");
	        List<String> allPermissions = new ArrayList<>();
	        List<Permission> permissions = rolePermissionMap.get(roleName);
	        for(Permission permission : permissions) {
	            List<String> subPerms = permission.getSubPermissions();
	            if(!CollectionUtils.isEmpty(subPerms)) {
	                for(String subperm : subPerms) {
	                    allPermissions.add(permission.getName() + "-" + subperm);
	                }
	            }
	            else {
	                allPermissions.add(permission.getName());
	            }
	        }
	        return allPermissions;
	    }

	    /**
	     * Getting selected roles for a particular User. Being used as an ajax call.
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/getRolesForUser" })
	    public @ResponseBody
	    List<String> getRolesForUser(HttpServletRequest request, HttpServletResponse response) {
	        String username = request.getParameter("username");
	        if(!StringUtils.isEmpty(username)) {
	            String usersArr[] = username.split(",");
	            if(usersArr != null) {
	                if(usersArr.length > 1) {
	                    return Collections.emptyList();
	                }
	                else {
	                    username = usersArr[0];
	                }
	            }
	        }
	        List<String> roles = userRoleMap.get(username);
	        return roles;
	    }
	    
	    /*
	    
	    @RequestMapping(value = { "/getRolesForUsers" })
	    public @ResponseBody
	    Map<String, List<String>> getRolesForUsers(HttpServletRequest request, HttpServletResponse response) {    
	        return userRoleMap;
	    }
		*/
	    @RequestMapping(value = { "/getBlockStatus" })
	    public @ResponseBody
	    String getBlockStatus(HttpServletRequest request, HttpServletResponse response) {
	        String username = request.getParameter("username");
	        boolean blockStatus = userBlockMap.get(username);
	        return String.valueOf(blockStatus);
	    }

	    private List<Permission> getPermissionListFromRequest(HttpServletRequest request) {
	        String permissionsStr = request.getParameter("permissions");
	        Map<String, List<String>> permSubPermMap = new HashMap<String, List<String>>();
	        List<Permission> permissions = new ArrayList<Permission>();
	        List<Permission> returnPerms = new ArrayList<Permission>();
	        List<Permission> permissionsListFinal = new ArrayList<Permission>();
	        if(!StringUtils.isBlank(permissionsStr)) {
	            String[] perms = permissionsStr.split(",");
	            for(String perm : perms) {
	                Permission permission = new Permission();
	                if(!StringUtils.isBlank(perm)) {
	                    if(!perm.contains("-")) {
	                        permission.setName(perm);
	                        permission.setSubPermissions(null);
	                        permissions.add(permission);
	                    }
	                    else {
	                        String permArr[] = perm.split("-", -1);
	                        List<String> subPermList = permSubPermMap.get(permArr[0]);
	                        if(!StringUtils.isBlank(permArr[1])) {
	                            if(!CollectionUtils.isEmpty(subPermList)) {
	                                if(!subPermList.contains(permArr[1])) {
	                                    subPermList.add(permArr[1]);
	                                }
	                            }
	                            else {
	                                subPermList = new ArrayList<String>();
	                                subPermList.add(permArr[1]);
	                            }
	                        }
	                        permSubPermMap.put(permArr[0], subPermList);
	                    }
	                }
	            }
	            if(!CollectionUtils.isEmpty(permSubPermMap)) {
	                for(String keyForMap : permSubPermMap.keySet()) {
	                    Permission permission = new Permission();
	                    List<String> permList = permSubPermMap.get(keyForMap);
	                    if(!CollectionUtils.isEmpty(permList)) {
	                        permission.setName(keyForMap);
	                        permission.setSubPermissions(permList);
	                        returnPerms.add(permission);
	                    }
	                }
	            }

	            if(!CollectionUtils.isEmpty(permissions) && CollectionUtils.isEmpty(returnPerms)) {
	                permissionsListFinal.addAll(permissions);
	            }
	            else if(CollectionUtils.isEmpty(permissions) && !CollectionUtils.isEmpty(returnPerms)) {
	                permissionsListFinal.addAll(returnPerms);
	            }
	            else {
	                boolean isEqual = false;
	                for(Permission permFinal1 : permissions) {
	                    for(Permission permFinal2 : returnPerms) {
	                        if(!permFinal2.getName().equals(permFinal1.getName())) {
	                            permissionsListFinal.add(permFinal1);
	                        }
	                        else {
	                            isEqual = true;
	                            permissionsListFinal.add(permFinal2);
	                        }
	                    }
	                }
	                if(!isEqual)
	                    permissionsListFinal.addAll(returnPerms);
	            }
	        }
	        return permissionsListFinal;
	    }
	    /*
	     * updateRole mapping updates roles with particular
	     * permissions. if role is  not in db, it creates new role.
	     */
	    
	    @RequestMapping(value = { "/updateRole" }, method = RequestMethod.POST)
	    public @ResponseBody
	    String updateRole(HttpServletRequest request, HttpServletResponse response) {
	        String resp = null;
	        String roleName = request.getParameter("roleName");
	        // String permissions = request.getParameter("permissions");
	        List<Permission> permissionsList = getPermissionListFromRequest(request);
	        ObjectMapper mapper = new ObjectMapper();

	        if(!StringUtils.isBlank(roleName)) {
	            roleName = roleName.toUpperCase();
	        }
	        boolean isUpdated = portalUserManageService.updateRole(roleName, permissionsList);
	        if(isUpdated) {
	            resp = Constants.SUCCESS;
	        }
	        else {
	            resp = Constants.FAILURE;
	        }
	        return resp;
	    }	  
	   	  
}
