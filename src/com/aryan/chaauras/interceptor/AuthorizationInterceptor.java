package com.aryan.chaauras.interceptor;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.servlet.ModelAndView;

import com.aryan.chaauras.dto.NavigationEnum;
import com.aryan.chaauras.dto.Permission;
import com.aryan.chaauras.dto.Role;
import com.aryan.chaauras.dto.SubNavEnum;
import com.aryan.chaauras.services.PortalUserManagementService;
import com.aryan.chaauras.services.impl.PortalUserManagementServiceImpl;


/**
 * Intercepting user's roles and permissions.
 * 
 */

public class AuthorizationInterceptor extends PathMatchingInterceptor {
	
	@Autowired
	PortalUserManagementService portalUserManagementService;

    private static final Logger logger = Logger.getLogger(AuthorizationInterceptor.class);

    public AuthorizationInterceptor(String[] includes, String[] excludes, boolean includesOverwriteExcludes) {
        super(includes, excludes, includesOverwriteExcludes);
    }

    protected boolean doPreHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestUri = request.getRequestURI();        
        List<Role> roles = PortalUserManagementServiceImpl.getInstance().getAllRoles();
        String uriArr[] = requestUri.split("/", -1);
        String controllerUri = uriArr.length >= 2? uriArr[1] : "";
        /**
         * Allowing all access if Role is ADMIN
         */
        if(request.isUserInRole("ADMIN")) {
            return checkToOpenFirstSubTab(request, response, controllerUri, requestUri);
        }
        /**
         * Being intercepted by spring-security for DEFAULT role. (see spring-security.xml)
         */
        if(requestUri.equalsIgnoreCase("/") ||
        		requestUri.equalsIgnoreCase("/error.*") 
        		|| requestUri.matches("/image.*") 
        		|| requestUri.matches("/user/unauthorized.*") 
        		|| requestUri.matches("/resources/*") 
        		|| requestUri.matches("/static/*")) {
            return true;
        }
        /**
         * Allowing access of permissions granted for logged in user's role.
         */

