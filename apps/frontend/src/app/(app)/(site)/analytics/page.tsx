export const dynamic = 'force-static';
import { Metadata } from 'next';
import { PlatformAnalytics } from '@gitroom/frontend/components/platform-analytics/platform.analytics';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: 'NexPulse | Analytics & Performance',
  description: 'Track multi-platform engagement and post analytics',
};
import { Suspense } from 'react';

export default async function Index() {
  return (
    <Suspense fallback={null}>
      <PlatformAnalytics />
    </Suspense>
  );
}
