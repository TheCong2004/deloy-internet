import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@gitroom/helpers/auth/auth.service';
import { User } from '@prisma/client';
import { OrganizationService } from '@gitroom/nestjs-libraries/database/prisma/organizations/organization.service';
import { UsersService } from '@gitroom/nestjs-libraries/database/prisma/users/users.service';
import { getCookieUrlFromDomain } from '@gitroom/helpers/subdomain/subdomain.management';
import { HttpForbiddenException } from '@gitroom/nestjs-libraries/services/exception.filter';
import { MastraService } from '@gitroom/nestjs-libraries/chat/mastra.service';
import { setSentryUserContext } from '@gitroom/nestjs-libraries/sentry/initialize.sentry';

export const removeAuth = (res: Response) => {
  res.cookie('auth', '', {
    domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
    ...(!process.env.NOT_SECURED
      ? {
          secure: true,
          httpOnly: true,
          sameSite: 'none',
        }
      : {}),
    expires: new Date(0),
    maxAge: -1,
  });
  res.header('logout', 'true');
};

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private _organizationService: OrganizationService,
    private _userService: UsersService
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.auth || req.cookies.auth;
    try {
      let user: User | null = null;
      if (auth) {
        try {
          const payload = AuthService.verifyJWT(auth) as User | null;
          if (payload?.id) {
            user = (await this._userService.getUserById(payload.id)) as User | null;
          }
        } catch (e) {
          // Token invalid, fall back to default user
        }
      }

      // Auto-login single-user mode: use or create default admin user
      if (!user) {
        user = (await this._organizationService.getDefaultOrgAndUser()) as User | null;
      }

      if (!user) {
        throw new HttpForbiddenException();
      }

      const orgHeader = req.cookies.showorg || req.headers.showorg;

      const impersonate = req.cookies.impersonate || req.headers.impersonate;
      if (user?.isSuperAdmin && impersonate) {
        const loadImpersonate = await this._organizationService.getUserOrg(
          impersonate
        );

        if (loadImpersonate) {
          user = loadImpersonate.user;
          user.isSuperAdmin = true;
          delete user.password;

          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          req.user = user;

          // @ts-ignore
          loadImpersonate.organization.users =
            loadImpersonate.organization.users.filter(
              (f) => f.userId === user.id
            );
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          req.org = loadImpersonate.organization;

          setSentryUserContext({
            userId: user.id,
            email: user.email,
            orgId: loadImpersonate.organization.id,
            paymentId: loadImpersonate.organization.paymentId,
          });
          next();
          return;
        }
      }

      delete user.password;
      const orgs = await this._organizationService.getOrgsByUserId(user.id);
      const organization = orgs.filter((f) => !f.users?.[0]?.disabled);
      const setOrg =
        organization.find((org) => org.id === orgHeader) ||
        organization.find((org) => org.subscription) ||
        organization[0] ||
        orgs[0];

      if (!setOrg) {
        throw new HttpForbiddenException();
      }

      if (!setOrg.apiKey) {
        await this._organizationService.updateApiKey(setOrg.id);
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      req.user = user;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      req.org = setOrg;

      // Ensure client receives auth cookie for the active user
      if (!auth) {
        const token = AuthService.signJWT({ id: user.id });
        res.cookie('auth', token, {
          path: '/',
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 365 * 24 * 60 * 60 * 1000,
        });
      }

      setSentryUserContext({
        userId: user.id,
        email: user.email,
        orgId: setOrg.id,
        paymentId: setOrg.paymentId,
      });
    } catch (err) {
      throw new HttpForbiddenException();
    }
    next();
  }
}
