package com.rockepilates.bff.util;

public class CookieSecurityUtil {

    private CookieSecurityUtil() {
    }

    public static boolean isSecureCookieEnabled() {
        return Boolean.parseBoolean(
                System.getenv().getOrDefault("APP_COOKIE_SECURE", "false")
        );
    }
}