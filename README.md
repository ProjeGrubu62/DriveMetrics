<<<<<<< HEAD
# DriveMetrics - Araç Performans Analiz Sistemi

## Proje Hakkında
DriveMetrics, sürücülerin araç kullanım verilerini analiz ederek detaylı performans raporları sunan bir web uygulamasıdır. Sistem, vites kullanımı, yakıt tüketimi, fren sistemi ve sürüş paterni gibi kritik parametreleri analiz ederek sürücülere ve araç sahiplerine değerli bilgiler sağlar.

## Özellikler

### 1. Vites-Hız Analizi
- Vites kullanım süreleri ve dağılımı
- Hız aralıklarına göre sürüş analizi
- Optimum vites geçiş önerileri

### 2. Yakıt ve Ağırlık Analizi
- Mesafeye bağlı yakıt tüketimi grafiği
- Araç ağırlığının performansa etkisi
- Yakıt verimliliği önerileri

### 3. Fren Sistemi Analizi
- Fren kullanım sıklığı ve yoğunluğu
- Balata ve disk aşınma tahminleri
- Güvenli fren mesafesi önerileri

### 4. Sürüş Paterni Analizi
- Ani hızlanma ve frenleme tespiti
- Sürüş tarzı sınıflandırması (Ekonomik/Normal/Sportif)
- Sürüş davranışı iyileştirme önerileri

### 5. Debriyaj Analizi
- Debriyaj kullanım süresi ve sıklığı
- Debriyaj sağlığı ve aşınma durumu
- Optimum debriyaj kullanım önerileri

## Teknolojiler

### Frontend
- Next.js 13 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js / React-Chartjs-2

### Veri Yönetimi
- React Hooks (useState, useEffect)
- Custom Hooks
- Local Storage

### API Entegrasyonları
- RapidAPI (Araç görselleri için)
- Custom API endpoints

## Geliştirme Önerileri

### Veri Kaynakları
- OBD-II cihazlarından gerçek zamanlı veri alımı
- Araç üreticilerinin API'lerinin entegrasyonu
- Mobil uygulama üzerinden sensör verilerinin toplanması

### Kullanıcı Deneyimi
- Sürüş skorlama sistemi
- Kişiselleştirilmiş sürüş önerileri
- Sosyal paylaşım özellikleri

### Analiz Özellikleri
- Yapay zeka destekli sürüş analizi
- Karşılaştırmalı performans raporları
- Detaylı maliyet analizi

## Geliştirici Ekibi
Bu proje, üç kişilik bir geliştirici ekibi tarafından yürütülmektedir. Ekip üyeleri frontend, backend ve veri analizi alanlarında uzmanlıklarını bir araya getirerek projenin geliştirilmesine katkıda bulunmaktadır.

## GitHub Kullanımı

### Repository Yönetimi
1. Repository'yi public olarak ayarlayın
2. .gitignore dosyasını Node.js template ile oluşturun
3. Geliştirme sürecini branch'ler üzerinden yönetin

### Branch Stratejisi
- `main`: Kararlı sürüm
- `develop`: Geliştirme branch'i
- `feature/*`: Yeni özellikler için
- `bugfix/*`: Hata düzeltmeleri için

### İş Akışı
1. Yeni bir özellik için branch oluşturun
2. Kodları geliştirin ve test edin
3. Pull request oluşturun
4. Ekip üyelerinden code review alın
5. Onay sonrası merge işlemini gerçekleştirin

## Kurulum

```bash
# Projeyi klonlama
git clone https://github.com/projegrubu158/drivemetrics.git

# Bağımlılıkların yüklenmesi
cd drivemetrics
npm install

# Geliştirme sunucusunu başlatma
npm run dev
```

## Katkıda Bulunma
1. Repository'yi fork'layın
2. Feature branch oluşturun (`git checkout -b feature/YeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik: XYZ eklendi'`)
4. Branch'inizi push edin (`git push origin feature/YeniOzellik`)
5. Pull Request oluşturun ve ekip üyelerinden review isteyin

## Lisans
Bu proje MIT lisansı altında lisanslanmıştır. Detaylı bilgi için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.
=======
# DriveMetrics
>>>>>>> cd5b3f9191e6099b187266f9909d0862ef093776
