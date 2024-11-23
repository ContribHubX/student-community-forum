import { Service, Container } from "typedi";
import { ISocialAuthService } from "@/domain/interfaces/IAuth";
import { SocialAuthProvider } from "@/types";
import GithubAuthService  from "./github-auth";
import GoogleAuthService from "./google-auth";


@Service()
class AuthService {
  private strategies: Record<SocialAuthProvider, ISocialAuthService>;

  constructor() {
    this.strategies = {
      GOOGLE: Container.get(GoogleAuthService),
      GITHUB: Container.get(GithubAuthService)
    };
  }

  /**
   * Login using selected provider
   * 
   * @param provider Provider
   * @returns Promise<string>
   */
  public async loginWithProvider(provider: SocialAuthProvider): Promise<string> {
    const strategy = this.strategies[provider];
    if (!strategy) {
      throw new Error("Unsupported provider");
    }
    return strategy.generateAuthorizationURL();
  }

  /**
   * Handle OAuth callback
   *
   * @param provider
   * @param code
   * @param state
   * @returns
   */
  public async handleCallback(
    provider: SocialAuthProvider,
    code: string,
    state: string,
  ) {
    const strategy = this.strategies[provider];
    if (!strategy) {
      throw new Error("Unsupported provider");
    }
    return strategy.handleCallback(code, state);
  }

  /**
   *
   * @param provider
   * @param accessToken
   * @returns
   */
  public async getMyDetails(provider: SocialAuthProvider, accessToken: string) {
    const strategy = this.strategies[provider];
    if (!strategy) {
      throw new Error("Unsupported provider");
    }
    return strategy.getMyDetails(accessToken);
  }
}

export default AuthService;
