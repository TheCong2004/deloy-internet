import { Metadata } from 'next';
import { Activate } from '@gitroom/frontend/components/auth/activate';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${
    isGeneralServerSide() ? 'Postiz' : 'Gitroom'
  } - Activate your account`,
  description: '',
};
import { Suspense } from 'react';

export default async function Auth() {
  return (
    <Suspense fallback={null}>
      <Activate />
    </Suspense>
  );
}
