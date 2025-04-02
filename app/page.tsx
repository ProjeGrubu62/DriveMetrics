'use client'
import { useRouter } from 'next/navigation'
import ManualDataEntry from '../components/forms/ManualDataEntry';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <ManualDataEntry />
    </main>
  );
}