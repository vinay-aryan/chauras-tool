package com.aryan.chaauras.utils;

/**
 * Utility class to manage and generate the query string part of an URL.<p>
 *
 * <pre>
 *    QueryStringBuilder builder = new QueryStringBuilder("/test.jsp")
 *        .addQueryParameter("english", "hello world")
 *        .addQueryParameter("german", "gruezi");
 *    String query = builder.encode();
 * </pre>
 * returns <code>"/test.jsp?english=hello%20world&german=gruezi"</code>
 *
 * <p><b>Dependendies</b>
 * <ul>
 *     <li>Apache commons-httpclient, 3.1</li>
 * </ul>
 *
 */


import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.StringTokenizer;

/**
 * Created with IntelliJ IDEA.
 * User: dhruva
 * Date: 23/10/13
 * Time: 11:59 PM
 * To change this template use File | Settings | File Templates.
 */
public class QueryStringBuilder {

    /**
     * Default encoding used when no encoding is defined as parameter. The
     * encoding is retrieved via <code>Charset.defaultCharset().name()</code>.
     */
    public final static String DEFAULT_ENCODING = "UTF-8";

    /*
     * The fields are marked as protected to let extending classes define
     * additional functionalities that are proper to their usage.
     */

    protected String base;
    protected String sessionId;
    protected Map<String, QueryPair> parameters = new LinkedHashMap<String, QueryPair>();
    protected boolean override = true;

    /**
     * Creates an empty <code>QueryStringBuilder</code>.
     * <p/>
     * This constructor is equivalent to a call to the three-arguments constructor
     * with a <code>null</code>, <code>null</code> and <code>true</code> arguments.
     *
     * @see #QueryStringBuilder(String, String, boolean)
     */
    public QueryStringBuilder() {
        this(null, null, true);
    }

    /**
     * Creates a <code>QueryStringBuilder</code> from the <code>String</code>
     * representation.
     * <p/>
     * This constructor is equivalent to a call to the three-arguments constructor
     * with a <code>spec</code>, <code>null</code> and <code>true</code> arguments.
     *
     * @param spec the <code>String</code> to parse.
     * @see #QueryStringBuilder(String, String, boolean)
     */
    public QueryStringBuilder(final String spec) {
        this(spec, null, true);
    }

    /**
     * Creates a <code>QueryStringBuilder</code> from the <code>String</code>
     * representation with automatic overriding of the parameters.
     * <p/>
     * This constructor is equivalent to a call to the three-arguments
     * constructor with a <code>spec</code>, <code>DEFAULT_ENCODING</code> and
     * <code>override</code> arguments.
     *
     * @param spec     the <code>String</code> to parse.
     * @param override <code>true</code> if already defined parameters will be
     *                 overridden by newly defined ones.
     * @see #QueryStringBuilder(String, String, boolean)
     */
    public QueryStringBuilder(final String spec, final boolean override) {
        this(spec, DEFAULT_ENCODING, override);
    }

    /**
     * Creates a <code>QueryStringBuilder</code> from the <code>String</code>
     * representation with automatic overriding of the parameters.
     * <p/>
     * The string will be parsed and the query parameters will be decoded and
     * added to the list of parameters.
     *
     * @param spec     the <code>String</code> to parse.
     * @param enc      The name of a supported character encoding
     * @param override <code>true</code> if already defined parameters will be
     *                 overridden by newly defined ones.
     */
    public QueryStringBuilder(final String spec, final String enc, final boolean override) {
        this.override = override;
        if (spec != null) {
            String tmp = spec.trim();
            int pos = spec.indexOf('?');
            if (pos < 0) {
                this.base = tmp;
            } else {
                this.base = tmp.substring(0, pos);
                for (StringTokenizer tokenizer = new StringTokenizer(tmp.substring(pos + 1), "&"); tokenizer.hasMoreTokens(); ) {
                    try {
                        String token = tokenizer.nextToken().trim();
                        int pos2 = token.indexOf('=');
                        addQueryParameter(token.substring(0, pos2),
                                enc == null ?
                                        URLDecoder.decode(token.substring(pos2 + 1), DEFAULT_ENCODING) :
                                        URLDecoder.decode(token.substring(pos2 + 1), enc), true);
                    } catch (UnsupportedEncodingException e) {

                    }
                }
            }
        }
    }

