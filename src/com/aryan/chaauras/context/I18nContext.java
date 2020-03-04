package com.aryan.chaauras.context;

import org.springframework.util.StringUtils;

import java.util.Locale;
/**
 * @author tushar
 *
 */

/**
 * I18n locale context holder class
 */
public class I18nContext {

    private String lang;

    public I18nContext(String lang) {
        super();
        this.lang = lang;
    }

    public String getLang() {
        return lang;
    }

    public void setLang(String lang) {
        this.lang = lang;
    }

    /**
     * return locale String. Can be String having lang, country and variant
     *
     * @return
     */
    public String getLocaleString() {
        return lang;
    }

    public Locale getLocale() {
        Locale locale = StringUtils.parseLocaleString(getLocaleString());
        return locale;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null) return false;

        if (!(o instanceof I18nContext))
            return false;

        I18nContext that = (I18nContext) o;

        if (lang != null ? !lang.equals(that.lang) : that.lang != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return lang != null ? lang.hashCode() : 0;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("I18nContext{");
        sb.append("lang='").append(lang).append('\'');
        sb.append('}');
        return sb.toString();
    }
}
