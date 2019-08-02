/**
 * 
 */
package com.aryan.chaauras.controllers;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.aryan.chaauras.constants.Constants;
import com.aryan.chaauras.services.PortalUserManagementService;
import com.aryan.chaauras.utils.CookieUtils;
import com.aryan.chaauras.utils.Utils;


@Controller
@RequestMapping("/toolLogin")
public class PortalLoginController {

	 @Autowired
	    private PortalUserManagementService portalUserManageService;

	    private static final String   _sfErrorMessage = "errorMessage";

	    private static final String   _sfMessage      = "message";

	    private static final long     _sfTimeGap      = 15 * 60 * 1000;

	    /**
	     * Open login page.
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "", "/", "/index" })
	    public ModelAndView openLoginPage(HttpServletRequest request, HttpServletResponse response) {
	    	ModelAndView view = logOutIfLoggedIn(request);
	    	if(view != null){
	    		return view;
	    	}
	        String auth = request.getParameter("auth");
	        Map<String, Object> models = new HashMap<String, Object>();
	        if(!StringUtils.isBlank(auth)) {
	            if(auth.equalsIgnoreCase("FAIL")) {
	            	Cookie usernameCookie = CookieUtils.getCookie(request, Constants.LOGIN_USERNAME_KEY);
	            	Cookie recentlyEnteredUsernameCookie = CookieUtils.getCookie(request, Constants.RECENTLY_ENTERED_USERNAME);
	            	if(usernameCookie != null && recentlyEnteredUsernameCookie != null && usernameCookie.getValue().equalsIgnoreCase(recentlyEnteredUsernameCookie.getValue()) ){
	            		deleteAuthenticationCookies(response);
	            	}
	                models.put(_sfErrorMessage, "Authentication Failed");
	            }
	            else if(auth.equalsIgnoreCase("logout")) {
	                models.put(_sfMessage, "Successfully logged out");
	            }
	            else if(auth.equalsIgnoreCase("blocked")) {
	                models.put(_sfMessage, "You are Blocked, Please contact administrator");
	            }
	        }
	        if(StringUtils.isBlank(auth) || !auth.equalsIgnoreCase("FAIL")){
	        	Cookie usernameCookie = CookieUtils.getCookie(request, Constants.LOGIN_USERNAME_KEY);
	        	Cookie passwordCookie = CookieUtils.getCookie(request, Constants.LOGIN_PASSWORD_KEY);
	        	if(usernameCookie != null && passwordCookie != null){
	        		models.put("username", usernameCookie.getValue());
	        		models.put("password", passwordCookie.getValue());
	        	}
	        }
	        return new ModelAndView("user/loginTool", models);
	    }

	    /**
	     * Open forgot password page and process it.
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/forgotPassword" })
	    public ModelAndView openForgotPasswordPage(HttpServletRequest request, HttpServletResponse response) {
	    	ModelAndView view = logOutIfLoggedIn(request);
	    	if(view != null){
	    		return view;
	    	}
	        Map<String, Object> models = new HashMap<String, Object>();
	        String username = request.getParameter("fp_username");
	        String emailId = request.getParameter("fp_emailId");
	        String process = request.getParameter("process");
	        if(!StringUtils.isBlank(process) && process.equals("true")) {
	            boolean isMapped = portalUserManageService.validateUsernameEmailIdMapping(username, emailId);
	            if(isMapped) {
	                models.put(_sfMessage, "Email with resetting password link has been sent to you. The link is valid for 15 mins. only");
	            }
	            else {
	                models.put(_sfErrorMessage, "Either email id or username is wrong");
	            }
	        }
	        else {
	            models.put(_sfMessage, "Enter your details");
	        }
	        return new ModelAndView("user/forgotPassword", models);
	    }

	    /**
	     * Open reset password page and process it. The link to this page is sent in the email of the
	     * user.
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/resetPassword" })
	    public ModelAndView openPwdResetPage(HttpServletRequest request, HttpServletResponse response) {

	    	ModelAndView view = logOutIfLoggedIn(request);
	    	if(view != null){
	    		return view;
	    	}
	    	Map<String, Object> models = new HashMap<String, Object>();
	    	String username = request.getParameter("rp_u");
	    	String cipheredUsername = request.getParameter("rp_cU");
	    	String newPassword = request.getParameter("rp_password");
	    	String timeStamp = request.getParameter("ts");
	    	String process = request.getParameter("process");
	    	if(!StringUtils.isBlank(username) && !StringUtils.isBlank(cipheredUsername) && !StringUtils.isBlank(timeStamp)) {
	    		models.put("username", username);
	    		models.put("cipheredUsername", cipheredUsername);
	    		models.put("ts", timeStamp);
	    		if(!StringUtils.isBlank(process) && process.equals("true")) {
	    			boolean isMapped = false;
	    			try {
	    				long ts = Long.parseLong(timeStamp);
	    				if((System.currentTimeMillis() - ts) <= _sfTimeGap) {
	    					isMapped = portalUserManageService.validateAndResetPassword(username, cipheredUsername, Utils.md5(newPassword));
	    				}
	    			}
	    			catch (Exception e) {
	    				isMapped = false;
	    			}
	    			if(isMapped) {
	    				models.put(_sfMessage, "Password has been updated. You are being redirected to Login page....");
	    				models.put("updated", "true");
	    			}
	    			else {
	    				models.put(_sfErrorMessage, "Unable to update password or link has expired. Try forgot password again!!");
	    			}
	    		}
	    		else {
	    			models.put(_sfMessage, "Enter your new password");
	    		}
	    	}
	    	else {
	    		models.put(_sfErrorMessage, "Invalid link!!");
	    	}
	    	return new ModelAndView("user/resetPassword", models);
	    }
	    
	    private void deleteAuthenticationCookies(HttpServletResponse response){
	    	CookieUtils.setCookie(Constants.LOGIN_USERNAME_KEY, "", true, 0, response);
			CookieUtils.setCookie(Constants.LOGIN_PASSWORD_KEY, "", true, 0, response);
	    }
	    
	    private ModelAndView logOutIfLoggedIn(HttpServletRequest request){
	    	String requestUri = new StringBuilder(request.getRequestURL()).append("?").append(request.getQueryString()).toString();
	    	if(!CollectionUtils.isEmpty(portalUserManageService.getRolesOfLoggedInUser(request))){
	    		request.getSession().invalidate();
	    		return new ModelAndView("redirect:"+requestUri);
	    	}
	    	else{
	    		return null;
	    	}
	    }
	    
	    @ResponseBody
	    @RequestMapping(value="/checkBlocked",method=RequestMethod.POST)
	    private String checkBlockedUsers(HttpServletRequest request, HttpServletResponse response,@RequestParam("username") String userName,@RequestParam("password") String password,@RequestParam("remember") boolean isRemember){
	    	if(!StringUtils.isBlank(userName)){
	    	   if(portalUserManageService.getBlockedUsers().contains(userName)){
	    		   return "blocked";
	    	   }
	    	   else{
	    		   if(isRemember){
	    			   CookieUtils.setCookie(Constants.LOGIN_USERNAME_KEY, userName, false, 0, response);
	    			   CookieUtils.setCookie(Constants.LOGIN_PASSWORD_KEY, Utils.md5(password), false, 0, response);
	    		   }
	    		   CookieUtils.setCookie(Constants.RECENTLY_ENTERED_USERNAME, userName, false, 0, response);
	    		   return "success";
	    	   }
	    	}
	    	 return "success";
	    }


}
