package com.aryan.chaauras.utils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.util.Map;
import java.util.Map.Entry;
import java.util.zip.GZIPOutputStream;

/**
 * User: bhuvangupta Date: 12/10/12
 */
public class IOUtil {

    public static String readData(InputStream inputstream, boolean closeStream) throws IOException {
        try {
            InputStreamReader inputstreamreader = new InputStreamReader(inputstream, "UTF-8");
            BufferedReader bufferedreader = new BufferedReader(inputstreamreader);
            StringBuilder strBuff = new StringBuilder();
            String responseStr = null;
            while((responseStr = bufferedreader.readLine()) != null) {
                strBuff.append(responseStr);
            }

            return strBuff.toString();
        }
        finally {
            if(closeStream) {
                inputstream.close();
            }
        }
    }

    public static boolean isValidImageExtn(String extn) {
        return (extn.endsWith("jpg") || extn.endsWith("jpeg") || extn.endsWith("gif") || extn.endsWith("png"));
    }

    public static void writeToFile(String fileName, Map<String, ? extends Object> map) {
        try {
            FileOutputStream fos = new FileOutputStream(fileName);
            GZIPOutputStream gos = new GZIPOutputStream(fos);
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(gos));
            for(Entry<String, ? extends Object> entry : map.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                String line = key + '\t' + value.toString();
                bw.write(line);
                bw.write('\n');
                // gos.write(line.getBytes("UTF-8"));
                // gos.write('\n');
            }
            gos.finish();
            gos.close();
            fos.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    public static void writeToFile(String fileName, String fileContent) {
        try {
            FileOutputStream fos = new FileOutputStream(fileName);
            GZIPOutputStream gos = new GZIPOutputStream(fos);
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(gos));
            bw.write(fileContent);
            bw.close();
        }
        catch (Exception e) {
            e.printStackTrace();
        }
    }
}
