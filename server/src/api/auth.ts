import Container from "typedi";
import AuthService from "@/service/auth/auth";
import { NextFunction, Request, Response } from "express";
import { AppError } from "@/libs/app-error";
import { parseAuthToken } from "@/libs/security";
import { SocialAuthProvider } from "@/types";
import LocalAuthService from "@/service/auth/local-auth";

export default {
  /**
   * Initiates the OAuth login process.
   * Redirects the user to the OAuth authorization URL.
   *
   * @route GET /auth/url/:provider
   * @returns {Object} Redirect URL for OAuth login
   */
  async generateAuthURL(req: Request, res: Response) {
    const provider = req.params.provider

    const authService: AuthService = Container.get(AuthService);
    const redirectUrl = await authService.loginWithProvider(provider.toUpperCase() as SocialAuthProvider);
    res.status(200).json({ url: redirectUrl });
  },

  /**
   * Handles the callback from Google OAuth after the user authenticates.
   *
   * @route GET /auth/:provider/callback
   * @param {string} code - The authorization code from OAuth.
   * @param {string} state - The state parameter from the OAuth process.
   * @returns {Object} The user's authentication result, including tokens.
   * @throws {500} Authentication failed.
   */
  async authCallback(req: Request, res: Response, next: NextFunction) {
    const { code, state } = req.query;
    let provider = (req.params.provider.toUpperCase()) as SocialAuthProvider;
    const authService: AuthService = Container.get(AuthService);

    try {
      const result = await authService.handleCallback(
        provider,
        code as string,
        state as string,
      );

      // Modify the accessToken to include the provider identifier
      const modifiedAccessToken = `${provider}_${result.accessToken}`;

      // Set cookies for user
      res.cookie("token", modifiedAccessToken, {
        maxAge: 3600000,
        httpOnly: true,
      });

      // Handle the user data and tokens, e.g., store in session, issue JWT, etc.
      res.status(200).json(result);
    } catch (error) {
      console.error("Error during OAuth callback:", error);
      next(new AppError("Authentication failed"));
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
    const localAuthService: LocalAuthService = Container.get(LocalAuthService);
    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({
        message: "User must login",
      });
      return;
    }

    try {
      const { provider, accessToken } = parseAuthToken(token);
      let user;

      if (provider === "LOCAL") {
        user = await localAuthService.getUserDetailsFromToken(accessToken);
        res.status(200).json(user);
        return;
      }

      user = await authService.getMyDetails(provider, accessToken);
      res.status(200).json(user);
    } catch (error) {
      console.error("Error during user data retrieval:", error);
      next(new AppError("Authentication failed"));
    }
  },


  // local register
  async register(req: Request, res: Response, next: NextFunction) {
    const localAuthService: LocalAuthService = Container.get(LocalAuthService);
    const body = req.body;
    const file = req.file;
  
    try {
      if (file) {
        body.attachment = file.path;
      }

      await localAuthService.register(body);
      res.status(201).json({ message: "Registration successful" });
    } catch (error: any) {
      next(new AppError(error));
    }
  },
  
  // local login
  async login(req: Request, res: Response, next: NextFunction) {
    const localAuthService: LocalAuthService = Container.get(LocalAuthService);
    const body = req.body;
  
    try {
      const { user, token } = await localAuthService.login(body);
  
      // Set JWT as a cookie
      res.cookie("token", `LOCAL_${token}`, {
        httpOnly: true,
        maxAge: 3600000, 
      });
  
      res.status(200).json({ user, token });
    } catch (error: any) {
      next(new AppError(error));
    }
  }
  
};
