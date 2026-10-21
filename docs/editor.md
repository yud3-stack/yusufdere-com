# Admin Markdown editörü

Admin yazı formu düz metin alanı yerine CodeMirror 6 kullanır. Kayıt hâlâ `posts.content` içinde düz Markdown string olarak durur. WYSIWYG editör yoktur.

## Editör

Paketler:

- `@uiw/react-codemirror` — React sarmalayıcısı
- `@codemirror/lang-markdown` — Markdown sözdizimi
- `@codemirror/view`, `@codemirror/state`, `@codemirror/language`, `@codemirror/commands` — CodeMirror 6 çekirdeği

Editör açık temadadır, tam genişliktedir ve yaklaşık 680px yüksekliktedir. Satırlar yatay kaydırma olmadan sarılır. Kısayollar yalnızca editör odaktayken çalışır: Ctrl/Cmd+B kalın, Ctrl/Cmd+I italik, Ctrl/Cmd+K bağlantı.

Üstteki araç çubuğu seçili metne uygulanır: H2, H3, kalın, italik, bağlantı, liste, numaralı liste, alıntı, satır içi kod, kod bloğu, tablo ve görsel. H1 düğmesi yoktur; yazı başlığı sayfanın `h1` öğesidir.

Önizleme editörün altındadır ve public yazı sayfasıyla aynı `Markdown` bileşenini kullanır.

Kelime sayısı ve okuma süresi yalnızca formda görünür. Veritabanına yazılmaz. Yaklaşık 210 kelime bir dakikadır. Metin boşsa yalnızca `0 kelime` gösterilir.

## Görsel ekleme

Görsel düğmesi dosya, alt metin ve isteğe bağlı açıklama ister. Alt metin boş bırakılabilir. Açıklama yoksa Markdown şöyledir:

```markdown
![alt](https://.../storage/v1/object/public/post-assets/posts/{id}/{uuid}.webp)
```

Açıklama varsa standart title alanı kullanılır:

```markdown
![alt](url "açıklama")
```

Public renderer title varsa `figure` ve `figcaption` üretir. Alt metin `img` alt attribute olur. Görsel yüzde yüz genişlikte, yüksekliği otomatik ve köşeleri yuvarlaktır.

Panodan yapıştırılan görsel (örneğin Snipping Tool) doğrulanır, yüklenir ve imlecin olduğu yere eklenir. Düz metin yapıştırma değişmez. Editöre bırakılan görsel, bırakılan konuma yakın yere eklenir. Görsel olmayan dosya reddedilir.

Yükleme sırasında `Görsel yükleniyor...` görünür. Aynı dosya için ikinci yükleme başlatılmaz.

Hata metinleri:

- `Bu dosya türü desteklenmiyor.`
- `Görsel 5 MB'dan küçük olmalıdır.`
- `Görsel yüklenirken bir hata oluştu.`

## Yeni yazı

`/admin/posts/new` sayfasında yazının henüz id’si yoktur. İlk görsel eklenirken başlık boşsa taslak açılmaz ve `Yazıya görsel eklemeden önce başlık gir.` denir.

Başlık ve slug geçerliyse formdaki mevcut alanlarla taslak oluşturulur, görsel `posts/{yeni-id}/` altına yüklenir, Markdown imlece eklenir ve form `/admin/posts/{id}/edit` adresine geçer. Kullanıcıdan önce elle taslak kaydetmesi istenmez.

## `post-assets`

Bucket adı `post-assets`. Okuma herkese açıktır. Yazma yalnızca `public.is_admin()` ile `admin_users` içindeki admin içindir. Giriş yapmış olmak yeterli değildir. `service_role` kullanılmaz.

İzin verilen türler: `image/jpeg`, `image/png`, `image/webp`, `image/avif`. SVG yoktur. Üst sınır 5 MB’tır. Sınır bucket kaydında ve sunucuda vardır. Sunucu ayrıca dosya baytlarını kontrol eder.

Path sunucuda üretilir:

```text
posts/{post-id}/{uuid}.webp
```

İstemciden gelen dosya adı, MIME veya path kabul edilmez. Yazı kaydı yoksa yükleme yapılmaz. Başka bir yazının klasörüne keyfi yükleme veya silme yoktur.

## Path ve public URL

`cover_image` bir veritabanı alanıdır ve Storage path tutar. Adres `coverImageUrl()` ile üretilir.

Yazı içi görsel Markdown sözdiziminin beklediği adres olduğu için `post-assets` public URL’si Markdown içine yazılır. Bu adres yalnızca `postAssetPublicUrl()` / `storagePublicUrl()` ile üretilir. Şema değişmez.

## Silme

Yazı silinince satır silinir, ardından `blog-covers` kapağı ve `post-assets/posts/{post-id}/` altındaki eşleşen görseller silinir. Depo temizliği başarısız olursa yazı silinmiş kalır. Kullanıcıya yazı duruyormuş gibi bir hata gösterilmez.

Markdown’dan elle silinen bir görselin dosyası bu aşamada silinmez. Kullanılan bir dosyayı yanlışlıkla kaldırma riski vardır. Kullanılmayan dosya temizliği ayrıca yapılabilir.

## Migration

Dosya: `supabase/migrations/20261017050000_post_assets_storage.sql`

Önceki migration dosyalarını değiştirme. `is_admin()` hazır olmalıdır.

Dashboard → **SQL Editor** → New query → dosyanın tamamını yapıştır → **Run**.

CLI bağlıysa:

```bash
supabase db push
```

Bucket’ı ayrıca Dashboard’dan oluşturma. SQL bucket’ı ve politikaları ekler. Storage içinde `post-assets` public görünmelidir. Yeni bir public yazma politikası ekleme.
