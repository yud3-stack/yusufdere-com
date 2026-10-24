# Mobil etkileşim ve performans · 25 Ekim 2026

## Bulgular
Geliştirme sunucusunun logunda yerel ağdan gelen HMR isteği allowedDevOrigins nedeniyle engellenmişti. Aynı LAN Origin/Referer ile bir JavaScript dosyası isteğinde de 403 üretildi. Bu, yalnızca performans sorunu olarak değerlendirilemez. Telefonun tamamının çalışma durumu fiziksel iPhone'da uzaktan doğrulanmış değildir.

## Değişiklikler
- `allowedDevOrigins` bilgisayarın mevcut IPv4 ağ arayüzlerinin tam adreslerinden oluşturulur; önceki VPN adresi korunur. DHCP değişince yeni adres başlangıçta alınır. Genel wildcard yoktur. LAN isteği artık 200; tanımsız origin hâlâ 403.
- Mobil menü native details/summary ve gerçek href'lerle sunucu HTML'inde bulunur. Açılma ve sayfa bağlantıları hydration beklemez. Desktop navigasyon ve tasarım korunur. Mobil kontroller en az 44px olur.
- Günlük yayın anlık kopyası, ISO tarihinin de bulunduğu anahtarla 300 saniye önbelleklenir. Gece yarısı yeni anahtar kullanılır. Başarısız sonuç/yerel fallback cache'e yazılmaz. HomeScene connection() ile isteğin tarihini kullanmaya devam eder.
- Kamuya açık Supabase okumalarına 5sn ağ zaman aşımı eklendi; servis sorununda mevcut hata/yedek durumlarına dönülür.
- Canvas paylaşım kodu yalnızca günün sözü açıldığında yüklenir. Mobil kartlardaki blur kompozisyonu ve bulanık giriş animasyonu kaldırıldı; kısa opacity geçişi kalır.

## Ölçüm
Yerel `next start` üzerinde gzip HTTP istekleri, aynı bilgisayarda önce/sonra üç sıcak örnek. Gerçek mobil ağ, WebKit, Lighthouse, LCP ve INP ölçümü değildir. İlk ziyaret yavaşlama ölçümü değişken TLS/soğuk süreç maliyeti içerir; tüm yüklemenin dört kat hızlandığı iddia edilmez.

| Ölçüm | Önce | Sonra |
| --- | --- | --- |
| İlk sunucu yanıtı | 911 ms | 1094 ms |
| Üç sıcak sunucu yanıtı | 139 / 140 / 129 ms | 38 / 33 / 33 ms |
| HTML gzip | 12.3 KB | 12.4 KB |
| İlk HTML'deki JS dosyaları gzip toplamı | 256.0 KB | 255.1 KB |
| Portre WebP 640px | 46.7 KB | 46.7 KB |

Yüksek piksel yoğunluklu telefona seçilebilen 1200px portre 112.5 KB ölçüldü. Görselin kaynak PNG'sinin 1.68 MB olması bu boyutun telefona indirildiği anlamına gelmez; next/image optimizasyonu çalışıyor.

Ham sonuçlar: `output/performance-before.json`, `output/performance-after.json`.

## Doğrulama
37 test başarılı. ESLint / TypeScript ve production build başarılı. LAN adresinde 390px viewport'ta menü ve gerçek link navigasyonu; modal kapandıktan sonra menünün açılması, arka sayfanın inert kalmaması ve body kilidinin kalkması doğrulandı. Geçici performans sunucusu kapatıldı; 3000 portundaki asıl geliştirme sunucusu korunur.
