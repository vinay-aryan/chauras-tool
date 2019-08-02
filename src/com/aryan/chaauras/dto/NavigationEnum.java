package com.aryan.chaauras.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public enum NavigationEnum {

	ADVERTISER("/advertiser/index", "Advertiser", "/advertiser"),    
    RETAILER("/retailer/index", "Retailer", "/retailer"),
    Offer("/offers/index", "Offers", "/offers"),    
    Users("/users/index", "User", "/users");    

    private String              url;
    private String              name;
    private String              access;

    private NavigationEnum(String url, String name, String access) {
        this.url = url;
        this.name = name;
        this.access = access;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccess() {
        return access;
    }

    public void setAccess(String access) {
        this.access = access;
    }

    private static Map<String, NavigationEnum>      navigationMap   = new HashMap<String, NavigationEnum>();

    static {
        for(NavigationEnum module : NavigationEnum.values()) {
            navigationMap.put(module.getUrl().split("/")[1], module);
        }
    }

    public static Map<String, List<NavigationEnum>> accessModuleMap = new HashMap<String, List<NavigationEnum>>();

    static {
        for(NavigationEnum module : NavigationEnum.values()) {
            String key = module.getAccess().split("/")[1];
            List<NavigationEnum> navs = accessModuleMap.get(key);
            navs = navs == null? new ArrayList<NavigationEnum>() : navs;
            navs.add(module);
            accessModuleMap.put(module.getAccess().split("/")[1], navs);
        }
    }

    public static NavigationEnum getModuleByUrlPattern(String pattern) {
        return navigationMap.get(pattern);
    }
}