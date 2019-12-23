package com.aryan.chaauras.services;

import java.util.List;
import java.util.Map;

import com.aryan.chaauras.dto.Tag;
import com.aryan.chaauras.dto.Category;
import com.aryan.chaauras.dto.Post;

public interface PostManagementService {
	
	 public List<Post> getAllPosts();
	 public List<Tag> getAllTags();
	 public List<Category> getAllCategories();
	 public Map<String, List<Post>> getPostsByStatus();
	 public Map<String, List<Post>> getPostsByCategory();
	 public Map<String, List<Post>> getPostsByTags();
	 public boolean updatePostDetails(Post post);
	 public String createPost(Post post);
	 public List<Tag> getTagsOfPost(Post post);
	 public String getCategoryOfPost(Post post);
	 public boolean updateTag(String tagName, String tagDescr);
	 

}
