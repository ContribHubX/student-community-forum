import { Container } from 'typedi';
import { Logger } from 'winston';
import { parseAuthToken } from '@/libs/security';
import LocalAuthService from '@/service/auth/local-auth';
import AuthService from '@/service/auth/auth';
import { Request, Response, NextFunction } from 'express';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
export async function attachCurrentUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const Logger: Logger = Container.get('logger');
  const localAuthService: LocalAuthService = Container.get(LocalAuthService);
  const authService: AuthService = Container.get(AuthService);

  try {
    const { provider, accessToken } = parseAuthToken(req.cookies.token);
    let user;

    if (provider === 'LOCAL') {
      user = await localAuthService.getUserDetailsFromToken(accessToken);

      if (!user) {
        //res.status(401).send('Unauthorized');
        return next();
      }
      
      const currentUser = user;
      Reflect.deleteProperty(currentUser, 'password');
      req.currentUser = currentUser.user;
      return next();
    }

    user = await authService.getMyDetails(provider, accessToken);

    if (!user) {
      //res.status(401).send('Unauthorized');
      return next();
    }

    const currentUser = user;
    Reflect.deleteProperty(currentUser, 'password');
    req.currentUser = currentUser.user;
    return next();
  } catch (e) {
    Logger.error('🔥 Error attaching user to req: %o', e);
    next(e);
  }
}
