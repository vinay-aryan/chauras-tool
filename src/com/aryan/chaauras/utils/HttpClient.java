package com.aryan.chaauras.utils;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.DataOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.zip.GZIPInputStream;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.StatusLine;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.InputStreamEntity;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.HttpConnectionParams;
import org.apache.http.params.HttpParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by IntelliJ IDEA. User: bhuvangupta Date: 10/10/12
 */
public class HttpClient {

    private static final Logger logger        = LoggerFactory.getLogger(HttpClient.class.getCanonicalName());
    private static final int CONNECTION_TIMEOUT_MILLIS = 10000;
    private static final int SOCKET_TIMEOUT_MILLIS = 10000;

    // Create a trust manager that does not validate certificate chains
    static TrustManager[]       trustAllCerts = new TrustManager[]{ new X509TrustManager() {

                                                  public java.security.cert.X509Certificate[] getAcceptedIssuers() {
                                                      return null;
                                                  }

                                                  public void checkClientTrusted(java.security.cert.X509Certificate[] certs, String authType) {
                                                  }

                                                  public void checkServerTrusted(java.security.cert.X509Certificate[] certs, String authType) {
                                                  }
                                              } };

    public static HttpURLConnection getHttpConnection(String destinationURL, String username, String password, boolean ssl, String requestMethod, int timeoutMS) throws Exception {
        HttpURLConnection httpConnection = null;
        URL testUrl = new URL(destinationURL);
        httpConnection = (HttpURLConnection) testUrl.openConnection();

        if(ssl) {
            SSLContext sc = SSLContext.getInstance("SSLv3");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            SSLSocketFactory sslsocketfactory = sc.getSocketFactory();
            ((HttpsURLConnection) httpConnection).setSSLSocketFactory(sslsocketfactory);
            ((HttpsURLConnection) httpConnection).setHostnameVerifier(hostnameVerifier);
        }
        httpConnection.setRequestMethod(requestMethod);
        httpConnection.setInstanceFollowRedirects(false);
        httpConnection.setDoInput(true);
        httpConnection.setDoOutput(true);
        httpConnection.setConnectTimeout(timeoutMS);

        logger.debug("Created HTTP Connection with : " + destinationURL);

        // add basic auth header if provided.
        if(username != null && !username.isEmpty()) {
            String authString = username + ":" + password;
            String encoding = new sun.misc.BASE64Encoder().encode(authString.getBytes());
            encoding = encoding.replaceAll("\\n", "");
            httpConnection.setRequestProperty("Authorization", "Basic " + encoding);
        }
        return httpConnection;
    }

    private static String getResponse(HttpURLConnection httpConnection) throws Exception {
        int responseCode = httpConnection.getResponseCode();
        logger.debug("Resp Code:" + responseCode);
        logger.debug("Resp Message:" + httpConnection.getResponseMessage());

        if(responseCode >= 400) {
            InputStream errorStream = httpConnection.getErrorStream();
            String errorMessage = IOUtil.readData(errorStream, true);

            throw new RuntimeException("Error getting response data. " + responseCode + "-" + httpConnection.getResponseMessage() + ". Error : " + errorMessage);
        }

        return IOUtil.readData(httpConnection.getInputStream(), true);
    }


    public static String postData(String destinationURL, String username, String password, boolean ssl, String contentType, byte[] dataXml, int timeoutMS) throws Exception {
        long sTime = System.currentTimeMillis();

        try {
            HttpURLConnection httpConnection = getHttpConnection(destinationURL, username, password, ssl, "POST", timeoutMS);
            httpConnection.setRequestProperty("Content-Type", contentType);

            // httpsConnection.connect();
            long eTime = System.currentTimeMillis();
            logger.debug("HTTP Request Time :  " + (eTime - sTime));
            DataOutputStream output = new DataOutputStream(httpConnection.getOutputStream());
            output.write(dataXml);
            output.flush();

            return getResponse(httpConnection);
        }
        catch (Throwable thr) {
            throw new RuntimeException("Error posting data. Error : " + thr.getMessage(), thr);
        }
    }

    
    public static void postData(String url, String data) {
        HttpPost post = null;
        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            post = new HttpPost(url);
            post.setHeader("Content-Type", "text/xml");
            ByteArrayInputStream bis = new ByteArrayInputStream(data.getBytes());
            HttpEntity entity = new InputStreamEntity(bis, bis.available());
            post.setEntity(entity);
            HttpResponse response = client.execute(post);
            logger.info("posted to " + url + " , status = " + response.getStatusLine().toString());
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        finally {
            if(post != null)
                post.releaseConnection();
        }
    }
    
