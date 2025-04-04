export interface DriveData {
  driverSeatTime: {
    start: number;  // Unix timestamp
    end: number;    // Unix timestamp
  };
  engineTime: {
    start: number;  // Unix timestamp
    end: number;    // Unix timestamp
  };
  gearTimes: {
    first: number;
    second: number;
    third: number;
    fourth: number;
    fifth: number;
  };
  stops: {
    count: number;
    totalDuration: number;  // dakika cinsinden
    stallCount: number;     // istop sayısı
  };
  brakeUsage: {
    count: number;          // fren kullanım sayısı
    totalDuration: number;  // toplam fren süresi (saniye)
    hardBrakeCount: number; // sert fren sayısı
  };
  gearTransitions: {
    highRPMCount: number;   // yüksek devirde vites geçiş sayısı
    lowRPMCount: number;    // düşük devirde vites geçiş sayısı
  };
  parkingBrake: {
    forgottenCount: number;    // el freni unutulma sayısı
    totalDuration: number;     // toplam unutulma süresi (saniye)
    transmissionDamage: number; // şanzıman hasar süresi (saniye)
  };
  averageSpeed: number;
  maxSpeed: number;
  distance: number;
  fuelUsed: number;
  weatherConditions: {
    temperature: number;
    weather: 'sunny' | 'rainy' | 'snowy' | 'cloudy';
    roadCondition: 'dry' | 'wet' | 'icy' | 'snowy';
  };
}