    public static QueryStringBuilder buildFromQueryString(final String queryString) {
        return buildFromQueryString(queryString, DEFAULT_ENCODING, true);
    }

    public static QueryStringBuilder buildFromQueryString(final String queryString, final String enc) {
        return buildFromQueryString(queryString, enc, true);
    }

    public static QueryStringBuilder buildFromQueryString(final String queryString, final String enc, final boolean override) {
        QueryStringBuilder queryStringBuilder = new QueryStringBuilder(null, enc, override);
        for (StringTokenizer tokenizer = new StringTokenizer(queryString, "&"); tokenizer.hasMoreTokens(); ) {
            try {
                String token = tokenizer.nextToken().trim();
                int pos2 = token.indexOf('=');
                queryStringBuilder.addQueryParameter(token.substring(0, pos2),
                        enc == null ?
                                URLDecoder.decode(token.substring(pos2 + 1), DEFAULT_ENCODING) :
                                URLDecoder.decode(token.substring(pos2 + 1), enc), true);
            } catch (UnsupportedEncodingException e) {

            }
        }
        return queryStringBuilder;
    }

    /**
     * Returns the base of the URL.
     */
    public String getBase() {
        return this.base;
    }

    /**
     * Adds a parameter to the list of already defined parameters. Already
     * existing parameters are overridden depending on the how the
     * <code>QueryStringBuilder</code> object was created.
     *
     * @param param the parameter to add.
     * @see #QueryStringBuilder(String, String, boolean)
     * @see #QueryStringBuilder(String, boolean)
     */
    public QueryStringBuilder addQueryParameter(final QueryPair param) {
        if (param != null && (!this.parameters.containsKey(param.getName()) || this.override)) {
            this.parameters.put(param.getName(), param);
        }
        return this;
    }

    /**
     * Adds a parameter to the list of already defined parameters. Already
     * existing parameters are overridden depending on the how the
     * <code>QueryStringBuilder</code> object was created.
     * <p/>
     * <p/>
     * A value is considered as <i>invalid</i> if it is:
     * <ul>
     * <li><code>null</code> values
     * <li>empty values
     * <li>blank values
     * </ul>
     * Parameters with invalid values will <i>not</i> be added.
     *
     * @param name         the name of the parameter
     * @param value        the value of the parameter. The <code>toString</code> method
     *                     will be invoked to retrieve the parameter's <i>real</i> value.
     * @param defaultValue the default value used in case the passed value argument is
     *                     considered as invalid.
     * @param encode
     * @see #addQueryParameter(QueryPair)
     */
    public QueryStringBuilder addQueryParameter(final String name, final Object value, final String defaultValue, final boolean encode) {
        String tmp = value == null || value.toString().trim().length() == 0 ? defaultValue : value.toString().trim();
        return addQueryParameter(new QueryPair(name, tmp, encode));
    }

    /**
     * Invokes {@link #addQueryParameter(String, Object, String, boolean)} with a
     * <code>null</code> defaultValue.
     * <p/>
     * #see {@link #addQueryParameter(String, Object, String, boolean)}
     */
    public QueryStringBuilder addQueryParameter(final String name, final String value, final boolean encode) {
        return addQueryParameter(name, value, null, encode);
    }

    /**
     * Invokes {@link #addQueryParameter(QueryPair)} with a <code>String</code>
     * converted value.
     */
    public QueryStringBuilder addQueryParameter(final String name, final Number value) {
        return addQueryParameter(new QueryPair(name, String.valueOf(value), false));
    }

    /**
     * Invokes {@link #addQueryParameter(QueryPair)} with a <code>String</code>
     * converted value.
     */
    public QueryStringBuilder addQueryParameter(final String name, final int value) {
        return addQueryParameter(new QueryPair(name, String.valueOf(value), false));
    }

    /**
     * Invokes {@link #addQueryParameter(QueryPair)} with a <code>String</code>
     * converted value.
     */
    public QueryStringBuilder addQueryParameter(final String name, final float value) {
        return addQueryParameter(new QueryPair(name, String.valueOf(value), false));
    }

