import { AppError } from "@/libs/app-error";
import { Request, Response, NextFunction } from "express";
import fetch from "node-fetch";
import { INSTROSPECTION_URL } from "@/types/enums";
import Container from "typedi";
import { Logger } from "winston";
import { parseAuthToken } from "@/libs/security";

export async function verifyAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const logger: Logger = Container.get("logger");

  try {
    const token = req.cookies.token;

    if (!token) {
      throw new AppError("Access token missing", 401);
    }

    const { provider, accessToken } = parseAuthToken(token);

    let response;
    switch (provider) {
      case "GOOGLE":
        response = await verifyGoogleToken(accessToken);
        break;
      case "GITHUB":
        response = await verifyGithubToken(accessToken);
        break;
      default:
        throw new AppError("Unsupported provider", 401);
    }

    if (!response.ok) {
      const errorBody: any = await response.json();
      logger.error(errorBody.error);
      throw new AppError("Invalid or expired access token", 401);
    }

    next();
  } catch (error: any) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError("Unauthorized access", 401));
    }
  }
}

/**
 * helper functions
 */

async function verifyGoogleToken(accessToken: string) {
  const response = await fetch(`${INSTROSPECTION_URL.GOOGLE}${accessToken}`);
  return response;
}

async function verifyGithubToken(accessToken: string) {
  const response = await fetch(INSTROSPECTION_URL.GITHUB, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response;
}
