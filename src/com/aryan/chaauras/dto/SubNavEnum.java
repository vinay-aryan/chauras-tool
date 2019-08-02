/**
 * 
 */
package com.aryan.chaauras.dto;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public enum SubNavEnum {
    CUSTOMER_HISTORY(NavigationEnum.Offer, "/offers/history", "/offers/history.html", "Customer History"),
    HANDLE_CSV(NavigationEnum.Offer, "/offers/csv", "/offers/csv.html", "Export/Upload CSV"),
    ACTION(NavigationEnum.Offer, "/offers/action", "/offers/action.html", "Manage Offers"), 
    EDIT_OFFERS(NavigationEnum.Offer, "/offers/editOffers", "/offers/editOffers.html", "Edit Offers");

    private NavigationEnum moduleName;

    private String         access;

    private String         url;

    private String         name;

    private SubNavEnum(NavigationEnum moduleName, String access, String url, String name) {
        this.moduleName = moduleName;
        this.access = access;
        this.url = url;
        this.name = name;
    }

    public NavigationEnum getModuleName() {
        return moduleName;
    }

    public void setModuleName(NavigationEnum moduleName) {
        this.moduleName = moduleName;
    }

    public String getAccess() {
        return access;
    }

    public void setAccess(String access) {
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

    public static Map<String, List<SubNavEnum>> accessSubModuleMap = new HashMap<String, List<SubNavEnum>>();

    static {
        for(SubNavEnum sub : SubNavEnum.values()) {
            String parentAccess = sub.getModuleName().getAccess();
            List<SubNavEnum> allSubs = accessSubModuleMap.get(parentAccess);
            allSubs = allSubs == null? new ArrayList<SubNavEnum>() : allSubs;
            allSubs.add(sub);
            accessSubModuleMap.put(sub.getModuleName().getAccess(), allSubs);
        }
    }

    public static Map<String, List<SubNavEnum>> subPermSubNavMap   = new HashMap<String, List<SubNavEnum>>();

    static {
        for(SubNavEnum sub : SubNavEnum.values()) {
            String access = sub.getAccess();
            List<SubNavEnum> allSubs = subPermSubNavMap.get(access);
            allSubs = allSubs == null? new ArrayList<SubNavEnum>() : allSubs;
            allSubs.add(sub);
            subPermSubNavMap.put(sub.getAccess(), allSubs);
        }
    }
}