    /**
     * Invokes {@link #addQueryParameter(QueryPair)} with a <code>String</code>
     * converted value.
     */
    public QueryStringBuilder addQueryParameter(final String name, final long value) {
        return addQueryParameter(new QueryPair(name, String.valueOf(value), false));
    }

    /**
     * Invokes {@link #addQueryParameter(QueryPair)} with a <code>String</code>
     * converted value.
     */
    public QueryStringBuilder addQueryParameter(final String name, final boolean value) {
        return addQueryParameter(new QueryPair(name, String.valueOf(value), false));
    }

    /**
     * Returns <code>true</code> if the parameter with the given name has
     * already been defined.
     *
     * @param name the name of the parameter
     */
    public boolean containsParameter(final String name) {
        return this.parameters.containsKey(name);
    }

    /**
     * Add the <code>sessionid</code> to the url.
     *
     * @param sessionid the session id
     */
    public QueryStringBuilder addSessionId(String sessionid) {
        this.sessionId = sessionid;
        return this;
    }


    /**
     * Returns the {@link QueryPair} parameter associated with the given
     * name.
     *
     * @param name the name of the parameter
     */
    public QueryPair getQueryParameter(final String name) {
        return this.parameters.get(name);
    }

    /**
     * Removes the {@link QueryPair} parameter associated with the given
     * name.
     *
     * @param param the name of the parameter
     */
    public QueryPair removeQueryParameter(String param) {
        if (param != null) {
            return this.parameters.remove(param);
        }
        return null;
    }

    /**
     * Invokes {@link #encode(String)} with a <code>DEFAULT_ENCODING</code> encoding.
     *
     * @see java.net.URLEncoder#encode(String)
     */
    public String encode() {
        try {
            return encode(DEFAULT_ENCODING);
        } catch (UnsupportedEncodingException e) {
            // according to Sun, the system should always have the platform
            // default so this exception should never be thrown
        }
        return null;
    }

    /**
     * Returns the encoded URL <code>String</code>.
     *
     * @param enc The name of a supported character encoding
     * @throws UnsupportedEncodingException If the named encoding is not supported
     * @see java.net.URLEncoder#encode(String, String)
     */
    public String encode(final String enc) throws UnsupportedEncodingException {
        return encode(enc, true);
    }

    public String encode(boolean appendQuerySeparator) throws UnsupportedEncodingException {
        return encode(DEFAULT_ENCODING, appendQuerySeparator);
    }

    public String encode(final String enc, boolean appendQuerySeparator) throws UnsupportedEncodingException {
        StringBuffer buffer = new StringBuffer();
        if (this.base != null) {
            buffer.append(this.base);
        }
        if (this.sessionId != null) {
            buffer.append(";jsessionid=" + this.sessionId);
        }
        if (this.parameters.size() > 0) {
            if (appendQuerySeparator && buffer.length() > 0) {
                buffer.append("?");
            }
            for (Iterator<Map.Entry<String, QueryPair>> iter = this.parameters.entrySet().iterator(); iter.hasNext(); ) {
                Map.Entry<String, QueryPair> entry = iter.next();

                String value = entry.getValue().getValue();
                if (value != null && value.trim().length() > 0) {
                    String encoded = value;
                    if (entry.getValue().isEncode()) {
                        encoded = ((enc == null) ? URLEncoder.encode(value, DEFAULT_ENCODING) :
                                URLEncoder.encode(value, enc));
                    }
                    buffer.append(entry.getKey()).append("=").append(encoded);
                    buffer.append("&");
                }
            }
            // remove the last "&", not very elegant but it works
            buffer.deleteCharAt(buffer.length() - 1);
        }
        return buffer.toString();
    }

    public static class QueryPair {
        private String name;
        private String value;
        private boolean encode = true;

        public QueryPair() {
        }

        public QueryPair(String name, String value) {
            this.name = name;
            this.value = value;
        }

        public QueryPair(String name, String value, boolean encode) {
            this.name = name;
            this.value = value;
            this.encode = encode;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getValue() {
            return value;
        }

        public void setValue(String value) {
            this.value = value;
        }

        public boolean isEncode() {
            return encode;
        }

        public void setEncode(boolean encode) {
            this.encode = encode;
        }
    }
}