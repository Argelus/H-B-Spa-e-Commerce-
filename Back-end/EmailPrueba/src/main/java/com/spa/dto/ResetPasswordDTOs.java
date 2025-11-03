package com.spa.dto;

public class ResetPasswordDTOs {

    // POST /api/auth/password/forgot
    public static class ForgotRequest {
        private String email;
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    // POST /api/auth/password/reset
    public static class ResetRequest {
        private String email;
        private String code;
        private String newPassword;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
