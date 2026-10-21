# Ortam ayarları

Günlük geliştirmede düzenlenecek tek dosya proje kökündeki `.env.local` dosyasıdır. Supabase bağlantısı, admin e-postası, site adresi ve GA4 ayarları burada tutulur. Analytics ayarları `.env.seed.local` dosyasına yazılmamalıdır; Next.js bu dosyayı otomatik okumaz.

| Dosya | Amaç |
| --- | --- |
| `.env.local` | Sitenin gerçek yerel ayarları. Git'e girmez. |
| `.env.example` | Site ayarlarının boş şablonu; gerçek anahtar içermez. |
| `.env.seed.local` | Yalnızca seed komutu için `SUPABASE_SECRET_KEY` ve `SEED_ALLOW_WRITE`. Git'e girmez. |
| `.env.seed.example` | Seed ayarlarının boş şablonu. |

Seed'in yüksek yetkili anahtarı normal uygulama ortamına taşınmaz. Mevcut seed komutu `.env.local` ve `.env.seed.local` dosyalarını birlikte okur; komut veya seed mantığı değiştirilmedi.

GA4 alanları `.env.local` içinde aynı bölümde tutulur:

```dotenv
NEXT_PUBLIC_ANALYTICS_PROVIDER=ga4
NEXT_PUBLIC_GA_MEASUREMENT_ID=
GA4_PROPERTY_ID=
GA4_CLIENT_EMAIL=
GA4_PRIVATE_KEY=
```

`NEXT_PUBLIC_` ile başlayan değerler tarayıcıya gidebilir. `GA4_PRIVATE_KEY` ve hizmet hesabı bilgileri sunucuda kalır; bunlara bu öneki ekleme. Gerçek değerleri sohbetten veya Git üzerinden paylaşma.

Vercel'de aynı site değişkenleri projenin Environment Variables bölümüne girilir. Yerel `.env.local` dosyası Git üzerinden üretime taşınmaz. Değişiklikten sonra yerelde sunucuyu yeniden başlat, üretimde yeniden deploy et.

[GA4 kurulum adımları](analytics-ga4.md)
