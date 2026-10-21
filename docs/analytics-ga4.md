# GA4 ve admin istatistikleri

`/admin/analytics`, mevcut admin oturumuyla korunur. Gerçek GA4 Data API raporlarını gösterir; bağlı değilken sayılar `—` olarak kalır. Boş bir başarılı rapor ile bağlantı hatası ayrı ele alınır.

## 1. GA4 mülkü ve ölçüm

1. https://analytics.google.com/ üzerinde bir Analytics hesabı ve yusufdere.com mülkü oluştur. Mülk saat dilimini Türkiye / Europe-Istanbul olarak seç.
2. Web veri akışına gerçek üretim adresini (`https://yusufdere.com`) ekle.
3. `G-` ile başlayan **Ölçüm Kimliği** ile sayısal **Mülk Kimliği** farklıdır. Bunları karıştırma.
4. Akışın Gelişmiş ölçüm ayarlarında **Sayfa görüntülemeleri** otomatik ölçümünü kapat (özellikle tarayıcı geçmişi değişiklikleri). Uygulama ilk görüntülemeyi ve her public pathname geçişini açıkça gönderir; otomatik ölçüm açık kalırsa çift sayım oluşabilir. Mümkünse ilk kurulumda Gelişmiş ölçümü tamamen kapalı tut; ek olaylar daha sonra bilinçli şekilde açılabilir.
5. Google sinyalleri ve reklam kişiselleştirmesi uygulama tarafından açılmaz. Google Ads / AdSense / reklam dönüşümleri bu kurulumun parçası değildir.

## 2. Admin raporlarına salt okunur erişim

1. Google Cloud projesinde **Google Analytics Data API** hizmetini aç.
2. Bir hizmet hesabı oluştur. Projeye Owner/Editor gibi geniş bir rol verme; yalnızca Analytics rapor erişimi gereklidir.
3. Analytics mülkünün erişim yönetiminde bu hizmet hesabının e-posta adresini **Görüntüleyici / Viewer** olarak ekle.
4. Bu ortam için hizmet hesabı anahtarı kullanıyorsan JSON dosyasındaki `client_email` ve `private_key` alanlarını yalnızca yerel sunucu / Vercel ortam değişkenlerine güvenli şekilde ekle. JSON dosyasını repo içine koyma, sohbetten paylaşma. Anahtar yönetimini ve iptalini Google Cloud üzerinden yap.

Ortam değişkenleri (`.env.example` yalnızca isimleri içerir):

```dotenv
NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4
NEXT_PUBLIC_GA_MEASUREMENT_ID=
GA4_PROPERTY_ID=
GA4_CLIENT_EMAIL=
GA4_PRIVATE_KEY=
```

Gerçek site ayarlarının tamamını `.env.local` içinde tut; `.env.seed.local` yalnızca seed işlemine aittir. [Dosya düzeni](environment.md). Özel anahtar PEM biçiminde veya kaçışlı `\n` satır sonlarıyla verilebilir. `GA4_` değişkenlerine `NEXT_PUBLIC_` öneki ekleme. Kimlikler eklendikten sonra yerelde sunucuyu yeniden başlat, Vercel'de yeniden deploy et. `NEXT_PUBLIC_SITE_URL` üretim hostname'i olmalı; raporlar bu alan adının www'li ve www'siz biçimlerini kapsar, localhost ve önizlemeleri dışlar.

## Ölçüm davranışı

- Ziyaretçi analytics onayı vermeden Google script'i yüklenmez. Reddetme ve onayı geri çekme GA4 ölçümünü devre dışı bırakır. Public bileşen admin'e geçişte kaldırılır; raporlar da `/admin` yollarını dışlar.
- `page_view` yalnızca pathname değiştiğinde gönderilir. Query string ve hash, gönderilen `page_location` değerine eklenmez. Aynı route'daki arama parametresi değişikliği yeni görüntülenme sayılmaz.
- Google'ın reklam depolaması/kullanıcı verisi/kişiselleştirme izinleri denied kalır. Çerez onay kaydı yine ziyaretçinin tarayıcındadır; merkezi bir kabul/red istatistiği veya rıza kayıt tablosu eklenmedi.
- Grafik ve tablolar yalnızca Google'ın döndürdüğü verileri kullanır. Günlük kullanıcılar toplanmaz; dönem kullanıcı sayısı ayrı aggregate raporundan alınır.
- Dönem bugün dahil 7/30/90 gündür; gün sınırlarını GA4 mülkünün saat dilimi belirler. Raporlar gecikmeli olabilir, onaysız/adblock'lu trafik eksik kalır ve kullanıcı sayısı gerçek kişi sayısıyla eşit değildir.
- Supabase şeması, içerik kayıtları, CRUD ve mevcut public query/cache davranışı değiştirilmedi. Rapor sorguları read-only Google kapsamı kullanır ve auth hatalarının ham içeriği istemciye aktarılmaz.

## Doğrulama

1. GA4 DebugView / Realtime ile üretim sayfasına onaylı girişte bir `page_view`, ikinci public sayfaya geçişte bir ek `page_view` doğrula. Hem otomatik hem manuel olay olmadığından emin ol.
2. Onaysız temiz bir tarayıcıda Google script ve ölçüm isteklerinin oluşmadığını kontrol et.
3. Onayı geri çek ve gezin; yeni `page_view` oluşmamalı. Admin'e geçiş de raporlarda sayılmamalı.
4. `/admin/analytics?period=7` ile GA4'ün aynı tarih/hostname filtreli raporunu karşılaştır. Mülkte eski veri yoksa geçmiş tarihler için veri üretilemez.

Kaynaklar: [GA4 SPA ölçümü](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications), [Data API kurulumu](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart), [Google Auth Library](https://docs.cloud.google.com/nodejs/docs/reference/google-auth-library/latest).
