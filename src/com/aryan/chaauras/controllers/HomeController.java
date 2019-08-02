package com.aryan.chaauras.controllers;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aryan.chaauras.dto.PortalUser;
import com.aryan.chaauras.services.PortalUserManagementService;
import com.aryan.chaauras.utils.Utils;

@Controller
@RequestMapping("/")
public class HomeController {

    private static final Logger                                 logger                       = Logger.getLogger(HomeController.class);


    @Autowired
	PortalUserManagementService toolUserService;

    @RequestMapping("/")
    public String home() {
        return "home/home";
    }
    
    @RequestMapping("/changePassword")
    public String changePassword() {
        return "home/changePassword";
    }

    @RequestMapping("/profile")
    public String getUserProfile() {
        return "home/userProfile";
    }
    
    @RequestMapping(value={"/changePassword"}, method=RequestMethod.POST)
    @ResponseBody
    public String updateNewPassword(HttpServletRequest request) {
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        PortalUser user = toolUserService.getUserDetails(username);
        String currentPassword = user.getPassword();
        String oldPassword = request.getParameter("oldPassword");
        String newPassword = request.getParameter("newPassword");
        if(currentPassword.equals(oldPassword) || currentPassword.equals(Utils.md5(oldPassword))){
        	//password correct;initiate update password method
        	user.setPassword(Utils.md5(newPassword));
        	toolUserService.updateToolUserDetails(user);
        	return "success";
        }
        else{
        	//send error
        	return "Failed as the password entered was incorrect.";
        }
    }

    @RequestMapping(value={"/getUserInfo"}, method=RequestMethod.GET)
    @ResponseBody
    public String getUserInfo(HttpServletRequest request) {
        logger.warn("getUserEmail");
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        PortalUser user = toolUserService.getUserDetails(username);
        if(user.getEmailId()!=null) {
            String email = user.getEmailId();
            String name = username;
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("email",email);
            jsonObject.put("name",username);
            return jsonObject.toString();
        }
        return "User information retrieval Failed";
    }


    @RequestMapping(value={"/updateEmail"}, method=RequestMethod.POST)
    @ResponseBody
    public String updateEmail(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        PortalUser user = toolUserService.getUserDetails(username);
        String emailId = request.getParameter("emailId");
        if(!StringUtils.isBlank(emailId)){
            user.setEmailId(emailId);
            toolUserService.updateToolUserDetails(user);
            return "success";
        }
        else{
            //send error
            return "Failed to save new user Email";
        }
    }
}
