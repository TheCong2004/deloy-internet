import { OAuthAuthorize } from '@gitroom/frontend/components/oauth/authorize.component';
import { cookies } from 'next/headers';

// signed-out visitors get the page too (sign in, or use self-hosted)
export default async function OAuthAuthorizePage() {
  let logged = false;
  try {
    const get = (await cookies()).get('auth');
    logged = !!get?.name;
  } catch {}
  return <OAuthAuthorize logged={logged} />;
}
