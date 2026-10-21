import { Forgot } from '@gitroom/frontend/components/auth/forgot';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Postiz' : 'Gitroom'} Forgot Password`,
  description: '',
};
import { Suspense } from 'react';

export default async function Auth() {
  return (
    <Suspense fallback={null}>
      <Forgot />
    </Suspense>
  );
}