        if(!CollectionUtils.isEmpty(roles)) {
            for(Role role : roles) {
                if(request.isUserInRole(role.getRoleName())) {
                    if(!CollectionUtils.isEmpty(role.getPermissions())) {
                        for(Permission permission : role.getPermissions()) {
                            if(permission != null) {
                                String permissionName = permission.getName();
                                try {
                                    permissionName = permissionName.split("/")[1];
                                }
                                catch (Exception e) {
                                    logger.error("Wrong format of permissionName", e);
                                }
                                if(!StringUtils.isBlank(permissionName)) {
                                    List<String> subPermissions = permission.getSubPermissions();
                                    if(CollectionUtils.isEmpty(subPermissions)) {
                                        if(permissionName.equals(controllerUri)) {
                                            return checkToOpenFirstSubTab(request, response, controllerUri, requestUri);
                                        }
                                    }
                                    else if(!CollectionUtils.isEmpty(subPermissions)) {
                                        for(String subPerm : subPermissions) {
                                            Pattern regex = Pattern.compile(subPerm + ".*");
                                            Matcher m = regex.matcher(requestUri);
                                            if(m.matches()) {
                                                return true;
                                            }
                                        }

                                        List<SubNavEnum> subNavEnumsList = SubNavEnum.accessSubModuleMap.get("/" + controllerUri);
                                        if(!CollectionUtils.isEmpty(subNavEnumsList)) {
                                            boolean subNavMatched = false;
                                            String firstSubNavUrl = subPermissions.get(0);
                                            for(SubNavEnum subNav : subNavEnumsList) {
                                                Pattern regex = Pattern.compile(subNav.getAccess() + ".*");
                                                Matcher m = regex.matcher(requestUri);
                                                if(m.matches()) {
                                                    subNavMatched = true;
                                                    break;
                                                }
                                            }
                                            if(!subNavMatched) {
                                                if(!StringUtils.isBlank(firstSubNavUrl)) {
                                                	Pattern regex = Pattern.compile("/" + controllerUri + ".*");
                                                	Matcher m = regex.matcher(firstSubNavUrl);
                                                	if(m.matches()){
                                                		request.getRequestDispatcher(firstSubNavUrl).forward(request, response);
                                                	}
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        request.getRequestDispatcher("/users/unauthorized").forward(request, response);
        return false;
    }

    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
        if(modelAndView != null)
            modelAndView.addAllObjects(getNavigationModules(request, response));
    }

    /**
     * Modifying visibility of modules according to specific roles.
     * 
     * @param request
     * @param response
     * @return
     * @throws IOException
     */
    public Map<String, Object> getNavigationModules(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Map<String, Object> model = new HashMap<String, Object>();
        String requestUri = request.getRequestURI();
        String uriArr[] = requestUri.split("/", -1);
        String controllerUri = uriArr.length >= 2? uriArr[1] : "";
        List<SubNavEnum> subNavs = null;
        if(request.isUserInRole("ADMIN")) {
            model.put("navigationEnum", NavigationEnum.values());
            subNavs = SubNavEnum.accessSubModuleMap.get("/" + controllerUri);
        }
        else {
            List<NavigationEnum> navValues = new ArrayList<>();
            subNavs = new ArrayList<SubNavEnum>();
            List<Role> roles = PortalUserManagementServiceImpl.getInstance().getAllRoles();
            for(Role role : roles) {
                String roleName = role.getRoleName();
                if(request.isUserInRole(roleName)) {
                    List<Permission> permissions = role.getPermissions();
                    for(Permission permission : permissions) {
                        try {
                            String permissionName = permission.getName();
                            navValues.addAll(NavigationEnum.accessModuleMap.get(permissionName.split("/")[1]));
                            List<String> subPerms = permission.getSubPermissions();
                            if(!CollectionUtils.isEmpty(subPerms)) {
                                for(String subPerm : subPerms) {
                                    Pattern regex = Pattern.compile("/" + controllerUri + ".*");
                                    Matcher m = regex.matcher(subPerm);
                                    if(m.matches()) {
                                        List<SubNavEnum> subs = SubNavEnum.subPermSubNavMap.get(subPerm);
                                        if(!CollectionUtils.isEmpty(subs)) {
                                            subNavs.addAll(subs);
                                        }
                                    }
                                }
                            }
                            else {
                                if(permissionName.equals("/" + controllerUri)) {
                                    subNavs = SubNavEnum.accessSubModuleMap.get("/" + controllerUri);
                                }
                            }
                        }
                        catch (Exception e) {
                            logger.error("Error in populating navigation modules", e);
                        }
                    }
                }
            }
            navValues = removeDuplicates(navValues);
            model.put("navigationEnum", navValues);
        }
        if(!CollectionUtils.isEmpty(subNavs)) {
            subNavs = removeDuplicates(subNavs);
            model.put("subNavEnum", subNavs);
            for(SubNavEnum sub : subNavs) {
                String subP = sub.getAccess();
                Pattern regex = Pattern.compile(subP + ".*");
                Matcher m = regex.matcher(requestUri);
                if(m.matches()) {
                    model.put("activeSubModule", sub);
                    break;
                }
            }
        }

        return model;
    }

    /**
     * For removing duplicates of a List
     * 
     * @param items
     * @return
     */
    private <T> List<T> removeDuplicates(List<T> items) {
        List<T> wODItems = new ArrayList<T>();
        for(T item : items) {
            if(!wODItems.contains(item)) {
                wODItems.add(item);
            }
        }
        return wODItems;
    }

    /**
     * To open first subtab in case of all null subPermissions (all permission of that module)
     * 
     * @param request
     * @param response
     * @param controllerUri
     * @param requestUri
     * @return
     * @throws ServletException
     * @throws IOException
     */
    private boolean checkToOpenFirstSubTab(HttpServletRequest request, HttpServletResponse response, String controllerUri, String requestUri) throws ServletException, IOException {
        List<SubNavEnum> subNavEnumsList = SubNavEnum.accessSubModuleMap.get("/" + controllerUri);
        if(!CollectionUtils.isEmpty(subNavEnumsList)) {
            SubNavEnum firstSubNav = subNavEnumsList.get(0);
            boolean subNavMatched = false;
            for(SubNavEnum subNav : subNavEnumsList) {
                Pattern regex = Pattern.compile(subNav.getAccess() + ".*");
                Matcher m = regex.matcher(requestUri);
                if(m.matches()) {
                    subNavMatched = true;
                    return true;
                }
            }
            if(!subNavMatched) {
                request.getRequestDispatcher(firstSubNav.getUrl()).forward(request, response);
            }
        }
        return true;
    }

}
