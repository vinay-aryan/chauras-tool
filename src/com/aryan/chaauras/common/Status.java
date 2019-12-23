package com.aryan.chaauras.common;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public enum Status {
    CREATED("cre", "Created" ), SUBMITTED("sub", "Submitted"), REVIEWED("rev", "Reviewed"), PUBLISHED("pub", "Published");

    private Status(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    private String code;
    private String displayName;

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }


    private static Map<String, Status> statusMap = new HashMap<String, Status>();
    private static Map<String, Status> statusNameMap = new HashMap<String, Status>();

    static {
        for (Status status : Status.values()) {
            statusMap.put(status.getCode(), status);
            statusNameMap.put(status.getDisplayName().toLowerCase(), status);
        }
    }

    public static Status getStatusByCode(String st) {
        return statusMap.get(st);
    }

    public static Status getStatusByName(String statusName) {
        return statusNameMap.get(statusName.toLowerCase());
    }
    
    public static Set<String> getStatusCode(){
    	return statusMap.keySet();
    }

    public static Map<String, Status> getStatusMap() {
        return statusMap;
    }

    public static Map<String, Status> getStatusNameMap() {
        return statusNameMap;
    }
}
