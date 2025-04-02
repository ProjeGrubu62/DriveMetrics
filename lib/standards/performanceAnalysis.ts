import { DriveData, Vehicle } from '../../types';
import { getVehicleStandard } from './vehicleStandards';

interface PerformanceMetrics {
  fuelEfficiency: {
    score: number;
    deviation: number;
    recommendations: string[];
  };
  clutchHealth: {
    score: number;
    wear: number;
    recommendations: string[];
  };
  brakeSystem: {
    score: number;
    wear: number;
    recommendations: string[];
  };
  overallScore: number;
}

export function analyzePerformance(vehicle: Vehicle, driveData: DriveData): PerformanceMetrics {
  const standard = getVehicleStandard(vehicle.brand, vehicle.model);
  if (!standard) {
    throw new Error('Vehicle standards not found');
  }

  // Analyze fuel efficiency
  const fuelEfficiency = analyzeFuelEfficiency(driveData, standard);

  // Analyze clutch health
  const clutchHealth = analyzeClutchHealth(driveData, standard);

  // Analyze brake system
  const brakeSystem = analyzeBrakeSystem(driveData, standard);

  // Calculate overall score
  const overallScore = calculateOverallScore(fuelEfficiency.score, clutchHealth.score, brakeSystem.score);

  return {
    fuelEfficiency,
    clutchHealth,
    brakeSystem,
    overallScore
  };
}

function analyzeFuelEfficiency(driveData: DriveData, standard: any) {
  const avgSpeed = driveData.averageSpeed;
  const expectedConsumption = avgSpeed > 60 
    ? standard.fuelEfficiency.highway 
    : standard.fuelEfficiency.city;
  
  const deviation = ((driveData.fuelConsumption - expectedConsumption) / expectedConsumption) * 100;
  const score = Math.max(0, 100 - Math.abs(deviation) * 2);

  const suddenAccelerations = driveData.speedChanges.filter(
    change => change.acceleration > 0 && change.isSudden
  ).length;

  const recommendations = [];
  if (deviation > 15) {
    recommendations.push('Yakıt tüketimi yüksek. Sürüş tarzınızı gözden geçirin.');
  }
  if (suddenAccelerations > 10) {
    recommendations.push('Ani hızlanmalar yakıt tüketimini artırıyor.');
  }

  return { score, deviation, recommendations };
}

function analyzeClutchHealth(driveData: DriveData, standard: any) {
  const wear = 100 - driveData.clutchHealth;
  const score = driveData.clutchHealth;

  const recommendations = [];
  if (wear > 30) {
    recommendations.push('Debriyaj aşınması normalin üzerinde.');
  }
  if (driveData.clutchUsages.filter(u => u.isHardRelease).length > 5) {
    recommendations.push('Sert debriyaj bırakmaları azaltılmalı.');
  }

  return { score, wear, recommendations };
}

function analyzeBrakeSystem(driveData: DriveData, standard: any) {
  const totalBrakeUse = driveData.brakeUsages.length;
  const emergencyBrakes = driveData.brakeUsages.filter(b => b.isEmergency).length;
  
  const wear = (totalBrakeUse / standard.brakeLifespan.pads) * 100;
  const score = Math.max(0, 100 - (wear * 0.8) - (emergencyBrakes * 2));

  const recommendations = [];
  if (wear > 50) {
    recommendations.push('Fren sistemi yıpranması hızlı. Daha yumuşak fren kullanımı önerilir.');
  }
  if (emergencyBrakes > 3) {
    recommendations.push('Ani fren sayısı yüksek. Güvenli following distance bırakın.');
  }

  return { score, wear, recommendations };
}

function calculateOverallScore(...scores: number[]): number {
  return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
}