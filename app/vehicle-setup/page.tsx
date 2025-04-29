'use client';

import ManualDataEntry from '../../components/forms/ManualDataEntry';

export default function VehicleSetupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Araç Kurulumu</h1>
      <ManualDataEntry />
    </div>
  );
} 