import Container from "typedi";
import AuthService from "@/service/auth/auth";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@/libs/app-error";

export default  {
  /**
   * Initiates the Google OAuth login process.
   * Redirects the user to the Google OAuth authorization URL.
   * 
   * @route GET /auth/google
   * @returns {Object} Redirect URL for Google OAuth login
   */
  async generateGoogleAuthURL(req: Request, res: Response)  {   
    const authService: AuthService = Container.get(AuthService);
    const redirectUrl = await authService.loginWithProvider("GOOGLE");    
    res.status(200).json({ url: redirectUrl });
  },

  /**
   * Handles the callback from Google OAuth after the user authenticates.
   * 
   * @route GET /auth/google/callback
   * @param {string} code - The authorization code from Google OAuth.
   * @param {string} state - The state parameter from the OAuth process.
   * @returns {Object} The user's authentication result, including tokens.
   * @throws {500} Authentication failed.
   */
  async googleAuthCallback(req: Request, res: Response, next: NextFunction) {
    const { code, state } = req.query;
    const authService: AuthService = Container.get(AuthService);

    try {
      const result = await authService.handleCallback(
        "GOOGLE",
        code as string,
        state as string,
      );

      // Modify the accessToken to include the provider identifier
      const modifiedAccessToken = `GOOGLE_${result.accessToken}`;

      // Set cookies for user
      res.cookie('token', modifiedAccessToken, {
        maxAge: 3600000, 
        httpOnly: true,
      });

      // Handle the user data and tokens, e.g., store in session, issue JWT, etc.
      res.status(200).json(result);
    } catch (error) {
      console.error("Error during Google OAuth callback:", error);
      next(new AppError("Authentication failed", 500));
    }
  },

  /**
   * Initiates the GitHub OAuth login process.
   * Redirects the user to the GitHub OAuth authorization URL.
   * 
   * @route GET /auth/github
   * @returns {Object} Redirect URL for GitHub OAuth login
   */
  async generateGithubAuthURL(req: Request, res: Response) {
    const authService: AuthService = Container.get(AuthService);
    const redirectUrl = await authService.loginWithProvider("GITHUB");
    res.status(200).json({ url: redirectUrl });
  },

  /**
   * Handles the callback from GitHub OAuth after the user authenticates.
   * 
   * @route GET /auth/github/callback
   * @param {string} code - The authorization code from GitHub OAuth.
   * @param {string} state - The state parameter from the OAuth process.
   * @returns {Object} The user's authentication result, including tokens.
   * @throws {500} Authentication failed.
   */
  async githubAuthCallback(req: Request, res: Response, next: NextFunction) {
    const { code, state } = req.query;
    const authService: AuthService = Container.get(AuthService);

    try {
      const result = await authService.handleCallback(
        "GITHUB",
        code as string,
        state as string,
      );

      // Modify the accessToken to include the provider identifier
      const modifiedAccessToken = `GITHUB_${result.accessToken}`;

      // Set cookies for user 1 hour
      res.cookie('token', modifiedAccessToken, {
        maxAge: 3600000, 
        httpOnly: true,
      });

      // Handle the user data and tokens, e.g., store in session, issue JWT, etc.
      res.status(200).json(result);
    } catch (error) {
      console.error("Error during Github OAuth callback:", error);
      next(new AppError("Authentication failed", 500));
    }
  },

  /**
   * Retrieves the details of the authenticated user.
   * Requires the user to have a valid access token in cookies.
   * 
   * @route GET /auth/me
   * @returns {Object} The authenticated user's details.
   * @throws {401} User must be logged in.
   * @throws {500} Authentication failed or other errors.
   */
  async getMyDetails(req: Request, res: Response, next: NextFunction) {
    const authService: AuthService = Container.get(AuthService);
    const accessToken = req.cookies.token;

    if (!accessToken) {
      res.status(401).json({
        message: "User must login"
      });

      return;
    }

    try {
      const provider = accessToken.split("_")[0];
      const originalToken = accessToken.substring(provider.length + 1);
      const user = await authService.getMyDetails(provider, originalToken);
      res.status(200).json(user);
    } catch (error) {
      console.error("Error during user data retrieval:", error);
      next(new AppError("Authentication failed", 500));
    }
  }
};
