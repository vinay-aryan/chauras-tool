package com.aryan.chaauras.utils;


import java.math.BigInteger;
import java.security.MessageDigest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class Utils {

    private static final Logger       logger         = LoggerFactory.getLogger(Utils.class.getCanonicalName());

    public static String md5(String input) {
        String md5 = null;
        if (null == input) return null;
        try {
            //Create MessageDigest object for MD5
            MessageDigest digest = MessageDigest.getInstance("MD5");
            //Update input string in message digest
            digest.update(input.getBytes(), 0, input.length());
            //Converts message digest value in base 16 (hex) 
            md5 = new BigInteger(1, digest.digest()).toString(16);
            while (md5.length() < 32) { //40 for SHA-1
                md5 = "0" + md5;
            }
        } catch (Exception e) {
        }
        return md5;
    }
 
}
