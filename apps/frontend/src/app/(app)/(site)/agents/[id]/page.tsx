import { Metadata } from 'next';
import { Agent } from '@gitroom/frontend/components/agents/agent';
import { AgentChat } from '@gitroom/frontend/components/agents/agent.chat';
export const dynamic = 'force-static';
export async function generateStaticParams() {
  return [{ id: 'new' }];
}

export const metadata: Metadata = {
  title: 'Postiz - Agent',
  description: '',
};
import { Suspense } from 'react';

export default async function Page() {
  return (
    <Suspense fallback={null}>
      <AgentChat />
    </Suspense>
  );
}