    public static String doPostData(String url, String data) throws Exception{
        HttpPost post = null;
        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            post = new HttpPost(url);
            post.setHeader("Content-Type", "text/xml");
            ByteArrayInputStream bis = new ByteArrayInputStream(data.getBytes());
            HttpEntity entity = new InputStreamEntity(bis, bis.available());
            post.setEntity(entity);
            HttpResponse response = client.execute(post);
            logger.info("posted to " + url + " , status = " + response.getStatusLine().toString() );
            if ( response.getStatusLine().getStatusCode() != -1 ) {
                return response.getStatusLine().getReasonPhrase();
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
            throw e;
        }
        finally {
            if(post != null)
                post.releaseConnection();
        }
        return "";
    }
    
    public static String postData(String url, String data, String charset) {
        HttpPost post = null;
        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            HttpParams httpParams = client.getParams();
            HttpConnectionParams.setConnectionTimeout(httpParams, CONNECTION_TIMEOUT_MILLIS);
            HttpConnectionParams.setSoTimeout(httpParams, SOCKET_TIMEOUT_MILLIS);
            post = new HttpPost(url);
            post.setHeader("Content-Type", "application/json");
            StringEntity entity = new StringEntity(data, charset);
            entity.setContentType("application/json");
            post.setEntity(entity);
            HttpResponse response = client.execute(post);
            logger.info("posted to " + url + " , status = " + response.getStatusLine().toString());
            StatusLine statusLine = response.getStatusLine();
            if (statusLine.getStatusCode() == 200) {
                InputStream is = response.getEntity().getContent();
                String content = new String();
                BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
                String line = null;
                while ((line = br.readLine()) != null) {
                    content += line;
                    content += '\n';
                }
                return content;
            } else {
                logger.error("Error response : " + statusLine);
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        finally {
            if(post != null)
                post.releaseConnection();
        }
        return null;
    }

    public static String postData(String url, Map<String, String> postValues) {
        HttpPost post = null;

        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            HttpParams httpParams = client.getParams();
            // set the connection timeout value to 2 seconds (2000 milliseconds)
            HttpConnectionParams.setConnectionTimeout(httpParams, CONNECTION_TIMEOUT_MILLIS);
            HttpConnectionParams.setSoTimeout(httpParams, SOCKET_TIMEOUT_MILLIS);

            post = new HttpPost(url);
            //post.setHeader("Content-Type", "text/xml");
            List<NameValuePair> nvps = new ArrayList<NameValuePair>();
            Iterator<String> keys = postValues.keySet().iterator();
            while (keys.hasNext()) {
                String key = keys.next();
                String value = postValues.get(key);
                nvps.add(new BasicNameValuePair(key, value));
            }

            post.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));

