package com.aryan.chaauras.utils;


import org.apache.log4j.Logger;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.web.context.ContextLoader;

/**
 * Created by IntelliJ IDEA.
 * User: Vinay.kumar
 * Date: 9/17/18
 * Time: 4:16 PM
 * To change this template use File | Settings | File and Code Templates.
 */

public class SpringUtils {

    private static final Logger logger = Logger.getLogger(SpringUtils.class);
    private static final String CONFIG = "AppContext.xml";
    private static ApplicationContext context;

    /**
     * <p>
     * Checks if the context has been initialized already
     * </p>
     *
     * @return is context initialized
     */
    public static synchronized boolean isContextInitialized() {
        return context != null;
    }

    /**
     * <p>
     * Returns the application context. If the application context is not
     * available, returns it either from the ContextLoader or creates a new one
     * </p>
     *
     * @return the application context
     */
    public static ApplicationContext getContext() {
        if (context == null) {
            synchronized (SpringUtils.class) {
                if (context == null) {
                    context = ContextLoader.getCurrentWebApplicationContext();
                }
                if (context == null) {
                    logger.info("loading context from xml");
                    context = new ClassPathXmlApplicationContext(CONFIG);
                }
            }
        }
        logger.debug("<--- application context is -->" + context);
        return context;
    }

    /**
     * <p>
     * Sets the application context
     * </p>
     *
     * @param appContext the application context to set
     */
    public static synchronized void setContext(ApplicationContext appContext) {
        context = appContext;
    }

    /**
     * Initialize the spring context
     */
    public static void init() {
        logger.debug("Initializing the spring context");
        getContext();
    }

    /**
     * <p>
     * Checks if the given bean name is present in the context
     * </p>
     *
     * @param beanName the name of the bean to check for
     * @return true if present
     */
    public static boolean isBeanPresent(String beanName) {
        return getContext().containsBean(beanName);
    }

    /**
     * <p>
     * Gets the bean from the spring context
     * </p>
     *
     * @param beanName the name of the bean
     * @return
     */
    public static Object getBean(String beanName) {
        logger.debug("Getting the bean - [" + beanName + "] from the spring context");
        Object bean = null;
        try {
            bean = getContext().getAutowireCapableBeanFactory().getBean(beanName);
        } catch (BeansException e) {
            logger.fatal("Unable to get the bean - [" + beanName + "]");
            System.out.println("Unable to get the bean - [" + beanName + "]");
        }
        return bean;
    }

    /**
     * <p>
     * Gets the bean from the spring context
     * </p>
     *
     * @param beanName the name of the bean
     * @return
     */
    public static <T> T getBean(String beanName, Class<T> requiredType) {
        logger.debug("Getting the bean - [" + beanName + "] of type -[" + requiredType
                + "] from the spring context");
        T bean = null;
        try {
            bean = (T) getContext().getBean(beanName, requiredType);
        } catch (BeansException e) {
            logger.fatal("Unable to get the bean - [" + beanName + "]");
        }
        return bean;
    }

    /**
     * <p>
     * Gets the bean from the spring context
     * </p>
     *
     * @param bean the bean class
     * @param args the arguments needed for the constructor
     * @return
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(Class<T> bean, Object[] args) {
        return (T) getBean(bean.getName(), args);
    }

    /**
     * <p>
     * Gets the bean from the spring context passing on the args
     * </p>
     *
     * @param beanName the name of the bean
     * @param args     the arguments to construct the bean
     * @return
     */
    public static Object getBean(String beanName, Object[] args) {
        logger.debug("Getting the bean - [" + beanName + "] with the args [" + args
                + "] from the spring context");
        Object bean = null;
        try {
            bean = getContext().getBean(beanName, args);
        } catch (BeansException e) {
            logger.fatal("Unable to get the bean - [" + beanName + "]");
        }
        return bean;
    }

    public synchronized static void cleanup() {
        context = null;
    }
}

