import { IAuthService } from "@/domain/interfaces/IAuth";
import { AuthResponse } from "@/types";
import { Google } from "arctic";
import { randomBytes } from "crypto";
import { Service } from "typedi";
import { googleConfig } from "@/config/oauth";
import { AppError } from "@/libs/app-error";

@Service()
class GoogleAuthService implements IAuthService {
  private google: Google;
  private codeVerifier: string;

  constructor() {
    this.codeVerifier = this.generateCodeVerifier();
    this.google = new Google(
      process.env.AUTH_GOOGLE_CLIENT_ID!,
      process.env.AUTH_GOOGLE_CLIENT_SECRET!,
      process.env.AUTH_GOOGLE_REDIRECT!,
    );
  }

  /**
   * Generates oauth consent screen link
   * @returns Promise<string>
   */
  public async generateAuthorizationURL(): Promise<string> {
    const state = "random-state-value";

    // Create Google authorization URL
    const url = await this.google.createAuthorizationURL(
      state,
      this.codeVerifier,
      {
        scopes: ["profile", "email"],
      },
    );

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

    // Exchange the authorization code for tokens
    const tokens = await this.google.validateAuthorizationCode(
      code,
      this.codeVerifier,
    );

    const user = await this.getMyDetails(tokens.accessToken);
    return user;
  }

  /**
   * Fetches user details
   * @param accessToken
   * @returns Promise<AuthResponse>
   */
  public async getMyDetails(accessToken: string): Promise<AuthResponse> {
    // Fetch the user's profile
    const response = await fetch(googleConfig.FETCH_USER_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userData: any = await response.json();

    const user = {
      id: userData.sub,
      name: userData.name,
      email: userData.email,
      attachment: userData.picture,
    };

    return { user, accessToken };
  }

  /**
   * Utility function to verify state
   * @returns
   */
  private generateCodeVerifier(): string {
    const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43;
    return randomBytes(length).toString("base64url");
  }
}

export default GoogleAuthService;
 