# Supabase kurulumu

Bu adım yalnızca veritabanı altyapısını hazırlar. Site arayüzü hâlâ yerel iskeleti gösterir. Admin, giriş ve çerez eklenmedi.

Anahtar olarak **publishable key** kullanılıyor. Supabase bunu anon key’in yerine geçirdi. Aynı `createClient(url, key)` çağrısına gider ve tarayıcıda durması güvenlidir. Eski anon JWT hâlâ çalışır; dashboard’da yalnızca o görünüyorsa onu `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` değerine yaz. Secret key ve eski `service_role` anahtarı bu dosyaya girmez.

## 1. Supabase projesi

1. [supabase.com/dashboard](https://supabase.com/dashboard) içinde yeni bir proje aç.
2. Bölgeyi seçip veritabanı şifresini kaydet.
3. Proje hazır olana kadar bekle.

## 2. Adres ve anahtar

Dashboard → **Project Settings** → **Data API**: Project URL.

Dashboard → **Project Settings** → **API Keys**: **Publishable key**.

Eski anon JWT, aynı sayfada **Legacy API keys** altındaysa o da bu değişkenin değeri olabilir.

## 3. `.env.local`

Proje kökünde `.env.local` oluştur. Bu dosya git tarafından yok sayılır.

```bash
NEXT_PUBLIC_SUPABASE_URL=https://SENIN_PROJE_REFIN.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Değerleri buraya ben yazmadım. Kendi panelinden alacaksın.

## 4. Migration

SQL dosyası: `supabase/migrations/20261017023000_init_content.sql`

Dashboard → **SQL Editor** → New query → dosyanın tamamını yapıştır → **Run**. Bir kez çalıştır.

Supabase CLI kuruluysa ve projeyi bağladıysan alternatif:

```bash
supabase link
supabase db push
```

CLI bu repoda kurulu değil. Elle SQL çalıştırmak yeterli.

## 5. Bağlantıyı denemek

`.env.local` doldurulduktan sonra geliştirme sunucusunu yeniden başlat.

SQL Editor’da:

```sql
insert into public.categories (name, slug) values ('Notlar', 'notlar');

insert into public.posts (title, slug, content, status, published_at)
values ('Deneme', 'deneme', 'Merhaba', 'published', now());
```

Ardından proje kökünde:

```bash
node --env-file=.env.local --input-type=module -e "import { createClient } from '@supabase/supabase-js'; const s = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY); const posts = await s.from('posts').select('slug,status'); const drafts = await s.from('posts').select('slug').eq('status','draft'); console.log({ posts, drafts });"
```

`posts` içinde yalnızca `published` satır görünmeli. `draft` sorgusu boş dönmeli. Bu, public anahtarın taslakları okuyamadığını gösterir.

Uygulama fonksiyonları henüz sayfalara bağlı değil. İleride `lib/supabase/queries.ts` içinden çağrılacak: `getPublishedPosts`, `getPostBySlug`, `getPublishedProjects`, `getProjectBySlug`, `getCategories`.
