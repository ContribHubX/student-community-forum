export const githubConfig = {
  FETCH_USER_URL: "https://api.github.com/user",
  FETCH_USER_EMAILS_URL: "https://api.github.com/user/emails",
} as const;

export const googleConfig = {
  FETCH_USER_URL: "https://openidconnect.googleapis.com/v1/userinfo",
} as const;
