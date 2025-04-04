export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: number;
  lastLoginAt: number;
}

export interface UserProfile {
  userId: string;
  driveHistory: {
    driveId: string;
    date: number;
    vehicleId: string;
    performance: {
      overallScore: number;
      clutchHealth: number;
      fuelEfficiency: number;
      smoothness: number;
    };
  }[];
  statistics: {
    totalDrives: number;
    totalDistance: number;
    averageScore: number;
    skillProgress: {
      clutchControl: number;
      gearTransitions: number;
      braking: number;
      fuelEfficiency: number;
    };
  };
}

export interface AuthResponse {
  user: User;
  token: string;
  profile: UserProfile;
}