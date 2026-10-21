# Blog kapak görselleri

Bu aşama yalnızca yazı kapak görseli yüklemek içindir. Public site hâlâ veritabanına bağlı değildir. Proje görselleri ve yazı içine görsel ekleme yoktur.

## Bucket

Adı `blog-covers`. Bucket herkese açıktır çünkü yayındaki kapaklar sitede görünecek. Açık olması yazma izni vermez.

İzin verilen türler: `image/jpeg`, `image/png`, `image/webp`, `image/avif`. SVG yoktur. Üst sınır 5 MB’tır. Bu sınır hem bucket kaydında hem sunucuda kontrol edilir.

## RLS

`storage.objects` politikaları `public.is_admin()` kullanır. Bu fonksiyon yalnızca `admin_users` tablosundaki kullanıcı için doğrudur. Giriş yapmış olmak yeterli değildir.

- Herkes kapak dosyasını görüntüleyebilir.
- Yükleme, değiştirme ve silme yalnızca admin içindir.
- Yazma yolu `posts/` klasörüyle sınırlıdır.

Uygulama her yükleme ve silmede admin e-postasını da tekrar doğrular. İstemciden gelen dosya adı veya path kullanılmaz.

## Dosya adı

Sunucu şu biçimi üretir:

```text
posts/{post-id}/{uuid}.jpg
```

Uzantı, dosyanın gerçek baytlarına göre `jpg`, `png`, `webp` veya `avif` olur. Orijinal dosya adı path’e girmez.

## `cover_image`

Kolonda tam URL tutulmaz. Storage path tutulur. Örnek:

```text
posts/6f1c.../9b2a....webp
```

Görüntülenecek adres `coverImageUrl()` ile üretilir. Eski kayıtlarda kalan `http` adresleri olduğu gibi bırakılır. Böylece bucket adresi değişirse path kayıtları bozulmaz.

Yeni yazıda önce yazı kaydı açılır ve id alınır. Dosya ancak bundan sonra yüklenir. Yükleme veya kapak güncellemesi başarısız olursa yeni yazı ve yüklenen dosya geri alınır. Böylece kapaksız yarım yazı ve boşta dosya bırakılmaz.

Var olan kapak değiştirilirken önce yeni dosya yüklenir. Veritabanı güncellenemezse yeni dosya silinir, eski kapak durur. Güncelleme başarılı olursa eski dosya silinir. Eski dosya silinemezse yazı yeni kapakla kalır ve “Eski görsel depodan silinemedi.” mesajı görünür.

Kapak kaldırılınca `cover_image` boşaltılır, ardından dosya silinir.

Yazı silinince önce satır silinir. Depo temizliği bundan sonra denenir. Depo silinemezse yazı silinmiş kalır; kullanıcıya yazı duruyormuş gibi bir hata gösterilmez. Nadiren boşta bir dosya kalabilir.

## Migration

Dosya: `supabase/migrations/20261017040000_blog_covers_storage.sql`

Önceki migration dosyalarını değiştirme. `admin_users` ve `is_admin()` bu dosyadan önce hazır olmalı.

Dashboard → **SQL Editor** → New query → dosyanın tamamını yapıştır → **Run**.

CLI bağlıysa:

```bash
supabase db push
```

Bucket’ı ayrıca Dashboard’dan oluşturmana gerek yok. SQL bucket’ı ve politikaları ekler. Dashboard → **Storage** içinde `blog-covers` görünmelidir. Public işaretli olur. Yeni bir public yazma politikası ekleme.

## Test

1. Admin panelinde JPG, PNG, WebP veya AVIF seç. Dosya adı ve önizleme görünsün. Kaydet. `cover_image` `posts/...` path’i olsun.
2. 5 MB üzerindeki dosyayı seç. “Dosya 5 MB'dan küçük olmalıdır.”
3. PDF veya SVG seç. “Bu dosya türü desteklenmiyor.”
4. Oturumsuz veya admin olmayan bir istekle `blog-covers` bucket’ına yükleme dene. Reddedilmeli.
5. Kapağı değiştir. Yeni görsel görünsün. Eski dosya bucket’tan kalksın.
6. Görseli kaldır. `cover_image` boş olsun. Dosya bucket’tan kalksın.
7. Yazıyı sil. Satır ve kapak dosyası kalksın.
8. Kapaksız yazı oluşturma, düzenleme, yayınlama ve giriş akışı eskisi gibi çalışsın.

Yazı içindeki görseller `blog-covers` bucket’ına girmez. Onlar `post-assets` bucket’ındadır. Ayrıntı `docs/editor.md` içindedir.
