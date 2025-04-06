export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  surname: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt: number;
  lastLoginAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends Omit<User, 'id' | 'createdAt' | 'lastLoginAt' | 'role' | 'isActive'> {
  confirmPassword: string;
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