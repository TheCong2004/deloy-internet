import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookieUrlFromDomain } from '@gitroom/helpers/subdomain/subdomain.management';
import { internalFetch } from '@gitroom/helpers/utils/internal.fetch';
import acceptLanguage from 'accept-language';
import {
  cookieName,
  headerName,
  languages,
} from '@gitroom/react/translation/i18n.config';
acceptLanguage.languages(languages);

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const nextUrl = request.nextUrl;
  const authCookie =
    request.cookies.get('auth') ||
    request.headers.get('auth') ||
    nextUrl.searchParams.get('loggedAuth');
  const lng = request.cookies.has(cookieName)
    ? acceptLanguage.get(request.cookies.get(cookieName).value)
    : acceptLanguage.get(
        request.headers.get('Accept-Language') ||
          request.headers.get('accept-language')
      );

  const requestHeaders = new Headers(request.headers);
  if (lng) {
    requestHeaders.set(headerName, lng);
  }

  const topResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  if (lng) {
    topResponse.headers.set(cookieName, lng);
  }

  if (nextUrl.pathname.startsWith('/modal/') && !authCookie) {
    return NextResponse.redirect(new URL(`/auth/login-required`, nextUrl.href));
  }

  if (
    nextUrl.pathname.startsWith('/uploads/') ||
    nextUrl.pathname.startsWith('/p/') ||
    nextUrl.pathname.startsWith('/provider/') ||
    nextUrl.pathname.startsWith('/icons/') ||
    // the consent screen of MCP / OAuth clients handles signed-out visitors
    // itself (sign in and come back, or connect a self-hosted instance)
    nextUrl.pathname.startsWith('/oauth/authorize')
  ) {
    return topResponse;
  }

  if (
    nextUrl.pathname.startsWith('/integrations/social/') &&
    nextUrl.href.indexOf('state=login') === -1
  ) {
    return topResponse;
  }

  // Auto-login single-user mode: If user visits /auth*, redirect directly to dashboard
  if (nextUrl.pathname.startsWith('/auth')) {
    const response = NextResponse.redirect(new URL('/launches', nextUrl.href));
    response.cookies.delete('auth');
    response.cookies.delete('org');
    response.cookies.delete('showorg');
    return response;
  }
  try {
    const org = nextUrl.searchParams.get('org');
    if (org) {
      try {
        const { id } = await (
          await internalFetch('/user/join-org', {
            body: JSON.stringify({
              org,
            }),
            method: 'POST',
          })
        ).json();
        const redirect = NextResponse.redirect(
          new URL(`/?added=true`, nextUrl.href)
        );
        if (id) {
          redirect.cookies.set('showorg', id, {
            ...(!process.env.NOT_SECURED
              ? {
                  path: '/',
                  secure: true,
                  httpOnly: true,
                  sameSite: false,
                  domain: getCookieUrlFromDomain(process.env.FRONTEND_URL!),
                }
              : {}),
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
          });
        }
        return redirect;
      } catch (e) {
        // Ignore join-org failure in standalone mode
      }
    }
    if (nextUrl.pathname === '/') {
      return NextResponse.redirect(
        new URL(
          !!process.env.IS_GENERAL ? '/launches' : `/analytics`,
          nextUrl.href
        )
      );
    }

    return topResponse;
  } catch (err) {
    console.log('err', err);
    return topResponse;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)',
};