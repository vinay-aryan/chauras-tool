/**
 * 
 */
package com.aryan.chaauras.controllers;

import java.util.Date;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.text.ParseException; 
import java.text.SimpleDateFormat; 
import java.util.Scanner;





import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
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
//import com.aryan.chaauras.controllers.PostManagement.elephant;
import com.aryan.chaauras.dto.Category;
import com.aryan.chaauras.dto.NavigationEnum;
import com.aryan.chaauras.dto.Permission;
import com.aryan.chaauras.dto.PortalUser;
import com.aryan.chaauras.dto.Post;
import com.aryan.chaauras.dto.Role;
import com.aryan.chaauras.dto.SubNavEnum;
import com.aryan.chaauras.dto.Tag;
import com.aryan.chaauras.services.PortalUserManagementService;
import com.aryan.chaauras.services.PostManagementService;
import com.aryan.chaauras.utils.Utils;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping("/posts")
public class PostManagement {

	   @Autowired
	   private PostManagementService                          postManagementService;

	   private Map<String,Object> 							  postTagMap;

	   private Map<String, Object>							  postCategoryMap;
	

	    private static final Logger                           logger  = Logger.getLogger(PostManagement.class);

	    
	    /**
	     * Open Users page with all tabs
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/", "/index" })
	    public ModelAndView getToolUserPostPage(HttpServletRequest request, HttpServletResponse response) {
	        logger.info("open tool user posts page");
	        Map<String, Object> models = getModels();
	        return new ModelAndView("post/tabStart", models);
	    }

	    /**
	     * Creating a new post for user.
	     * 
	     * @param request
	     * @param response
	     * @return
	     */
	    @RequestMapping(value = { "/createPost" })
	    public @ResponseBody
	    String createPost(HttpServletRequest request, HttpServletResponse response) {
	        logger.info("Creating Post: createPost()");
	        String result = "FAILURE";
	        Post post = new Post();
	        String title = request.getParameter("title");
	        String category = request.getParameter("category");
	        String status = request.getParameter("status");
	        String language = request.getParameter("language");
	        String content = request.getParameter("content");
	        String tagsStr = request.getParameter("tags");
	        String createdBy = request.getParameter("username");
	        List<String> tags = null;
	        
	        if(!StringUtils.isEmpty(status)) {
	            result += "post already exists!!";
            
                if(!StringUtils.isEmpty(tagsStr)) {
                    String tagsArr[] = tagsStr.split(",");
                    tags = Arrays.asList(tagsArr);
                }
              
                post.setTitle(title);
                post.setCategory(category);
                post.setTags(tags);
                post.setPostUser(createdBy);
                post.setLanguage(language);
                post.setStatus(status);
                Date date = new Date();
                post.setWrittenDate(date);
                post.setLastModDate(date);
                result = postManagementService.createPost(post);
	            
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
	    @RequestMapping(value = { "/updatePost" })
	    public @ResponseBody
	    String updatePost(HttpServletRequest request, HttpServletResponse response) {
	    	logger.info("Creating Post: updatePost()");
	        String result = "FAILURE";
	        Post post = new Post();
	        String title = request.getParameter("title");
	        String category = request.getParameter("category");
	        String status = request.getParameter("status");
	        String language = request.getParameter("language");
	        String content = request.getParameter("content");
	        String tagsStr = request.getParameter("tags");
	        String createdBy = request.getParameter("username");
	        List<String> tags = null;
	        
	        if(!StringUtils.isEmpty(status)) {
	            result += "post already exists!!";
	            
                if(!StringUtils.isEmpty(tagsStr)) {
                    String tagsArr[] = tagsStr.split(",");
                    tags = Arrays.asList(tagsArr);
                }
              
                post.setTitle(title);
                post.setCategory(category);
                post.setTags(tags);
                post.setPostUser(createdBy);
                post.setLanguage(language);
                post.setStatus(status);
                Date date = new Date();
                post.setWrittenDate(date);
                post.setLastModDate(date);
                result = postManagementService.createPost(post);
	           
	        }
	        return result;
	    }
	    
	    
	   
	    /**
	     * Get model map for this controller and local maps caching.
	     * 
	     * @return
	     */
	    private Map<String, Object> getModels() {
	        Map<String, Object> models = new HashMap<String, Object>();
	        List<Tag> tags = postManagementService.getAllTags();
	        List<Category> categories = postManagementService.getAllCategories();
	        List<Post> posts = postManagementService.getAllPosts();
	        
	        for(Post post : posts) {
	            postTagMap.put(post.getPostUser(), post.getTags());
	            postCategoryMap.put(post.getPostUser(), post.getCategory());
	        }
	        models.put("tags", tags);
	        models.put("categories", categories);
	        models.put("languages", Language.values());
	        return models;
	    }
	

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

	    
	    @RequestMapping(value = { "/posts/index" })
	    public ModelAndView manageRoles(HttpServletRequest request, HttpServletResponse response) {
	        Map<String, Object> models = getModels();
	        return new ModelAndView("userTool/managePosts", models);
	    }

	   
	    @RequestMapping(value = { "/getTagsForPost" })
	    public @ResponseBody
	    List<Tag> getTagsForPost(HttpServletRequest request, HttpServletResponse response) {
	        String post = request.getParameter("post");
	        
			@SuppressWarnings("unchecked")
			List<Tag> tags = (List<Tag>) postTagMap.get(post);
	        return tags;
	    }
	    
	 
	    /*
	     * updateRole mapping updates roles with particular
	     * permissions. if role is  not in db, it creates new role.
	     */
	    
	    @RequestMapping(value = { "/updateTag" }, method = RequestMethod.POST)
	    public @ResponseBody
	    String updateTag(HttpServletRequest request, HttpServletResponse response) {
	        String resp = null;

	        String tagName = request.getParameter("tag");
	        String tagDescr = request.getParameter("tagDescr");

	        ObjectMapper mapper = new ObjectMapper();

	        if(!StringUtils.isBlank(tagName)) {
	            tagName = tagName.toUpperCase();
	        }

	        boolean isUpdated = postManagementService.updateTag(tagName , tagDescr);

	        if(isUpdated) {
	            resp = Constants.SUCCESS;
	        }
	        else {
	            resp = Constants.FAILURE;
	        }
	        return resp;
	    }	  
	    
}