            HttpResponse response = client.execute(post);
            logger.debug("posted to " + url + " , status = " + response.getStatusLine().toString());
            StatusLine statusLine = response.getStatusLine();
            if (statusLine.getStatusCode() == 200) {
                InputStream is = response.getEntity().getContent();
                String content = new String();
                BufferedReader br = new BufferedReader(new InputStreamReader(is, "UTF-8"));
                String line = null;
                while ((line = br.readLine()) != null) {
                    content += line;
                    content += '\n';
                }
                return content;
            } else {
                logger.error("Error response : " + statusLine);
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        } finally {
            if (post != null)
                post.releaseConnection();
        }
        return null;
    }

    public static String getData(String destinationURL, String username, String password, boolean ssl, int timeoutMS) throws Exception {
        long sTime = System.currentTimeMillis();
        try {
            HttpURLConnection httpConnection = getHttpConnection(destinationURL, username, password, ssl, "GET", timeoutMS);
            // httpsConnection.connect();
            long eTime = System.currentTimeMillis();
            String response = getResponse(httpConnection);
            logger.info("HTTP Request Time :  " + (System.currentTimeMillis() - sTime));
            return response;
        }
        catch (Throwable thr) {
            throw new RuntimeException("Error getting data. Error : " + thr.getMessage(), thr);
        }
    }

    /**
     * User Apache HTTP Library
     * 
     * @param photoUrl
     * @return
     */
    public static String getContent(String photoUrl) {
        HttpGet get = null;
        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            get = new HttpGet(photoUrl);
            HttpResponse response = client.execute(get);
            if(response.getStatusLine().getStatusCode() == 200) {
                InputStream is = response.getEntity().getContent();
                String content = "";
                BufferedReader br = new BufferedReader(new InputStreamReader(is));
                String line = null;
                while((line = br.readLine()) != null) {
                    content += line;
                    content += '\n';
                }
                return content;
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        finally {
            if(get != null) {
                get.releaseConnection();
            }
        }
        return null;
    }
    /**
     * User Apache HTTP Library
     * 
     * @param photoUrl
     * @return
     */
    public static String getContent(String photoUrl, int timeOut) {
        HttpGet get = null;
        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            HttpParams params = client.getParams();
            HttpConnectionParams.setConnectionTimeout(params, timeOut);
            HttpConnectionParams.setSoTimeout(params, timeOut);
            get = new HttpGet(photoUrl);
            HttpResponse response = client.execute(get);
            if(response.getStatusLine().getStatusCode() == 200) {
                InputStream is = response.getEntity().getContent();
                String content = "";
                BufferedReader br = new BufferedReader(new InputStreamReader(is));
                String line = null;
                while((line = br.readLine()) != null) {
                    content += line;
                    content += '\n';
                }
                return content;
            }
            else
            {
                logger.info("Error for request - "+ photoUrl + " status code - " + response.getStatusLine().getStatusCode());
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        finally {
            if(get != null) {
                get.releaseConnection();
            }
        }
        return null;
    }
    
    public static String getContent(String photoUrl, int timeOut, String charset) {
        HttpGet get = null;
        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            HttpParams params = client.getParams();
            HttpConnectionParams.setConnectionTimeout(params, timeOut);
            HttpConnectionParams.setSoTimeout(params, timeOut);
            get = new HttpGet(photoUrl);
            HttpResponse response = client.execute(get);
            if(response.getStatusLine().getStatusCode() == 200) {
                InputStream is = response.getEntity().getContent();
                String content = "";
                BufferedReader br = new BufferedReader(new InputStreamReader(is, charset));
                String line = null;
                while((line = br.readLine()) != null) {
                    content += line;
                    content += '\n';
                }
                return content;
            }
            else
            {
                logger.info("Error for request - "+ photoUrl + " status code - " + response.getStatusLine().getStatusCode());
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        finally {
            if(get != null) {
                get.releaseConnection();
            }
        }
        return null;
    }

    static HostnameVerifier hostnameVerifier = new HostnameVerifier() {

                                                 public boolean verify(String urlHostName, SSLSession session) {
                                                     System.out.println("Warning: URL Host: " + urlHostName + " vs. " + session.getPeerHost());
                                                     return true;
                                                 }
                                             };

    public static String getContent(String url, String charset) {
        HttpPost postRequest = null;
        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            postRequest = new HttpPost(url);
            postRequest.addHeader("charset", charset);

            HttpResponse response = client.execute(postRequest);
            StatusLine statusLine = response.getStatusLine();
            if(statusLine.getStatusCode() == 200) {
                InputStream is = response.getEntity().getContent();
                String content = new String();
                BufferedReader br = new BufferedReader(new InputStreamReader(is, charset));
                String line = null;
                while((line = br.readLine()) != null) {
                    content += line;
                    content += '\n';
                }
                return content;
            }
            else {
                logger.warn("Error response : " + statusLine + ". For : " + url);
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        finally {
            if(postRequest != null) {
                postRequest.releaseConnection();
            }
        }
        return null;
    }

    public static String getContent(String url, int timeout,Map<String,String> headers)
            throws Exception {

        HttpGet get = null;
        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            HttpParams params = client.getParams();
            HttpConnectionParams.setConnectionTimeout(params, timeout);
            HttpConnectionParams.setSoTimeout(params, timeout);
            get = new HttpGet(url);
            if(headers != null && headers.size() > 0)
            {
                Iterator<String> headerItr = headers.keySet().iterator();
                while (headerItr.hasNext()) {
                    String name = headerItr.next();
                    String value = headers.get(name);
                    get.addHeader(name,value);
                }
            }

            HttpResponse response = client.execute(get);
            StatusLine statusLine = response.getStatusLine();
            if(statusLine.getStatusCode() == 200) {
                InputStream is = response.getEntity().getContent();
                String content = "";
                BufferedReader br = new BufferedReader(new InputStreamReader(is,"UTF-8"));
                String line = null;
                while((line = br.readLine()) != null) {
                    content += line;
                    content += '\n';
                }
                return content;
            }
            else {
                logger.error("Error response : " + statusLine + ". For : " + url);
            }
        }
        catch (Exception e) {
            logger.error("Error invoking URL : "+url+". Error : "+e.getMessage(), e);
        }
        finally {
            if(get != null) {
                get.releaseConnection();
            }
        }
        return null;

    }

    public static String getCompressedContent(String url, String charset) {
        HttpPost postRequest = null;
        try {
            org.apache.http.client.HttpClient client = new DefaultHttpClient();
            postRequest = new HttpPost(url);
            postRequest.addHeader("charset", charset);
            // postRequest.addHeader("Content-Encoding", "gzip");
            HttpResponse response = client.execute(postRequest);
            StatusLine statusLine = response.getStatusLine();
            if(statusLine.getStatusCode() == 200) {
                InputStream is = response.getEntity().getContent();
                GZIPInputStream gis = new GZIPInputStream(is);
                String content = new String();
                BufferedReader br = new BufferedReader(new InputStreamReader(gis, charset));
                String line = null;
                while((line = br.readLine()) != null) {
                    content += line;
                    content += '\n';
                }
                return content;
            }
            else {
                logger.warn("Error response : " + statusLine + ". For : " + url);
            }
        }
        catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
        finally {
            if(postRequest != null) {
                postRequest.releaseConnection();
            }
        }
        return null;
    }

   

   

}
