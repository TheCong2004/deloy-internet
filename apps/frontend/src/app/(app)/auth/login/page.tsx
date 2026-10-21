export const dynamic = 'force-static';
import { Login } from '@gitroom/frontend/components/auth/login';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Postiz' : 'Gitroom'} Login`,
  description: '',
};
import { Suspense } from 'react';

export default async function Auth() {
  return (
    <Suspense fallback={null}>
      <Login />
    </Suspense>
  );
}
