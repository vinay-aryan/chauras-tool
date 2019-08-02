package com.aryan.chaauras.utils;

import java.io.File;
import java.util.List;
import java.util.Properties;

import javax.mail.BodyPart;
import javax.mail.MessagingException;
import javax.mail.Multipart;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;
import javax.mail.internet.MimeMultipart;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.MailParseException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.util.CollectionUtils;

public class EmailSender {
    private static final Logger logger = LoggerFactory.getLogger(EmailSender.class.getCanonicalName());

    private JavaMailSender mailSender;

    static {
    	javax.net.ssl.HttpsURLConnection.setDefaultHostnameVerifier(new javax.net.ssl.HostnameVerifier() {

    		public boolean verify(String hostname, javax.net.ssl.SSLSession sslSession) {
    			return true;
    		}
    	});
    }
    
    public void setMailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendEmail(String from, String to,String subject, String messageBody){

//        SimpleMailMessage message = new SimpleMailMessage();
//
//        message.setTo(to);
//        message.setSubject(subject);
//        message.setText(messageBody);
    	
    	MimeMessage  message = mailSender.createMimeMessage();
    	try{

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(messageBody);
    	}catch (MessagingException e) {
            throw new MailParseException(e);
        }
        //sending the message
        mailSender.send(message);

    }

    public void sendEmail(String from, String to,String subject, String messageBody,String fileAttachment){

        MimeMessage  message = mailSender.createMimeMessage();

        try{

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(messageBody);

            FileSystemResource file = new FileSystemResource(fileAttachment);
            helper.addAttachment(file.getFilename(), file);

        }catch (MessagingException e) {
            throw new MailParseException(e);
        }

        mailSender.send(message);
    }

    public void sendEmail(String from, String to,String subject, String messageBody,List<String> attachments){

        MimeMessage  message = mailSender.createMimeMessage();

        try{

            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(messageBody);

            for (int i = 0; i < attachments.size(); i++) {
                String fileAttachment =  attachments.get(i);
                FileSystemResource file = new FileSystemResource(fileAttachment);
                helper.addAttachment(file.getFilename(), file);
            }

        }catch (MessagingException e) {
            throw new MailParseException(e);
        }
        mailSender.send(message);
    }


//    public void sendEmail(String from, String to,
//                          String cc, String bcc,
//                          String subject, String body, String htmlbody,
//                          String fileName, String data) throws Exception {
//
//        // create some properties and get the default Session
//        Properties props = System.getProperties();
//
//        // For some reason, adding props to the system properties did not work
//        // for me unless I cloned it.  Maybe it is a security constraint thing
//        // because I was calling this method from a jsp page (i.e. a
//        // non-default class loader)?
//        Properties cloned = (Properties) props.clone();
//        cloned.put("mail.transport.protocol", "smtp");
//        cloned.put("mail.smtp.host", getMailServer());
//        javax.mail.Session session = javax.mail.Session.getInstance(cloned, null);
//
//        // construct the message
//        Message msg = new MimeMessage(session);
//        msg.setFrom(new InternetAddress(from));
//        msg.setSentDate(new java.util.Date());
//        msg.setRecipients(Message.RecipientType.TO,
//                InternetAddress.parse(to, false));
//        if (!Utils.isEmpty(cc))
//            msg.setRecipients(Message.RecipientType.CC,
//                    InternetAddress.parse(cc, false));
//        if (!Utils.isEmpty(bcc))
//            msg.setRecipients(Message.RecipientType.BCC,
//                    InternetAddress.parse(bcc, false));
//
//        msg.setSubject(subject);
//
//        MimeMultipart mp = new MimeMultipart();
//        BodyPart tp = new MimeBodyPart();
//        tp.setText(body);
//        mp.addBodyPart(tp);
//        tp = new MimeBodyPart();
//        tp.setContent(htmlbody, "text/html");
//        mp.addBodyPart(tp);
//        mp.setSubType("alternative");
//        msg.setContent(mp);
//
//        // Part two is attachment
//        MimeBodyPart messageBodyPart = new MimeBodyPart();
//        javax.activation.DataSource source = new BLOBResource(fileName, data.getBytes("UTF-8"));
//        messageBodyPart.setDataHandler(new DataHandler(source));
//        messageBodyPart.setFileName(fileName);
//        mp.addBodyPart(messageBodyPart);
//
//        // send the message
//        Transport.send(msg);
//    }
    
    public boolean sendGmail(String from, List<String> to, List<String> cc, List<String> bcc, String subject, String body, final String userName, final String password,List<String>fileNames,List<byte[]> filesdata,List<String> attachFilesFormats) {
    	try {
    		Properties properties = new Properties();
    		properties.setProperty("mail.smtp.host", "smtp.gmail.com");
    		properties.setProperty("mail.smtp.socketFactory.port", "587");
    		properties.setProperty("mail.smtp.socketFactory.class", "javax.net.SocketFactory");
    		properties.setProperty("mail.smtp.auth", "true");
    		properties.setProperty("mail.smtp.port", "587");
    		properties.setProperty("mail.smtp.ssl.enable", "false");
    		properties.setProperty("mail.smtp.starttls.enable", "true");
    		properties.setProperty("mail.smtp.ssl.trust", "smtp.gmail.com");
    		
    		Session	session = Session.getDefaultInstance(properties, new javax.mail.Authenticator() {

    				protected PasswordAuthentication getPasswordAuthentication() {
    					return new PasswordAuthentication(userName, password);
    				}

    			});
    		
    		MimeMessage message = new MimeMessage(session);
    		message.setFrom(new InternetAddress(from));
    		if(to != null) {
    			for(String s : to) {
    				message.addRecipient(RecipientType.TO, new InternetAddress(s));
    			}
    		}
    		if(cc != null) {
    			for(String s : cc) {
    				message.addRecipient(RecipientType.CC, new InternetAddress(s));
    			}
    		}
    		if(bcc != null) {
    			for(String s : bcc) {
    				message.addRecipient(RecipientType.BCC, new InternetAddress(s));
    			}
    		}
    		message.setSubject(subject, "utf-8");
            
    		BodyPart bodyPart = new MimeBodyPart();
    		bodyPart.setContent(body, "text/html");
    		
    		Multipart mp = new MimeMultipart();
    		mp.addBodyPart(bodyPart);
    		if(!CollectionUtils.isEmpty(fileNames)){
    			for(int index = 0; index<fileNames.size(); index ++){

    				String fileName = fileNames.get(index);
    				byte[] data = filesdata.get(index);
    				String attachFileFormat = attachFilesFormats.get(index);

    				MimeBodyPart attachPart = new MimeBodyPart();
    				attachPart.setContent(data,attachFileFormat);
    				attachPart.setFileName(new File(fileName).getName());

    				mp.addBodyPart(attachPart);
    			}
    		}
    		message.setContent(mp);

    		Transport.send(message);
    		logger.debug("sent message from:" + from + " to:" + to + " cc:" + cc + " bcc:" + bcc + " subject:" + subject);
    		return true;
    	}
    	catch (Exception e) {
    		logger.error(e.getMessage(), e);
    	}
    	return false;
    }
}
