package com.aryan.chaauras.utils;
/*package com.bsb.portal.util;

import java.math.BigInteger;
import java.util.Date;

import org.apache.commons.codec.binary.Base64;

import com.bsb.portal.common.PortalException;
import com.bsb.portal.util.EncryptionUtil;

public class SignatureHandler {
	private static final String secret = new String(new BigInteger("49324a7a596b427762334a3059577841596e4e6949773d3d",16).toByteArray());
	private static final String commonKey = new String(new BigInteger("596e4e696347397964474673613256354d6a41784d673d3d", 16).toByteArray());
	private final static long MILLIS_PER_DAY = 24 * 3600 * 1000;
	
	private static String getSecret() {
		return new String(Base64.decodeBase64(secret.getBytes()));
	}
	
	private static String getCommonKey() {
		return new String(Base64.decodeBase64(commonKey.getBytes()));
	}
	
	public static String getCode() {
		String original = new Date().getTime() + "_" + getSecret();
		String encryptedData = "";
		try {
			encryptedData = EncryptionUtil.getInstance().encrypt(original.getBytes(),getCommonKey());
			encryptedData = Base64.encodeBase64String(encryptedData.getBytes());
			return encryptedData;
		} catch (PortalException e) {
			e.printStackTrace();
		}
		return encryptedData;
	}
	
	public static boolean isValidCode(String encoded) {
		String decoded;
		try {
			byte[] encodedBytes = Base64.decodeBase64(encoded);
			decoded = EncryptionUtil.getInstance().decrypt(encodedBytes, getCommonKey());
			if(decoded.endsWith(getSecret())) {
				String date = decoded.split("_")[0];
				Long time = Long.parseLong(date);
				long diff = System.currentTimeMillis() - time;
				if(diff > MILLIS_PER_DAY)
					return false;
				else
					return true;
			} 
			return false;
		} catch (PortalException e) {
			e.printStackTrace();
			return false;
		}
		
	}
	
	public static void main(String args[]) throws  PortalException {
	/**
	 * For testing
	*/
/*
	String code = getCode();
	System.out.println("The encoded string is " + code);
	System.out.println("the user is " + isValidCode(code));//should return true;
}
}
*/
