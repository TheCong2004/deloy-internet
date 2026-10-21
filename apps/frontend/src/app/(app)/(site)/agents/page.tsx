export const dynamic = 'force-static';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'NexPulse | AI Content Agent',
  description: '',
};

export default async function Page() {
  return redirect('/agents/new');
}
