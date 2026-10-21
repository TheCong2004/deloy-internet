import { ContinueIntegration } from '@gitroom/frontend/components/launches/continue.integration';
import { cookies } from 'next/headers';

export default async function Page(
  props: {
    params: Promise<{
      provider: string;
    }>;
    searchParams: Promise<any>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  const {
    provider
  } = params;

  let logged = false;
  try {
    const get = (await cookies()).get('auth');
    logged = !!get?.name;
  } catch {}
  return <ContinueIntegration searchParams={searchParams} provider={provider} logged={logged} />;
}
