package com.aryan.chaauras.services;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import com.aryan.chaauras.interceptor.AuthorizationInterceptor;
import com.aryan.chaauras.utils.EmailSender;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.ReadPreference;
import com.mongodb.ServerAddress;

/**
 * Server configurations.
 */
@Configuration
@ComponentScan(basePackages = { "com.aryan.chaauras" })
@EnableWebMvc
public class ConfigurationService extends WebMvcConfigurationSupport {

    protected static Logger logger = LoggerFactory.getLogger(ConfigurationService.class);
    
    public static String MONGO_DB_NAME = "chaauras";
    
    @Autowired
    private Environment properties;

    public ConfigurationService() {

    }

    @Bean
    public RequestMappingHandlerMapping requestMappingHandlerMapping() {
        RequestMappingHandlerMapping handlerMapping = super.requestMappingHandlerMapping();
        handlerMapping.setAlwaysUseFullPath(true);
        return handlerMapping;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        super.addInterceptors(registry);
        String[] includes = new String[]{ "/**" };
        String[] excludes = new String[]{ "/resources/*", "/common/*", "/users/unauthorized*", "/changePassword*", "/image/*", "/toolLogin", "/toolLogin/*", "/profile*", "/getUserInfo*", "/updateEmail*", "/star/.*" };

        registry.addInterceptor(new AuthorizationInterceptor(includes, excludes, false));
    }

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        List<HttpMessageConverter<?>> converters = restTemplate.getMessageConverters();
        StringHttpMessageConverter stringHttpMessageConverter = new StringHttpMessageConverter(Charset.forName("UTF-8"));
        Iterator itr = converters.iterator();
        int i = 0;
        int pos = 0;
        while(itr.hasNext()) {
            Object obj = itr.next();
            if(obj instanceof StringHttpMessageConverter) {
                itr.remove();
                pos = i;
                break;
            }
            i++;
        }
        converters.add(pos, stringHttpMessageConverter);
        return restTemplate;
    }

    @Bean
    public EmailSender emailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername("portal-bot@bsb.in");
        mailSender.setPassword("p0rtal123");
        Properties props = new Properties();
        props.put("mail.smtp.auth", true);
        props.put("mail.smtp.starttls.enable", true);
        props.put("mail.smtp.debug", true);
        mailSender.setJavaMailProperties(props);
        EmailSender emailSender = new EmailSender();
        emailSender.setMailSender(mailSender);
        return emailSender;
    }
    
    @Bean(name="mongoTemplate")
    @Primary
    public MongoTemplate getIPortalMongoTemplate() {
        MongoDBConfig config = new MongoDBConfig();
        config.setMongodbHost(properties.getProperty("mongodb.primary.host", "127.0.0.1"));
        config.setMongodbPort(properties.getProperty("mongodb.primary.port", Integer.class, 27017));
        config.setMongodbHostSlave(properties.getProperty("mongodb.secondary.host", String.class, null));
        config.setMongodbPortSlave(properties.getProperty("mongodb.secondary.port", Integer.class, 27017));
        config.setMongodbHostArbiter(properties.getProperty("mongodb.arbiter.host", String.class, null));
        config.setMongodbPortArbiter(properties.getProperty("mongodb.arbiter.port", Integer.class, 27017));
        config.setReadPrimary(properties.getProperty("mongodb.isReadPrimary", Boolean.class, true));
        config.setMongoDBName(properties.getProperty("mongodb.db.name", MONGO_DB_NAME));
        config.setMongoDBPrefix(properties.getProperty("mongodb.prefix", ""));
        config.setMongodbLoggingEnabled(properties.getProperty("mongodb.loggingenabled", Boolean.class, false));
        config.setMongodbThreadsAllowedToBlock(properties.getProperty("mongodb.threads.allowed.per.host", Integer.class, 50));
        config.setMongodbConnectionsPerHost(properties.getProperty("mongodb.connections.per.host", Integer.class, 500));

        List<ServerAddress> seeds = new ArrayList<>();
        ServerAddress primary = new ServerAddress(config.getMongodbHost(), config.getMongodbPort());
        seeds.add(primary);
        if (config.getMongodbHostSlave() != null) {
            ServerAddress slave = new ServerAddress(config.getMongodbHostSlave(), config.getMongodbPortSlave());
            seeds.add(slave);
        }
        if (config.getMongodbHostArbiter() != null) {
            ServerAddress arbiter = new ServerAddress(config.getMongodbHostArbiter(), config.getMongodbPortArbiter());
            seeds.add(arbiter);
        }

        MongoClientOptions.Builder builder = MongoClientOptions.builder();

        int mongodbThreadsAllowedToBlock = config.getMongodbThreadsAllowedToBlock();
        if (mongodbThreadsAllowedToBlock <= 0) {
            mongodbThreadsAllowedToBlock = 50;
        }
        int mongodbConnectionsPerHost = config.getMongodbConnectionsPerHost();
        if (mongodbConnectionsPerHost <= 0) {
            mongodbConnectionsPerHost = 100;
        }
        builder.threadsAllowedToBlockForConnectionMultiplier(mongodbThreadsAllowedToBlock).connectionsPerHost(mongodbConnectionsPerHost);
        if (config.getMongodbHostSlave() != null && !config.isReadPrimary()) {
            builder.readPreference(ReadPreference.secondaryPreferred());
        }

        return new MongoTemplate(new MongoClient(seeds, builder.build()), MONGO_DB_NAME);
    }
    	

    class MongoDBConfig {

        private String mongodbHost;

        private int mongodbPort;

        private String mongodbHostSlave;

        private int mongodbPortSlave;

        private String mongodbHostArbiter;

        private int mongodbPortArbiter;

        private String mongoDBName;

        private String mongoDBPrefix;

        private Boolean mongodbLoggingEnabled;

        private boolean readPrimary;

        private int mongodbThreadsAllowedToBlock;

        private int mongodbConnectionsPerHost;

        public String getMongodbHost() {
            return mongodbHost;
        }

        public void setMongodbHost(String mongodbHost) {
            this.mongodbHost = mongodbHost;
        }

        public int getMongodbPort() {
            return mongodbPort;
        }

        public void setMongodbPort(int mongodbPort) {
            this.mongodbPort = mongodbPort;
        }

        public String getMongodbHostSlave() {
            return mongodbHostSlave;
        }

        public void setMongodbHostSlave(String mongodbHostSlave) {
            this.mongodbHostSlave = mongodbHostSlave;
        }

        public int getMongodbPortSlave() {
            return mongodbPortSlave;
        }

        public void setMongodbPortSlave(int mongodbPortSlave) {
            this.mongodbPortSlave = mongodbPortSlave;
        }

        public String getMongodbHostArbiter() {
            return mongodbHostArbiter;
        }

        public void setMongodbHostArbiter(String mongodbHostArbiter) {
            this.mongodbHostArbiter = mongodbHostArbiter;
        }

        public int getMongodbPortArbiter() {
            return mongodbPortArbiter;
        }

        public void setMongodbPortArbiter(int mongodbPortArbiter) {
            this.mongodbPortArbiter = mongodbPortArbiter;
        }

        public String getMongoDBName() {
            return mongoDBName;
        }

        public void setMongoDBName(String mongoDBName) {
            this.mongoDBName = mongoDBName;
        }

        public String getMongoDBPrefix() {
            return mongoDBPrefix;
        }

        public void setMongoDBPrefix(String mongoDBPrefix) {
            this.mongoDBPrefix = mongoDBPrefix;
        }

        public Boolean getMongodbLoggingEnabled() {
            return mongodbLoggingEnabled;
        }

        public void setMongodbLoggingEnabled(Boolean mongodbLoggingEnabled) {
            this.mongodbLoggingEnabled = mongodbLoggingEnabled;
        }

        public boolean isReadPrimary() {
            return readPrimary;
        }

        public void setReadPrimary(boolean readPrimary) {
            this.readPrimary = readPrimary;
        }

        public int getMongodbThreadsAllowedToBlock() {
            return mongodbThreadsAllowedToBlock;
        }

        public void setMongodbThreadsAllowedToBlock(int mongodbThreadsAllowedToBlock) {
            this.mongodbThreadsAllowedToBlock = mongodbThreadsAllowedToBlock;
        }

        public int getMongodbConnectionsPerHost() {
            return mongodbConnectionsPerHost;
        }

        public void setMongodbConnectionsPerHost(int mongodbConnectionsPerHost) {
            this.mongodbConnectionsPerHost = mongodbConnectionsPerHost;
        }
    }
}