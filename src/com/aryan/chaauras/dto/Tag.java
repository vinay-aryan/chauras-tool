package com.aryan.chaauras.dto;

import java.util.List;

import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import com.aryan.chaauras.constants.Constants;
import com.fasterxml.jackson.annotation.JsonInclude;

@Document(collection = Constants.TAG_COLLECTION_NAME)
@TypeAlias(Constants.TAG_COLLECTION_NAME)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Tag {

	private String tagName;
	private String tagDescr;
	
	public void setTagName(String tagName) {
		this.tagName = tagName;

	}

	public String getTagName() {
		return tagName;
	}

	public void setTagDescr(String tagDescr) {
		this.tagDescr = tagDescr;	
	}
	
	public String getTagDescr() {
		return tagDescr;
	}

}
