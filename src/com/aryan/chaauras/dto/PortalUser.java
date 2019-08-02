package com.aryan.chaauras.dto;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import com.aryan.chaauras.constants.Constants;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

@Document(collection = Constants.USER_COLLECTION_NAME)
@TypeAlias(Constants.USER_COLLECTION_NAME)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class PortalUser {
	private String username;
	private String password;
	private List<String> roles;
	private boolean isBlocked = false;

	@JsonIgnore
	private String group;
	private String emailId;

	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public List<String> getRoles() {
		return roles;
	}
	public void setRoles(List<String> roles) {
		this.roles = roles;
	}
	@JsonProperty("isBlocked")
	public boolean isBlocked() {
		return isBlocked;
	}
	@JsonProperty("isBlocked")
	public void setBlocked(boolean isBlocked) {
		this.isBlocked = isBlocked;
	}

	@JsonIgnore
	public String getGroup() {
		return group;
	}

	@JsonIgnore
	public void setGroup(String group) {
		this.group = group;
	}

	public String getEmailId() {
		return emailId;
	}
	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}
	public String toJson() {
		JSONObject jsonObj = toJsonObject();
		String jsonStr = jsonObj.toString();
		return jsonStr;
	}

	@SuppressWarnings("unchecked")
	public JSONObject toJsonObject() {
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("username", getUsername());
		jsonObj.put("password", getPassword());
		jsonObj.put("emailId", getEmailId());
		jsonObj.put("isBlocked", isBlocked());
		jsonObj.putAll(getRoleArrayJson());
		return jsonObj;
	}

	@SuppressWarnings("unchecked")
	private JSONObject getRoleArrayJson() {

		JSONArray contentListArray = new JSONArray();
		for(String role : getRoles()){
			contentListArray.add(role);
		}
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("roles", contentListArray);
		return jsonObj;
	}

	public void fromJson(String json) throws Exception {
		Object obj = JSONValue.parseWithException(json);
		JSONObject valueMap = (JSONObject) obj;
		fromJson(valueMap);

	}

	public void fromJson(JSONObject valueMap) throws Exception {
		if(valueMap.containsKey("group"))
			setGroup(((String)valueMap.get("group")));
		if(valueMap.containsKey("username"))
			setUsername(((String)valueMap.get("username")));
		if(valueMap.containsKey("password"))
			setPassword(((String)valueMap.get("password")));
		if(valueMap.containsKey("emailId"))
			setEmailId(((String)valueMap.get("emailId")));
		if(valueMap.containsKey("roles"))
			setRoles(getListFromJsonArray(valueMap,"roles"));
		if(valueMap.containsKey("isBlocked"))
			setBlocked((boolean)valueMap.get("isBlocked"));

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