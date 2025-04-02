import { Vehicle, DriveData, ManualDriveData } from '../types';

export const validateVehicleWeight = (weight: number) => {
  const MIN_WEIGHT = 800;  // Minimum reasonable weight for a car in kg
  const MAX_WEIGHT = 3500; // Maximum weight for a standard passenger vehicle in kg

  if (weight < MIN_WEIGHT) {
    return {
      isValid: false,
      message: `Weight cannot be less than minimum allowed weight (${MIN_WEIGHT} kg)`
    };
  }
  
  if (weight > MAX_WEIGHT) {
    return {
      isValid: false,
      message: `Weight exceeds maximum allowed weight (${MAX_WEIGHT} kg)`
    };
  }

  return {
    isValid: true,
    message: ''
  };
};

interface ManualDriveDataValidation {
  isValid: boolean;
  errors: string[];
}

export const validateManualDriveData = (data: ManualDriveData): ManualDriveDataValidation => {
  const errors: string[] = [];

  if (data.averageSpeed <= 0) {
    errors.push('Average speed must be greater than 0');
  }

  if (data.maxSpeed <= 0) {
    errors.push('Maximum speed must be greater than 0');
  }

  if (data.maxSpeed < data.averageSpeed) {
    errors.push('Maximum speed cannot be less than average speed');
  }

  if (data.distance <= 0) {
    errors.push('Distance must be greater than 0');
  }

  if (data.fuelUsed <= 0) {
    errors.push('Fuel used must be greater than 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

interface ValidationResult {
  sum: number;
  time: number;
  totalGearTime: number;
}

export const validateDriveData = (data: DriveData): ValidationResult => {
  const sum = data.brakeUsages.reduce((acc, brake) => acc + brake.intensity, 0);
  const time = data.gearShifts.reduce((acc, shift) => acc + shift.time, 0);
  const totalGearTime = data.clutchUsages.reduce((acc, usage) => acc + usage.duration, 0);

  return {
    sum,
    time,
    totalGearTime
  };
};