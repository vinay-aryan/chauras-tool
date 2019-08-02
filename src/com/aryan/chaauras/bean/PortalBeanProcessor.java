package com.aryan.chaauras.bean;

import java.lang.reflect.Field;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

@Component
public class PortalBeanProcessor implements BeanPostProcessor {
    private static final Logger logger = LoggerFactory.getLogger(PortalBeanProcessor.class);

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        setBeanInstanceField(bean);        
        return bean;
    }

//    private boolean isController(Class klass) {
//        Class superKlass = klass.getSuperclass();
//        if (superKlass != null) {
//            if (superKlass.equals(BaseController.class)) {
//                return true;
//            }
//            return isController(superKlass);
//        }
//        return false;
//    }

    private void setBeanInstanceField(Object bean) {

        // set bean instance field to the bean instance itself (this way singleton bean can
        // be accessed using getInstance() method)
        try {
            Field instanceField = bean.getClass().getField("instance");
            instanceField.set(null, bean);
        } catch (Exception ignore) {

        }
    }
}
