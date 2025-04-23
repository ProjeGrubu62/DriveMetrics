'use client';

import { useState, useMemo } from 'react';
import { DriveData } from '../types';

export interface AnalysisResult {
  overallScore: number;
  categoryScores: {
    gearUsage: number;
    brakeUsage: number;
    speedManagement: number;
    fuelEfficiency: number;
    safetyScore: number;
  };
  warnings: string[];
  recommendations: string[];
}

interface DriveAnalysisReportProps {
  driveData: DriveData | null;
  analysisResult: AnalysisResult;
}

export default function DriveAnalysisReport({ driveData, analysisResult }: DriveAnalysisReportProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'recommendations'>('overview');

  const tabs = [
    { id: 'overview', label: 'Genel Bakış' },
    { id: 'details', label: 'Detaylar' },
    { id: 'recommendations', label: 'Öneriler' }
  ];

  const formatDuration = useMemo(() => (seconds: number): string => {
    if (!seconds) return '0s 0dk';
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}s ${mins}dk`;
  }, []);

  const formatDateTime = useMemo(() => (timestamp: number): string => {
    if (!timestamp) return '-';
    try {
      const date = new Date(timestamp);
      const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      } as const;
      return new Intl.DateTimeFormat('tr-TR', options).format(date);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  }, []);

  const getScoreColor = useMemo(() => (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  }, []);

  const renderOverview = useMemo(() => {
    return () => {
      if (!driveData || !driveData.gearShifts) return null;
      
      const firstGearShift = driveData.gearShifts[0] || { timestamp: 0 };
      const lastGearShift = driveData.gearShifts[driveData.gearShifts.length - 1] || { timestamp: 0 };
      const driveDuration = Math.max(0, lastGearShift.timestamp - firstGearShift.timestamp);
      
      // Varsayılan gearTimes değerlerini tanımla
      const defaultGearTimes = {
        first: 0,
        second: 0,
        third: 0,
        fourth: 0,
        fifth: 0
      };
      
      // gearTimes için null kontrolü ekle
      const gearTimes = driveData.gearTimes || defaultGearTimes;
      
      const totalStopDuration = driveData.stopEvents?.reduce((total, stop) => total + stop.duration, 0) || 0;
      const totalStops = driveData.stopEvents?.length || 0;
      
      return (
        <div className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
            <h3 className="text-2xl font-bold mb-4">Genel Sürüş Puanı</h3>
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(analysisResult.overallScore)}`}>
              {Math.round(analysisResult.overallScore)}/100
            </div>
            <div className="text-gray-600 text-sm">
              {analysisResult.overallScore >= 90 ? '🌟 Mükemmel sürüş!' :
               analysisResult.overallScore >= 70 ? '👍 İyi gidiyorsun!' :
               '💪 Gelişime açık'}
            </div>
          </div>

          {/* Tablo formatında veri özeti */}
          <div className="overflow-hidden bg-white shadow-md rounded-lg">
            <h3 className="text-lg font-semibold p-4 bg-gray-50 border-b">Sürüş Verileri Özeti</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parametre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Değer</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detay</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sürüş Süresi</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(driveDuration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(firstGearShift.timestamp)} - {formatDateTime(lastGearShift.timestamp)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Mesafe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driveData.totalDistance.toFixed(1)} km</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Toplam yol</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Yakıt Tüketimi</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driveData.fuelConsumption.toFixed(1)} L</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(driveData.fuelConsumption / driveData.totalDistance * 100).toFixed(1)} L/100km</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Hız</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Ort: {driveData.averageSpeed} km/h</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Max: {driveData.maxSpeed} km/h</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Vites Kullanımı</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driveData.gearShifts.length} değişim</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      1: {gearTimes.first}dk, 
                      2: {gearTimes.second}dk, 
                      3: {gearTimes.third}dk, 
                      4: {gearTimes.fourth}dk, 
                      5: {gearTimes.fifth}dk
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Duruşlar</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driveData.speedChanges.filter(change => change.toSpeed === 0).length} kez</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Toplam: {totalStops} duruş</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Debriyaj Sağlığı</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driveData.clutchHealth || 0}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(driveData.clutchUsages || []).filter(usage => usage.isHardRelease).length} sert bırakma, 
                      {(driveData.clutchUsages || []).filter(usage => usage.isSlipping).length} kaydırma
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sürüş Stili</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driveData.drivingStyle === 'economic' ? 'Ekonomik' : driveData.drivingStyle === 'sporty' ? 'Sportif' : 'Normal'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {analysisResult.categoryScores.fuelEfficiency.toFixed(0)}/100 yakıt verimliliği
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-3 text-green-700">Sürüş Özeti</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">🕒</span>
                  <span>Başlangıç: {formatDateTime(driveData.gearShifts[0]?.timestamp || Date.now())}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">🏁</span>
                  <span>Bitiş: {formatDateTime(driveData.gearShifts[driveData.gearShifts.length - 1]?.timestamp || Date.now())}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">⚡</span>
                  <span>Motor: {formatDuration((driveData.gearShifts[driveData.gearShifts.length - 1]?.timestamp || 0) - (driveData.gearShifts[0]?.timestamp || 0))}</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-blue-50 to-sky-50 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-3 text-blue-700">Mesafe ve Yakıt</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">🛣️</span>
                  <span>Mesafe: {driveData.totalDistance.toFixed(1)} km</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">⛽</span>
                  <span>Yakıt: {driveData.fuelConsumption.toFixed(1)} L</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-600">📊</span>
                  <span>Tüketim: {(driveData.fuelConsumption / driveData.totalDistance * 100).toFixed(1)} L/100km</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-3 text-purple-700">Hız Analizi</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">🔄</span>
                  <span>Ortalama: {driveData.averageSpeed} km/h</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">⚡</span>
                  <span>Maksimum: {driveData.maxSpeed} km/h</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-600">🚦</span>
                  <span>Duruş: {driveData.speedChanges.filter(change => change.toSpeed === 0).length} kez</span>
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-3 text-amber-700">Sürüş Stili</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-amber-600">🚗</span>
                  <span>Stil: {driveData.drivingStyle === 'economic' ? 'Ekonomik' : driveData.drivingStyle === 'sporty' ? 'Sportif' : 'Normal'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-600">⚙️</span>
                  <span>Debriyaj Sağlığı: {driveData.clutchHealth}%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      );
    };
  }, [driveData, analysisResult, formatDateTime, formatDuration, getScoreColor]);

  const renderDetails = useMemo(() => {
    return () => {
      if (!driveData) return null;
      
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(analysisResult.categoryScores).map(([category, score]) => {
              const categoryIcons = {
                gearUsage: '⚙️',
                brakeUsage: '🛑',
                speedManagement: '🏃',
                fuelEfficiency: '⛽',
                safetyScore: '🛡️'
              };
              
              return (
                <div key={category} className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                    <h4 className="font-semibold text-indigo-700">
                      {{
                        gearUsage: 'Vites Kullanımı',
                        brakeUsage: 'Fren Kullanımı',
                        speedManagement: 'Hız Yönetimi',
                        fuelEfficiency: 'Yakıt Verimliliği',
                        safetyScore: 'Güvenlik Puanı'
                      }[category]}
                    </h4>
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${getScoreColor(score)}`}>
                    {Math.round(score)}/100
                  </div>
                  <div className="text-sm text-gray-600">
                    {score >= 90 ? 'Mükemmel performans!' :
                     score >= 70 ? 'İyi gidiyorsun' :
                     'Gelişim alanı'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-4 text-emerald-700 flex items-center gap-2">
                <span>⚙️</span>
                <span>Vites Analizi</span>
              </h4>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-medium mb-3 text-emerald-600">Vites Kullanım Analizi</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2 bg-emerald-50 rounded-lg">
                      <div className="font-semibold text-emerald-700">Toplam Vites Değişimi</div>
                      <div className="text-sm text-emerald-600">{driveData.gearShifts.length} kez</div>
                    </div>
                    <div className="text-center p-2 bg-emerald-50 rounded-lg">
                      <div className="font-semibold text-emerald-700">Debriyaj Sağlığı</div>
                      <div className="text-sm text-emerald-600">{driveData.clutchHealth}%</div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h5 className="font-medium mb-3 text-emerald-600">Debriyaj Kullanımı</h5>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-emerald-50 rounded-lg text-center">
                      <div className="text-lg font-semibold text-emerald-700">
                        {driveData.clutchUsages.filter(usage => usage.isHardRelease).length}
                      </div>
                      <div className="text-sm text-emerald-600">Sert Bırakma</div>
                    </div>
                    <div className="p-3 bg-emerald-50 rounded-lg text-center">
                      <div className="text-lg font-semibold text-emerald-700">
                        {driveData.clutchUsages.filter(usage => usage.isSlipping).length}
                      </div>
                      <div className="text-sm text-emerald-600">Kaydırma</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-rose-50 to-red-50 rounded-lg shadow-sm">
              <h4 className="font-semibold mb-4 text-rose-700 flex items-center gap-2">
                <span>🛑</span>
                <span>Fren Analizi</span>
              </h4>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-white rounded-lg text-center">
                    <div className="text-2xl font-bold text-rose-600">{driveData.brakeUsages.length}</div>
                    <div className="text-sm text-rose-600">Toplam Fren</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg text-center">
                    <div className="text-2xl font-bold text-rose-600">
                      {driveData.brakeUsages.filter(usage => usage.isEmergency).length}
                    </div>
                    <div className="text-sm text-rose-600">Acil Fren</div>
                  </div>
                  <div className="p-4 bg-white rounded-lg text-center">
                    <div className="text-2xl font-bold text-rose-600">
                      {driveData.brakeUsages.filter(usage => usage.handbrakeUsed).length}
                    </div>
                    <div className="text-sm text-rose-600">El Freni Kullanımı</div>
                  </div>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <h5 className="font-medium mb-3 text-rose-600">Fren Kullanım Analizi</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Acil Fren Oranı</span>
                      <span className="font-semibold text-rose-600">
                        {((driveData.brakeUsages.filter(usage => usage.isEmergency).length / driveData.brakeUsages.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Ortalama Fren Yoğunluğu</span>
                      <span className="font-semibold text-rose-600">
                        {(driveData.brakeUsages.reduce((acc, curr) => acc + curr.intensity, 0) / driveData.brakeUsages.length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };
  }, [driveData, analysisResult, getScoreColor]);

  const renderRecommendations = useMemo(() => {
    return () => {
      return (
        <div className="space-y-6">
          {analysisResult.warnings.length > 0 && (
            <div className="p-6 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚠️</span>
                <h4 className="font-semibold text-red-700">Dikkat Edilmesi Gerekenler</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysisResult.warnings.map((warning, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-red-100">
                    <div className="flex items-start gap-3">
                      <div className="text-red-500 mt-1">❗</div>
                      <div className="text-red-700">{warning}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💡</span>
              <h4 className="font-semibold text-blue-700">Sürüş İyileştirme Önerileri</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisResult.recommendations.map((recommendation, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-500 mt-1">
                      {index % 2 === 0 ? '📈' : '🎯'}
                    </div>
                    <div>
                      <div className="text-blue-700">{recommendation}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {index % 2 === 0 ? 'Performans İyileştirme' : 'Hedef Önerisi'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎉</span>
                <h5 className="font-medium text-blue-700">Başarı İpuçları</h5>
              </div>
              <div className="text-gray-600">
                Sürüş puanınızı artırmak için yukarıdaki önerileri dikkate alın ve düzenli olarak sürüş verilerinizi kontrol edin.
                Her sürüşte küçük iyileştirmeler yaparak genel performansınızı artırabilirsiniz.
              </div>
            </div>
          </div>
        </div>
      );
    };
  }, [analysisResult]);

  if (!driveData) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="flex space-x-4 mb-6 bg-gray-100 p-2 rounded-lg">
        <button
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'overview' ? 'bg-blue-500 text-white shadow-md transform scale-105' : 'bg-white hover:bg-gray-50'}`}
          onClick={() => setActiveTab('overview')}
        >
          Genel Bakış
        </button>
        <button
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'details' ? 'bg-blue-500 text-white shadow-md transform scale-105' : 'bg-white hover:bg-gray-50'}`}
          onClick={() => setActiveTab('details')}
        >
          Detaylar
        </button>
        <button
          className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeTab === 'recommendations' ? 'bg-blue-500 text-white shadow-md transform scale-105' : 'bg-white hover:bg-gray-50'}`}
          onClick={() => setActiveTab('recommendations')}
        >
          Öneriler
        </button>
      </div>

      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'details' && renderDetails()}
      {activeTab === 'recommendations' && renderRecommendations()}
    </div>
  );
}