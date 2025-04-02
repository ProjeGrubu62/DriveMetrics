# Katkıda Bulunma Rehberi

## Geliştirme Süreci

### 1. Issue Oluşturma
- Her yeni özellik veya hata düzeltmesi için bir issue oluşturun
- Issue başlığı açıklayıcı ve kısa olmalı
- Issue açıklamasında şunlar bulunmalı:
  - Özellik/hata detayları
  - Kabul kriterleri
  - Varsa teknik gereksinimler

### 2. Branch Oluşturma
- Her issue için ayrı bir branch oluşturun
- Branch isimlendirme kuralları:
  - Yeni özellik: `feature/issue-{numara}-{kisa-aciklama}`
  - Hata düzeltme: `bugfix/issue-{numara}-{kisa-aciklama}`
  - Dokümantasyon: `docs/issue-{numara}-{kisa-aciklama}`

### 3. Commit Standartları
- Her commit mesajı açıklayıcı ve anlamlı olmalı
- Commit mesaj formatı:
  ```
  {type}: {description}
  
  - Detaylı açıklama (opsiyonel)
  - İlgili değişiklikler
  ```
- Commit tipleri:
  - feat: Yeni özellik
  - fix: Hata düzeltmesi
  - docs: Dokümantasyon değişiklikleri
  - style: Kod formatı değişiklikleri
  - refactor: Kod iyileştirmeleri
  - test: Test eklemeleri/güncellemeleri
  - chore: Yapılandırma değişiklikleri

### 4. Pull Request Süreci
- PR başlığı açıklayıcı olmalı
- PR açıklamasında şunlar bulunmalı:
  - İlgili issue numarası
  - Yapılan değişikliklerin özeti
  - Test senaryoları
- PR'lar küçük ve odaklı olmalı
- En az bir reviewer ataması yapılmalı

### 5. Code Review
- Kodun okunabilirliği ve maintainability'si kontrol edilmeli
- Performans ve güvenlik değerlendirmesi yapılmalı
- Testlerin yeterliliği kontrol edilmeli
- Yapıcı geri bildirimler verilmeli

### 6. Merge İşlemi
- Tüm testler başarılı olmalı
- En az bir onay alınmış olmalı
- Conflicts çözülmüş olmalı
- Squash merge tercih edilmeli

## Geliştirme Standartları

### Kod Formatı
- ESLint kurallarına uygun kod yazılmalı
- Prettier ile kod formatlanmalı
- TypeScript strict mode kullanılmalı

### Dosya Organizasyonu
- Özellik bazlı klasör yapısı kullanılmalı
- Ortak kullanılan kodlar utils/ altında toplanmalı
- Test dosyaları ilgili kodun yanında olmalı

### Test Yazımı
- Her yeni özellik için unit test yazılmalı
- Kritik fonksiyonlar için integration test yazılmalı
- Test coverage %80'in üzerinde olmalı

### Dokümantasyon
- Kod içi yorumlar açıklayıcı olmalı
- Kompleks fonksiyonlar için JSDoc kullanılmalı
- README.md güncel tutulmalı

## İletişim
- Issue ve PR'larda profesyonel ve saygılı iletişim
- Düzenli daily standup toplantıları
- Haftalık code review oturumları

## Performans Metrikleri

### Commit Sıklığı
- Günlük en az 2-3 anlamlı commit
- Haftalık en az 10-15 commit hedefi

### Code Review
- PR'lara 24 saat içinde yanıt
- Haftalık en az 3 PR review

### Issue Yönetimi
- Açık issue'ların takibi
- Haftalık en az 2 issue çözümü

### Dokümantasyon
- Haftalık README güncellemesi
- Yeni özellikler için dokümantasyon

Bu standartlara uyarak projenin kalitesini ve takım işbirliğini artırabiliriz.