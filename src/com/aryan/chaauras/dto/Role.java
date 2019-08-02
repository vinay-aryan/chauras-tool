package com.aryan.chaauras.dto;

import java.util.List;

import org.springframework.data.annotation.TypeAlias;
import org.springframework.data.mongodb.core.mapping.Document;

import com.aryan.chaauras.constants.Constants;
import com.fasterxml.jackson.annotation.JsonInclude;

@Document(collection = Constants.ROLE_COLLECTION_NAME)
@TypeAlias(Constants.ROLE_COLLECTION_NAME)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class Role {

    private String           roleName;
    private List<Permission> permissions;

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }
}
