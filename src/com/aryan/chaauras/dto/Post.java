package com.aryan.chaauras.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Date; // Import the LocalDateTime class


import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.data.annotation.TypeAlias;

import org.springframework.data.mongodb.core.mapping.Document;

import com.aryan.chaauras.constants.Constants;


import com.fasterxml.jackson.annotation.JsonInclude;

@Document(collection = Constants.TPPOST_COLLECTION_NAME)
@TypeAlias(Constants.TPPOST_COLLECTION_NAME)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Post {
	
	//@Indexed(unique = true)
	private String title;
	private String category;
	private List<String> tag;
	private String content;
	private String postUser;
	private Date writtenDate;
	private Date lastModDate;
	private String status;
	private String language;


	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public List<String> getTags() {
		return tag;
	}

	public void setTags(List<String> tag) {
		this.tag = tag;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getPostUser() {
		return postUser;
	}

	public void setPostUser(String postUser) {
		this.postUser = postUser;
	}

	public Date getWrittenDate() {
		return writtenDate;
	}

	public void setWrittenDate(Date writtenDate) {
		this.writtenDate = writtenDate;
	}

	public Date getLastModDate() {
		return lastModDate;
	}

	public void setLastModDate(Date lastModDate) {
		this.lastModDate = lastModDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getLanguage() {
		return language;
	}
	
	public void setLanguage(String language) {
		this.language = language;
	}
	public String toJson() {
		JSONObject jsonObj = toJsonObject();
		String jsonStr = jsonObj.toString();
		return jsonStr;
	}

	@SuppressWarnings("unchecked")
	public JSONObject toJsonObject() {
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("title", getTitle());
		jsonObj.put("category", getCategory());
		jsonObj.put("content", getContent());
		jsonObj.put("postUser", getPostUser());
		jsonObj.put("writtenDate", getWrittenDate());
		jsonObj.put("lastModDate", getLastModDate());
		jsonObj.put("status", getStatus());
		jsonObj.put("language", getLanguage());
		jsonObj.putAll(getTagsArrayJson());
		return jsonObj;
	}

	@SuppressWarnings("unchecked")
	private JSONObject getTagsArrayJson() {

		JSONArray contentListArray = new JSONArray();
		for(String tag : getTags()){
			contentListArray.add(tag);
		}
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("tag", contentListArray);
		return jsonObj;
	}

	public void fromJson(String json) throws Exception {
		Object obj = JSONValue.parseWithException(json);
		JSONObject valueMap = (JSONObject) obj;
		fromJson(valueMap);

	}

	public void fromJson(JSONObject valueMap) throws Exception {
		if(valueMap.containsKey("title"))
			setTitle(((String)valueMap.get("title")));
		if(valueMap.containsKey("category"))
			setCategory(((String)valueMap.get("category")));
		if(valueMap.containsKey("tag"))
			setTags(getListFromJsonArray(valueMap,"tag"));
		if(valueMap.containsKey("content"))
			setLanguage(((String)valueMap.get("content")));
		if(valueMap.containsKey("status"))
			setStatus(((String)valueMap.get("status")));
		if(valueMap.containsKey("language"))
			setLanguage(((String)valueMap.get("language")));
		if(valueMap.containsKey("postUser"))
			setPostUser(((String)valueMap.get("postUser")));
		if(valueMap.containsKey("writtenDate"))
			setWrittenDate((Date)valueMap.get("writtenDate"));
		if(valueMap.containsKey("lastModDate"))
			setLastModDate((Date)valueMap.get("lastModDate"));
	}

	private List<String> getListFromJsonArray(JSONObject jsonValueMap,String key){
		List<String> list = new ArrayList<String>();
		JSONArray jsonArray = (JSONArray) jsonValueMap.get(key);
		if(jsonArray != null) {
			for(int i = 0; i < jsonArray.size(); i++) {
				String item = (String) jsonArray.get(i);
				list.add(item.toUpperCase());
			}
		}
		return list;
	}
}