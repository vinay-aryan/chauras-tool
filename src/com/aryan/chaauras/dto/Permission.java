/**
 * 
 */
package com.aryan.chaauras.dto;

import java.util.List;

/**
 * @author vaibhav
 * 
 */
public class Permission {

    private String       name;
    private List<String> subPermissions;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getSubPermissions() {
        return subPermissions;
    }

    public void setSubPermissions(List<String> subPermissions) {
        this.subPermissions = subPermissions;
    }
}
