'use client';

import ManualDataEntry from '../components/ManualDataEntry';

interface ManualDriveData {
  totalTime: number;
  gearTimes: {
    first: number;
    second: number;
    third: number;
    fourth: number;
    fifth: number;
  };
  averageSpeed: number;
  maxSpeed: number;
  distance: number;
  fuelUsed: number;
}

export default function ManualEntryPage() {
  return (
    <div className="container mx-auto py-8">
      <ManualDataEntry />
    </div>
  );
}