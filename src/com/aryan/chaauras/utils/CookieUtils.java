package com.aryan.chaauras.utils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public final class CookieUtils {
	private static final Logger logger = LoggerFactory.getLogger(CookieUtils.class);

	private CookieUtils() {
		throw new RuntimeException("Should not be instantiated");
	}

	public static void setCookie(String cookieName, String value, boolean setCookieMaxAge, int age, HttpServletResponse response) {
		try {
			// Always try and add the cookie to the response.
			Cookie newCookie = new Cookie(cookieName, value);
			if(setCookieMaxAge){
				newCookie.setMaxAge(age);
			}
			newCookie.setPath("/");
			if (!response.isCommitted())
				response.addCookie(newCookie);
		} catch (Exception e) {
			logger.error("Error setting cookie : {} to value : {}", new Object[]{cookieName, value, e});
		}
	}

	public static Cookie getCookie(HttpServletRequest request, String cookieName) {
		Cookie[] cookies = request.getCookies();
		Cookie cookie = null;
		if (cookies != null) {
			for (int i = 0; i < cookies.length; i++) {
				if (cookies[i].getName().equals(cookieName)) {
					cookie = cookies[i];
					break;
				}
			}
		}
		return cookie;
	}

}
