export const dynamic = 'force-static';
import { LaunchesComponent } from '@gitroom/frontend/components/launches/launches.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: 'NexPulse | Social Calendar & Scheduler',
  description: 'Manage and schedule social media posts across channels',
};
import { Suspense } from 'react';

export default async function Index() {
  return (
    <Suspense fallback={null}>
      <LaunchesComponent />
    </Suspense>
  );
}
