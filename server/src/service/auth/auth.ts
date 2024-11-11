import { Service, Container } from "typedi";
import { IAuthService } from "@/domain/interfaces/IAuth";
import { GithubAuthService } from "./github-auth";
import GoogleAuthService from "./google-auth";
import { AuthProvider } from "@/types";

@Service()
class AuthService {
  private strategies: Record<AuthProvider, IAuthService>;

  constructor() {
    this.strategies = {
      GOOGLE: Container.get(GoogleAuthService),
      GITHUB: Container.get(GithubAuthService),
    };
  }

  /**
   * Login using selected provider
   * @param provider Provider
   * @returns Promise<string>
   */
  public async loginWithProvider(provider: AuthProvider): Promise<string> {
    const strategy = this.strategies[provider];
    if (!strategy) {
      throw new Error("Unsupported provider");
    }
    return strategy.generateAuthorizationURL();
  }

  /**
   *
   * @param provider
   * @param code
   * @param state
   * @returns
   */
  public async handleCallback(
    provider: AuthProvider,
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
  public async getMyDetails(provider: AuthProvider, accessToken: string) {
    const strategy = this.strategies[provider];
    if (!strategy) {
      throw new Error("Unsupported provider");
    }
    return strategy.getMyDetails(accessToken);
  }
}

export default AuthService;
