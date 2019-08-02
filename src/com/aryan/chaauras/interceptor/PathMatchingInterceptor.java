package com.aryan.chaauras.interceptor;

import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.util.UrlPathHelper;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public abstract class PathMatchingInterceptor implements HandlerInterceptor {

    private PathMatcher pathMatcher = new AntPathMatcher();

    private UrlPathHelper urlPathHelper = new UrlPathHelper();

    private String[] includes;

    private String[] excludes;

    private boolean includesOverwriteExcludes = false;

    public PathMatchingInterceptor(String[] includes, String[] excludes, boolean includesOverwriteExcludes) {
        this.includes = includes;
        this.excludes = excludes;
        this.includesOverwriteExcludes = includesOverwriteExcludes;
    }

    public void setPathMatcher(PathMatcher pathMatcher) {
        this.pathMatcher = pathMatcher;
    }

    public final boolean preHandle(HttpServletRequest request,
                                   HttpServletResponse response, Object handler) throws Exception {

        String lookupPath = urlPathHelper.getLookupPathForRequest(request);
        if (include(lookupPath)) {
            return doPreHandle(request, response, handler);
        }
        return true;
    }

    protected boolean doPreHandle(HttpServletRequest request,
                                  HttpServletResponse response, Object handler) throws Exception {
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

    }

    private boolean include(String path) {
        if (includesOverwriteExcludes) {
            return !anyMatch(excludes, path) || anyMatch(includes, path);
        }
        return anyMatch(includes, path) && !anyMatch(excludes, path);
    }

    protected boolean anyMatch(String[] patterns, String path) {
        if (patterns == null) {
            return true;
        }
        for (int i = 0; i < patterns.length; i++) {
            if (pathMatcher.match(patterns[i], path)) {
                return true;
            }
        }
        return false;
    }

}
