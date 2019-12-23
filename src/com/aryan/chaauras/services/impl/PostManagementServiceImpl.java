package com.aryan.chaauras.services.impl;

import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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

import org.springframework.stereotype.Service;

import com.aryan.chaauras.common.Status;
import com.aryan.chaauras.dto.Category;

import com.aryan.chaauras.dto.Post;

import com.aryan.chaauras.dto.Tag;

import com.aryan.chaauras.services.PostManagementService;

import com.aryan.chaauras.utils.SpringUtils;
import com.aryan.chaauras.utils.Utils;

@Service("postManagementService")
public class PostManagementServiceImpl implements PostManagementService  {

	public static PostManagementServiceImpl instance;

	public static final String          SUCCESS   = "SUCCESS";

	public static final String          FAILURE   = "FAILURE";

	public static List<String>          blockedUsers      = new ArrayList<String>();
	
	@Autowired
	private Environment properties;
	

	public static PostManagementServiceImpl getInstance() {	
		if(instance ==  null) {
			instance = (PostManagementServiceImpl) SpringUtils.getBean("postManagementService");
		}
		return instance;
	}

	@Autowired
	MongoTemplate mongoTemplate;

	private static final Logger logger = Logger.getLogger(PostManagementServiceImpl.class);

	public static void setInstance(PostManagementServiceImpl instance) {
		PostManagementServiceImpl.instance = instance;
	}

	 public List<Post> getAllPosts() {
		 List<Post> posts;
		 try {
			 posts = mongoTemplate.findAll(Post.class);
		 } catch (Exception e) {
		   logger.error("error fetching posts",e);
		   return new ArrayList<Post>();
		}
		 return posts;
	 }
	 



	
	@Override
	public boolean updatePostDetails(Post post){
		try{
			mongoTemplate.save(post);
			return true;

		}catch (Exception e) {
			logger.error(e.getMessage(), e);
		} 
		return false;


	}		 

	@Override
	public String createPost(Post post) {		        
		logger.info("service creating post");
		try {
			mongoTemplate.save(post);
		} catch (Exception e) {
			return FAILURE;
		}
		return SUCCESS;
	}

	public Tag getTagByName(String tagName) {
		 Query query = Query.query(Criteria.where("tagName").is(tagName));
		 return mongoTemplate.findOne(query, Tag.class);
	 }
	
	 public boolean updateTag(String tagName, String tagDescr) {
	        try {	     
	        	Tag tag = getTagByName(tagName);
	        	if(tag == null) {
		            tag = new Tag();
		            tag.setTagName(tagName);
		            tag.setTagDescr(tagDescr);
		            mongoTemplate.insert(tag);
	           } else {
	        	   mongoTemplate.save(tag);
	          }
	        } catch (Exception e) {
	            logger.error(String.format("error in updating tag for tagName :%s %s", tagName, e.getMessage()));
	            return false;
	        }
	        return true;
	 }
	 
	 
	 


	@Override
	public List<Tag> getAllTags() {
		 List<Tag> tags;
		 try {
			 tags = mongoTemplate.findAll(Tag.class);
		 } catch (Exception e) {
		   logger.error("error fatching tags",e);
		   return new ArrayList<Tag>();
		}
		 return tags;
	 
	}
	
	@Override
	public List<Category> getAllCategories() {
		 List<Category> categories;
		 try {
			 categories = mongoTemplate.findAll(Category.class);
		 } catch (Exception e) {
			 logger.error("error fatching categories",e);
			 return new ArrayList<Category>();
		}
		return categories;
	 
	}


	@Override
	public Map<String, List<Post>> getPostsByStatus() {
		Map<String, List<Post>> statusWisePost = null;
		Map<String, Status> statuses = Status.getStatusNameMap();
		for(String status : statuses.keySet()){
			Query query = Query.query(Criteria.where("status").is(status));
			statusWisePost.put(status, mongoTemplate.find(query, Post.class));	 
		}
		return statusWisePost;
	}


	@Override
	public Map<String, List<Post>> getPostsByCategory() {
		Map<String, List<Post>> categoryWisePost = null;
		List<Category> categories = getAllCategories();
		for(Category category : categories){
			String categoryName = category.getCategoryName();
			Query query = Query.query(Criteria.where("category").is(categoryName));
			categoryWisePost.put(categoryName, mongoTemplate.find(query, Post.class));	 
		}
		return categoryWisePost;
	}


	@Override
	public Map<String, List<Post>> getPostsByTags() {
		Map<String, List<Post>> tagWisePost = null;
		List<Tag> tags = getAllTags();
		for(Tag tag : tags){
			String tagName = tag.getTagName();
			Query query = Query.query(Criteria.where("tag").is(tagName));
			tagWisePost.put(tagName, mongoTemplate.find(query, Post.class));	 
		}
		return tagWisePost;
	}


	@Override
	public List<Tag> getTagsOfPost(Post post) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public String getCategoryOfPost(Post post) {
		// TODO Auto-generated method stub
		return null;
	}
	 

}
