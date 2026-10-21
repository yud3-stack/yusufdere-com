# Proje yönetimi

Bu aşama admin panelinden proje oluşturma, düzenleme, silme ve kapak görseli yüklemek içindir. Ana sayfa ve public `/projects` sayfaları hâlâ statik veriyi kullanır.

## Nasıl çalışır

- `/admin/projects` taslak ve yayındaki projeleri `updated_at` azalan sırada listeler.
- `/admin/projects/new` yeni proje açar. Varsayılan durum taslaktır.
- Kayıt başarılı olursa düzenleme sayfasına gidilir: `/admin/projects/[id]/edit`.
- **Taslak Kaydet** durumu `draft` yapar. **Yayınla** durumu `published` yapar.
- Silme yalnızca listeden, onay metninden sonra çalışır.
- Detay içeriği Markdown’dır. Blog editörü kullanılır. Bu aşamada proje içine görsel yüklenmez.
- Kapak görseli `project-covers` bucket’ına yüklenir. `cover_image` alanında Storage path tutulur, tam URL tutulmaz.
- Teknolojiler `text[]` alanında tutulur. Enter veya virgül ekler. Aynı teknoloji ikinci kez eklenmez.
- GitHub ve canlı demo adresleri boş bırakılabilir. Doluysa `http` veya `https` olmalıdır.

## Öne çıkan

`featured` bir onay kutusudur. Birden fazla proje öne çıkan olabilir. Bu aşamada sayı sınırı yoktur.

## Yayın tarihi

- İlk taslakta `published_at` boş kalır.
- İlk yayında `published_at` o anın zamanıdır.
- Yayındaki proje taslağa alınırsa `published_at` korunur. Public okuma politikası `status = published` istediği için proje anonim istekle görünmez.
- Tekrar yayınlanırsa eski `published_at` değişmez.
- `updated_at` veritabanı trigger’ı ile güncellenir. `created_at` güncellenmez.

## Yetki

İki kapı vardır. İkisi de geçilmeden yazma olmaz.

1. Uygulama: her kayıt, güncelleme ve silmede admin oturumu tekrar doğrulanır.
2. Veritabanı: `public.is_admin()` yalnızca `admin_users` içindeki kullanıcı için doğrudur. `authenticated` olmak yetmez.

Public proje okuma politikası değişmedi. Yalnızca yayındaki projeler anonim ve normal oturumla okunur. Admin, ek SELECT politikasıyla taslakları da görür.

## Kapak deposu

Bucket adı `project-covers`. Okuma herkese açıktır. Yazma yalnızca admin içindir.

İzin verilen türler: `image/jpeg`, `image/png`, `image/webp`, `image/avif`. SVG yoktur. Üst sınır 5 MB’tır.

Path:

```text
projects/{project-id}/{uuid}.webp
```

Yeni projede önce satır açılır, sonra dosya bu id altına yüklenir. Yükleme başarısız olursa yeni satır silinir. Kapak değiştirilirken önce yeni dosya yüklenir. Kayıt başarılı olursa eski dosya silinir. Kapak kaldırılınca `cover_image` boşalır, ardından dosya silinir. Proje silinince önce satır silinir, sonra kapak dosyası silinir. Depo temizliği başarısız olursa proje silinmiş kalır.

## Migration

Dosya: `supabase/migrations/20261019140000_admin_project_writes.sql`

Önceki migration dosyalarını değiştirme. `is_admin()` hazır olmalıdır.

Dashboard → **SQL Editor** → New query → dosyanın tamamını yapıştır → **Run**.

Bucket’ı ayrıca Dashboard’dan oluşturma. SQL bucket’ı ve politikaları ekler. Storage içinde `project-covers` public görünmelidir. Yeni bir public yazma politikası ekleme.

## Test

1. `/admin/projects` açılır. Boşsa “Henüz proje bulunmuyor.” görünür.
2. Taslak proje kaydedilir ve düzenleme sayfasına geçilir.
3. Anonim istek taslağı göremez.
4. Yayınlanan proje anonim istekte görünür.
5. Aynı slug ikinci kez kaydedilirse “Bu slug zaten kullanılıyor.” denir.
6. Düzenleme `updated_at` değerini günceller. `created_at` aynı kalır.
7. Yayındaki proje taslağa alınırsa anonim istekte kaybolur. `published_at` durur.
8. Kapak seçilir, önizleme görünür, kayıtta path `projects/...` olur.
9. Kapak değişince eski dosya bucket’tan kalkar.
10. Kapak kaldırılınca `cover_image` boşalır ve dosya silinir.
11. Proje silinince kapak dosyası da silinir.
12. Oturumsuz kullanıcı `project-covers` bucket’ına yükleyemez.
13. Admin olmayan oturum proje yazamaz ve kapak yükleyemez.
14. Yazı yönetimi, blog kapakları ve public blog eskisi gibi çalışır.
