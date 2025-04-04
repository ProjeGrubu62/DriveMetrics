import { DriveData } from '../data/DriveDataGenerator';

export interface AnalysisResult {
  overallScore: number;        // Genel sürüş puanı (0-100)
  categoryScores: {
    gearUsage: number;         // Vites kullanım puanı
    brakeUsage: number;        // Fren kullanım puanı
    speedManagement: number;   // Hız yönetimi puanı
    fuelEfficiency: number;    // Yakıt verimliliği puanı
    safetyScore: number;       // Güvenlik puanı
  };
  recommendations: string[];   // İyileştirme önerileri
  warnings: string[];          // Uyarılar
}

export class DriveAnalyzer {
  private static readonly IDEAL_VALUES = {
    maxBrakeCount: 30,         // 40 dakikalık sürüş için ideal fren sayısı
    maxHardBrakeCount: 2,      // İzin verilen maksimum sert fren sayısı
    maxHighRPMTransitions: 3,  // İzin verilen yüksek devirde vites geçiş sayısı
    maxLowRPMTransitions: 2,   // İzin verilen düşük devirde vites geçiş sayısı
    maxParkingBrakeForgotten: 1, // İzin verilen el freni unutma sayısı
    idealFuelConsumption: 6,   // İdeal yakıt tüketimi (L/100km)
    maxStallCount: 2,          // İzin verilen maksimum stop sayısı
  };

  private static calculateGearUsageScore(data: DriveData): number {
    const totalDuration = Object.values(data.gearTimes).reduce((a, b) => a + b, 0);
    const gearDistribution = {
      first: data.gearTimes.first / totalDuration,
      second: data.gearTimes.second / totalDuration,
      third: data.gearTimes.third / totalDuration,
      fourth: data.gearTimes.fourth / totalDuration,
      fifth: data.gearTimes.fifth / totalDuration
    };

    // İdeal vites dağılımından sapmaları hesapla
    const idealDistribution = { first: 0.1, second: 0.15, third: 0.3, fourth: 0.3, fifth: 0.15 };
    const deviations = Object.keys(gearDistribution).map(gear => 
      Math.abs(gearDistribution[gear as keyof typeof gearDistribution] - 
               idealDistribution[gear as keyof typeof idealDistribution])
    );

    // Sapmaların ortalamasını al ve puanı hesapla
    const averageDeviation = deviations.reduce((a, b) => a + b, 0) / deviations.length;
    return Math.max(0, 100 - (averageDeviation * 200));
  }

  private static calculateBrakeUsageScore(data: DriveData): number {
    const brakeScore = Math.max(0, 100 - (
      (data.brakeUsage.count / this.IDEAL_VALUES.maxBrakeCount * 50) +
      (data.brakeUsage.hardBrakeCount / this.IDEAL_VALUES.maxHardBrakeCount * 50)
    ));

    return brakeScore;
  }

  private static calculateSpeedManagementScore(data: DriveData): number {
    const speedVariation = (data.maxSpeed - data.averageSpeed) / data.maxSpeed;
    const speedScore = Math.max(0, 100 - (speedVariation * 100));

    return speedScore;
  }

  private static calculateFuelEfficiencyScore(data: DriveData): number {
    const fuelConsumption = (data.fuelUsed * 100) / data.distance; // L/100km
    const efficiency = Math.max(0, 100 - (
      Math.abs(fuelConsumption - this.IDEAL_VALUES.idealFuelConsumption) * 10
    ));

    return efficiency;
  }

  private static calculateSafetyScore(data: DriveData): number {
    const safetyDeductions = [
      (data.parkingBrake.forgottenCount / this.IDEAL_VALUES.maxParkingBrakeForgotten) * 30,
      (data.stops.stallCount / this.IDEAL_VALUES.maxStallCount) * 20,
      (data.gearTransitions.highRPMCount / this.IDEAL_VALUES.maxHighRPMTransitions) * 25,
      (data.gearTransitions.lowRPMCount / this.IDEAL_VALUES.maxLowRPMTransitions) * 25
    ];

    return Math.max(0, 100 - safetyDeductions.reduce((a, b) => a + b, 0));
  }

  private static generateRecommendations(data: DriveData, scores: AnalysisResult['categoryScores']): string[] {
    const recommendations: string[] = [];

    if (scores.gearUsage < 70) {
      recommendations.push('Vites geçişlerinizi daha düzenli yapmanız önerilir.');
    }

    if (scores.brakeUsage < 70) {
      recommendations.push('Fren kullanımınızı daha yumuşak hale getirmeniz önerilir.');
    }

    if (scores.speedManagement < 70) {
      recommendations.push('Hız kontrolünüzü daha dengeli yapmanız önerilir.');
    }

    if (scores.fuelEfficiency < 70) {
      recommendations.push('Yakıt tüketimini azaltmak için daha ekonomik sürüş yapmanız önerilir.');
    }

    if (scores.safetyScore < 70) {
      recommendations.push('Güvenlik açısından daha dikkatli olmanız önerilir.');
    }

    return recommendations;
  }

  private static generateWarnings(data: DriveData): string[] {
    const warnings: string[] = [];

    if (data.parkingBrake.forgottenCount > 0) {
      warnings.push(`El frenini ${data.parkingBrake.forgottenCount} kez unuttuğunuz tespit edildi.`);
    }

    if (data.brakeUsage.hardBrakeCount > this.IDEAL_VALUES.maxHardBrakeCount) {
      warnings.push('Sert fren sayınız güvenli sürüş limitlerinin üzerinde.');
    }

    if (data.gearTransitions.highRPMCount > this.IDEAL_VALUES.maxHighRPMTransitions) {
      warnings.push('Yüksek devirde vites geçişleri motor ömrünü kısaltabilir.');
    }

    if (data.stops.stallCount > this.IDEAL_VALUES.maxStallCount) {
      warnings.push('Stop sayınız normalin üzerinde, debriyaj kontrolünüzü geliştirmeniz önerilir.');
    }

    return warnings;
  }

  static analyzeDrive(data: DriveData): AnalysisResult {
    const categoryScores = {
      gearUsage: this.calculateGearUsageScore(data),
      brakeUsage: this.calculateBrakeUsageScore(data),
      speedManagement: this.calculateSpeedManagementScore(data),
      fuelEfficiency: this.calculateFuelEfficiencyScore(data),
      safetyScore: this.calculateSafetyScore(data)
    };

    const overallScore = Object.values(categoryScores).reduce((a, b) => a + b, 0) / 5;

    return {
      overallScore,
      categoryScores,
      recommendations: this.generateRecommendations(data, categoryScores),
      warnings: this.generateWarnings(data)
    };
  }
}