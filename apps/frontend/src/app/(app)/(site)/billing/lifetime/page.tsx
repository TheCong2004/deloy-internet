export const dynamic = 'force-dynamic';
import { LifetimeDeal } from '@gitroom/frontend/components/billing/lifetime.deal';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: `${isGeneralServerSide() ? 'Postiz' : 'Gitroom'} Lifetime deal`,
  description: '',
};
import { Suspense } from 'react';

export default async function Page() {
  return (
    <Suspense fallback={null}>
      <LifetimeDeal />
    </Suspense>
  );
}
