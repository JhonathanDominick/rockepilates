package com.rockepilates.bff.util;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;

public class CookieUtil {

    public static String getToken(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if ("admin_token".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        return null;
    }
}