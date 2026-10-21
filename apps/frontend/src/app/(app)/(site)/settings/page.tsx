export const dynamic = 'force-static';
import { SettingsPopup } from '@gitroom/frontend/components/layout/settings.component';
import { Metadata } from 'next';
import { isGeneralServerSide } from '@gitroom/helpers/utils/is.general.server.side';
export const metadata: Metadata = {
  title: 'NexPulse | Workspace & Channel Settings',
  description: 'Configure social media channels, team settings and credentials',
};
import { Suspense } from 'react';

export default async function Index() {
  return (
    <Suspense fallback={null}>
      <SettingsPopup />
    </Suspense>
  );
}
