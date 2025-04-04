'use client';

import { useRouter } from 'next/navigation';

export default function DriveSetupPage() {
  const router = useRouter();

  const handleDataEntryChoice = (type: 'automatic' | 'manual') => {
    try {
      if (type === 'automatic') {
        router.push('/auto-collect');
      } else {
        router.push('/manual-entry');
      }
    } catch (error) {
      console.error('Yönlendirme hatası:', error);
      // Alternatif yönlendirme yöntemi sadece gerçekten gerekirse kullanılmalı
      if (error instanceof Error && error.message.includes('navigation')) {
        window.location.href = type === 'automatic' ? '/auto-collect' : '/manual-entry';
      }
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Veri Giriş Yöntemi Seçin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div
          onClick={() => handleDataEntryChoice('automatic')}
          className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow"
        >
          <h2 className="text-2xl font-semibold mb-4">Otomatik Veri Girişi</h2>
          <p className="text-gray-600 mb-6">
            Sürüş verileriniz otomatik olarak toplanır ve analiz edilir.
            Bu seçenek şu an simülasyon modunda çalışmaktadır.
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>✓ Gerçek zamanlı veri toplama</li>
            <li>✓ Otomatik performans analizi</li>
            <li>✓ Detaylı sürüş raporu</li>
          </ul>
        </div>

        <div
          onClick={() => handleDataEntryChoice('manual')}
          className="bg-white rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          tabIndex={0}
          role="button"
          onKeyDown={(e) => e.key === 'Enter' && handleDataEntryChoice('manual')}
        >
          <h2 className="text-2xl font-semibold mb-4">Manuel Veri Girişi</h2>
          <p className="text-gray-600 mb-6">
            Sürüş verilerinizi kendiniz girerek detaylı bir analiz alabilirsiniz.
            Tüm parametreleri manuel olarak kontrol edin.
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>✓ Özelleştirilebilir veri girişi</li>
            <li>✓ Detaylı parametre kontrolü</li>
            <li>✓ Kişiselleştirilmiş analiz</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          ← Geri Dön
        </button>
      </div>
    </div>
  );
}