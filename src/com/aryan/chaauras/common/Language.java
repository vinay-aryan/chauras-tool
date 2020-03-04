package com.aryan.chaauras.common;
/**
 * @author tushar
 *
 */
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
public enum Language {
    ENGLISH("en", "English", "English"), HINDI("hi", "Hindi", "हिंदी"), TAMIL("ta", "Tamil", "தமிழ்"), TELUGU("te", "Telugu", "తెలుగు"),
    KANNADA("kn", "Kannada", "ಕನ್ನಡ"), MARATHI("mr", "Marathi", "मराठी"),
    MALAYALAM("ml", "Malayalam", "മലയാളം"), BENGALI("bn", "Bengali", "বাংলা"),
    GUJARATI("gu", "Gujarati", "ગુજરાતી"), PUNJABI("pa", "Punjabi", "ਪੰਜਾਬੀ"), ORIYA("or", "Oriya", "ଓରିୟା");

    private Language(String code, String displayName, String vernacName) {
        this.code = code;
        this.displayName = displayName;
        this.vernacName = vernacName;
    }

    private String code;
    private String displayName;
    private String vernacName;

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getVernacName() {
        return vernacName;
    }

    private static Map<String, Language> languageMap = new HashMap<String, Language>();
    private static Map<String, Language> languageNameMap = new HashMap<String, Language>();

    static {
        for (Language language : Language.values()) {
            languageMap.put(language.getCode(), language);
            languageNameMap.put(language.getDisplayName().toLowerCase(), language);
        }
    }

    public static Language getLanguageByCode(String lang) {
        return languageMap.get(lang);
    }

    public static Language getLanguageByName(String langName) {
        return languageNameMap.get(langName.toLowerCase());
    }
    
    public static Set<String> getLanguagesCode(){
    	return languageMap.keySet();
    }

    public static Map<String, Language> getLanguageMap() {
        return languageMap;
    }

    public static Map<String, Language> getLanguageNameMap() {
        return languageNameMap;
    }
}

