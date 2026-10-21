# İçerik seed

Local bir geliştirici scriptidir. Hazır blog yazılarını, kategorileri ve projeleri Supabase’e tek komutla yazar. Production özelliği, public API veya admin endpoint değildir.

## Neden Secret key?

Kategoriler ve taslak satırlar public okumaya kapalıdır. Script’in mevcut kaydı slug veya başlıkla bulup güncellemesi için Row Level Security’yi aşan bir anahtar gerekir. Supabase bu iş için `sb_secret_...` biçimindeki Secret key kullanır. Anahtar `SUPABASE_SECRET_KEY` olarak yalnızca local seed dosyasında durur.

## Neden uygulama içinde yok?

Secret key `NEXT_PUBLIC_` ile başlamaz. Client bundle, `app/` runtime kodu, API route ve Server Action bu anahtarı okumaz. Loglara yazılmaz. Vercel deploy’u bu değişkene bağlı değildir. Gerçek anahtar repository’ye commit edilmez.

## Hazırlık

`.env.seed.example` dosyasını `.env.seed.local` olarak kopyala. Supabase Dashboard’daki Secret key değerini `SUPABASE_SECRET_KEY` olarak oraya yaz. `SEED_ALLOW_WRITE` varsayılanı `false` kalsın.

Supabase URL mevcut `.env.local` içindeki `NEXT_PUBLIC_SUPABASE_URL` değerinden okunur.

`.env.seed.local` gitignore’dadır.

## Dry run

`.env.seed.local` içinde:

```
SEED_ALLOW_WRITE=false
```

Sonra:

```
npm run seed:content
```

Script veritabanına bakıp her kayıt için `insert` veya `update` yazar. Yazma yapmaz.

## Write mode

Aynı dosyada `SEED_ALLOW_WRITE=true` yap. Tekrar `npm run seed:content` çalıştır. İş bitince değeri yeniden `false` yap.

Komut Node’un env dosyası desteğini kullanır:

```
node --env-file=.env.local --env-file=.env.seed.local scripts/seed-content.mjs
```

## Yeni içerik

Yeni kategori, yazı veya proje `scripts/seed-data.mjs` içindeki `categories`, `posts` veya `projects` dizisine eklenir. Script bu dizideki kayıtları slug ile, bulunamazsa tam başlık ile arar. Varsa günceller, yoksa ekler.

## Silmez ve kapağı ezmez

Seed listesinde olmayan satırlara dokunulmaz. Hiçbir kayıt silinmez. Mevcut `id`, `created_at` ve dolu `published_at` korunur. Mevcut `cover_image` boş seed değeriyle `null` yapılmaz. Bu script kapak dosyası yüklemez. `updated_at` veritabanı trigger’ı ile güncellenir.
