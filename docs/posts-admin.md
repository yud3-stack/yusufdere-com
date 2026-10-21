# Yazı yönetimi

Bu aşama admin panelinden yazı oluşturma, düzenleme ve silme içindir. Public site hâlâ veritabanına bağlı değildir. Proje CRUD ve görsel yükleme yoktur.

## Nasıl çalışır

- `/admin/posts` taslak ve yayındaki yazıları `updated_at` azalan sırada listeler.
- `/admin/posts/new` yeni yazı açar. Varsayılan durum taslaktır.
- Kayıt başarılı olursa düzenleme sayfasına gidilir: `/admin/posts/[id]/edit`.
- Aynı form oluşturma ve düzenlemede kullanılır.
- **Taslak Kaydet** durumu `draft` yapar. **Yayınla** durumu `published` yapar. Yazı zaten yayındaysa düğmeler **Taslağa al** ve **Kaydet** olur.
- Silme yalnızca listeden, onay metninden sonra çalışır.
- İçerik Markdown’dır. Geniş ekranda yazı ve önizleme yan yanadır. Dar ekranda Yaz / Önizleme seçilir. Ham HTML render edilmez.
- Kapak görseli `blog-covers` bucket’ına yüklenir. Ayrıntı `docs/storage-setup.md` içindedir.
- Kategori isteğe bağlıdır. Formdaki **Yeni kategori ekle** alanı kategori oluşturur ve onu seçer.
- Etiketler `text[]` alanında tutulur. Enter veya virgül ekler. Aynı etiket ikinci kez eklenmez.

## Yayın tarihi

- İlk taslakta `published_at` boş kalır.
- İlk yayında `published_at` o anın zamanıdır.
- Yayındaki yazı taslağa alınırsa `published_at` korunur. Public okuma politikası `status = published` istediği için yazı sitede görünmez.
- Tekrar yayınlanırsa eski `published_at` değişmez.
- `updated_at` veritabanı trigger’ı ile güncellenir. `created_at` güncellenmez.

## Yetki

İki kapı vardır. İkisi de geçilmeden yazma olmaz.

1. Uygulama: Supabase `getUser()` ile kullanıcı doğrulanır. E-posta, sunucudaki `ADMIN_EMAIL` ile karşılaştırılır. Bu kontrol her kayıt, güncelleme, silme ve kategori ekleme işleminde tekrar yapılır. Yalnızca sayfa korumasına güvenilmez.
2. Veritabanı: `public.admin_users` tablosunda `user_id` olan hesap `public.is_admin()` ile admin sayılır. `posts` ve `categories` yazma politikaları bu fonksiyona bakar. `authenticated` olmak yazma yetkisi vermez.

`admin_users` tablosunda API için okuma veya yazma politikası yoktur. `anon` ve `authenticated` rollerinin tablo yetkisi de geri alınmıştır. Satır yalnızca SQL Editor üzerinden eklenir. İstemci `user_metadata` kullanılmaz.

Public yazı ve kategori okuma politikaları aynı kaldı. `projects` politikalarına dokunulmadı.

Taslak yazıları admin, ek SELECT politikasıyla görür. Public anahtar yalnızca `published` satırları okur.

## Migration

Dosya: `supabase/migrations/20261017030000_admin_post_writes.sql`

İlk migration dosyasını değiştirme. Yeni dosyayı bir kez çalıştır.

Dashboard → **SQL Editor** → New query → dosyanın tamamını yapıştır → **Run**.

CLI bağlıysa:

```bash
supabase db push
```

## Admin kaydı

Önce Authentication bölümünde admin kullanıcısı olsun. Sonra SQL Editor’da, kendi e-postanı yazarak:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where lower(email) = lower('you@example.com')
on conflict (user_id) do nothing;
```

`you@example.com` yerine Dashboard’daki kullanıcının adresini yaz. Bu adres `.env.local` içindeki `ADMIN_EMAIL` ile aynı kişi olmalı.

Satırı ekledikten sonra panelde çıkış yapıp tekrar gir. Eski oturumun JWT’si yeni yetkiyi taşımayabilir.

Kontrol:

```sql
select u.email
from public.admin_users as admin
join auth.users as u on u.id = admin.user_id;
```

## Senin yapman gerekenler

1. Yeni migration SQL’ini bir kez çalıştır.
2. `admin_users` satırını kendi kullanıcı id’nle ekle.
3. Çıkış yapıp tekrar gir.
4. `ADMIN_EMAIL` değerinin bu hesapla aynı olduğundan emin ol.

Başka bir Dashboard anahtarı ekleme. `service_role` kullanılmıyor.

## Test

1. Admin olarak `/admin/posts` aç. Taslak ve yayındaki yazılar listelenir. Liste boşsa “Henüz yazı bulunmuyor.” görünür.
2. Yeni taslak kaydet. `status` `draft`, `published_at` boş olur. Public sorgu bu satırı döndürmez.
3. Yazıyı yayınla. `published_at` dolar. Public `published` sorgusu satırı okuyabilir.
4. Aynı slug ile ikinci yazı kaydet. Sayfa çökmez. “Bu slug zaten kullanılıyor.” görünür.
5. Yazıyı düzenle. `updated_at` yenilenir. `created_at` aynı kalır.
6. Yayındaki yazıyı taslağa al. Public listeden kaybolur. `published_at` durur.
7. Sil’e basınca onay sorulur. Vazgeçilirse satır kalır. Onaylanınca silinir.
8. `admin_users` içinde olmayan bir hesapla doğrudan Supabase isteği yazma politikasına takılır.
9. Oturumu olmayan istek `requireAdmin()` ve RLS tarafından reddedilir.
