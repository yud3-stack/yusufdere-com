# Admin girişi

Bu aşama yalnızca e-posta ve şifre ile giriş, `/admin` koruması ve çıkış içindir. Blog, proje veya kategori düzenleme ekranı yoktur.

Giriş Supabase Auth üzerinden yapılır. Oturum `@supabase/ssr` ile çerezde tutulur. `service_role` veya secret key kullanılmaz. `ADMIN_EMAIL` sunucuda kalır; `NEXT_PUBLIC_` öneki almaz.

Supabase’e giriş yapmış olmak admin olmak anlamına gelmez. Sunucu, doğrulanmış kullanıcının e-postasını `ADMIN_EMAIL` ile karşılaştırır. Karşılaştırma baştaki ve sondaki boşlukları atar ve büyük-küçük harfi yok sayar. Eşleşmeyen oturum kapatılır.

## 1. Admin kullanıcısını oluştur

1. Supabase Dashboard → **Authentication** → **Users**.
2. **Add user** → **Create new user**.
3. Kendi e-posta adresini ve güçlü bir şifreyi yaz.
4. **Auto Confirm User** açık olsun. Böylece e-posta onay linki beklemeden giriş yapılabilir.
5. Kullanıcıyı kaydet. E-posta ve şifreyi koda veya bu dosyaya yazma.

## 2. E-posta ve şifre sağlayıcısı

1. **Authentication** → **Sign In / Providers** → **Email**.
2. Email provider açık olsun.
3. Google, GitHub veya magic link ekleme.
4. Bu kişisel admin hesabı için public kayıt gerekmez. **Authentication** → **Sign In / Providers** içinde yeni kullanıcı kaydını kapatabilirsin. Admin kullanıcısı Dashboard’dan oluşturulduğu için kayıt kapalıyken de giriş çalışır.

Site URL’si için **Authentication** → **URL Configuration**:

- Local: `http://localhost:3000`
- Canlı site: kendi domainin

Yönlendirme adresine dışarıdan gelen bir adres yazma. Uygulama girişten sonra yalnızca `/admin`, çıkıştan sonra yalnızca `/admin/login` adresine gider.

## 3. `ADMIN_EMAIL`

`.env.local` içindeki değer, Dashboard’da oluşturduğun kullanıcının e-postası olmalı. Aynı adresi büyük-küçük harf farklı yazsan da eşleşir. Boşluk bırakma.

Örnek biçim, gerçek adres olmadan:

```env
ADMIN_EMAIL=you@example.com
```

Bu değişken tarayıcıya gönderilmez.

## 4. `.env.local`

Proje kökünde `.env.local` şöyle durmalı. Değerleri Dashboard’dan kopyala. Secret veya `service_role` anahtarı ekleme.

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
ADMIN_EMAIL=you@example.com
```

Eski anon JWT, publishable key yoksa aynı `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` alanına yapıştırılabilir.

## 5. Local test

1. `.env.local` kayıtlı olsun.
2. `npm run dev`
3. `http://localhost:3000/admin` aç. Giriş yoksa `/admin/login` açılmalı.
4. Yanlış e-posta veya şifre: `E-posta veya şifre hatalı.`
5. Başka bir Supabase kullanıcısıyla giriş: panel açılmamalı, oturum kapanmalı, aynı hata görünmeli.
6. Dashboard’daki admin e-postası ve şifresi: `/admin` açılır. Yazı, `Hoş geldin, Yusuf.`
7. Sayfayı yenile. Panel açık kalmalı.
8. **Çıkış Yap**. `/admin/login` açılır. `/admin` tekrar login’e dönmeli.

## 6. Vercel

Project → **Settings** → **Environment Variables**. Production (ve kullanıyorsan Preview) için:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `ADMIN_EMAIL`

`ADMIN_EMAIL` değerini “Sensitive” olarak işaretleyebilirsin. Deploy sonrası değişkenler ancak yeni bir deployment ile uygulanır.

Canlı domaini Supabase **URL Configuration** içindeki Site URL ile aynı tut.
