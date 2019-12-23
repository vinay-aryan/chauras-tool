package com.aryan.chaauras.dto;

import java.util.List;

import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import com.aryan.chaauras.constants.Constants;
import com.fasterxml.jackson.annotation.JsonInclude;

@Document(collection = Constants.CATEGORY_COLLECTION_NAME)
@TypeAlias(Constants.CATEGORY_COLLECTION_NAME)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Category {
	
        private String           categoryName;
	   
	    public String getCategoryName() {
	        return categoryName;
	    }

	    public void setCategoryName(String categoryName) {
	        this.categoryName = categoryName;
	    }

}
