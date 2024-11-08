import fetch from "node-fetch";
import { Service } from "typedi";
import { IAuthService } from "@/domain/interfaces/IAuth";
import { GitHub } from "arctic";
import { AuthResponse } from "@/types";
import { githubConfig } from "@/config/oauth";
import { AppError } from "@/libs/app-error";

@Service()
export class GithubAuthService implements IAuthService {
  private github: GitHub;

  constructor() {
    this.github = new GitHub(
      process.env.AUTH_GITHUB_CLIENT_ID!,
      process.env.AUTH_GITHUB_CLIENT_SECRET!,
      {
        redirectURI: process.env.AUTH_GITHUB_CLIENT_REDIRECT!,
      },
    );
  }

  /**
   * Generates oauth consent screen link
   * @returns Promise<string>
   */
  public async generateAuthorizationURL(): Promise<string> {
    const state = "random-state-value";
    const url = await this.github.createAuthorizationURL(state, {
      scopes: ["user", "user:email"],
    });
    return url.href;
  }

  /**
   * Handles oauth callback
   * @param code
   * @param state
   * @returns Promise<AuthResponse>
   */
  public async handleCallback(
    code: string,
    state: string,
  ): Promise<AuthResponse> {
    if (!code) {
      throw new AppError("Authorization code is required", 401);
    }

    // Exchange code for access token
    const tokens = await this.github.validateAuthorizationCode(code);

    // Fetch the user's profile
    return this.getMyDetails(tokens.accessToken);
  }

  /**
   * Fetches user details
   * @param accessToken
   * @returns Promise<AuthResponse>
   */
  public async getMyDetails(accessToken: string): Promise<AuthResponse> {
    // Fetch the user's profile
    const userResponse = await fetch(githubConfig.FETCH_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData: any = await userResponse.json();

    // Fetch the user's email(s)
    const emailsResponse = await fetch(githubConfig.FETCH_USER_EMAILS_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const emails: any = await emailsResponse.json();

    const user = {
      id: userData.id,
      name: userData.login,
      email: emails[0].email,
      attachment: userData.avatar_url,
    };

    return { user, accessToken: accessToken };
  }
}
