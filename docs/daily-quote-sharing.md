# Günün sözü paylaşımı

Günlük yayın Supabase'deki `quote_candidates` tablosunun onaylı kayıtlarından seçilir. `data/quotes.ts` içindeki üç doğrulanmış söz başlangıçta veritabanına eklenir ve bağlantı kesildiğinde yerel yedek olarak kullanılır. Yeni yazarlar eklenirken özgün kaynak ve varsa lisanslı portre eklenmelidir.

Tarih Europe/Istanbul saatine göre belirlenir. İlk istekte o günün onaylı sözü `quote_publications` tablosuna anlık kopyasıyla kaydedilir; gün içinde onaylar değişse de aynı söz gösterilir. Kullanılmamış sözler önce, sonra son yayını en eski söz seçilir. Açık sekmeler 15 saniyede bir ve sekmeye geri dönüldüğünde tarihi kontrol eder. Tarih değiştiğinde paylaşım dosyası ve önizleme sıfırlanır. Var olan bir yayın, geçici API arızasında yerel yedekle değiştirilmez. Görsel üretmek için ücretli servis gerekmez.

## Kaynak toplama ve inceleme

`/admin/quotes` ekranında Bekleyenler, Onaylı havuz ve Reddedilenler bulunur. Hazırla düğmesi ve cron aynı ücretsiz akışı çalıştırır: Wikiquote Action API'si tanımlı on yazar arasından dönüşümlü dört sayfayı tarar. Havuzda az bulunan yazarlara üç sıra, dönüşümlü keşfe bir sıra ayrılır. Her yazarın sonraki kaynak indisi veritabanında saklanır; aynı başarısız ilk kaynaklar her çalışmada ilerlemeyi engellemez. Kaynakçasız, tartışmalı, yanlış atfedilmiş ve yazar hakkındaki sözlerin bölümleri elenir. Kaynak bağlantısı izinli yayınevlerinden birine ait olmalı ve erişilen metin alıntıyla eşleşmelidir. PDF veya JavaScript gerektiren kaynaklar okunamıyorsa atlanır; Dijkstra arşivinin eski PDF bağlantıları varsa resmî HTML transkripsiyonuyla denenir.

Kullanıcının otomasyon talebiyle otomatik mod varsayılan olarak açıktır. MyMemory anonim ücretsiz GET API'si İngilizce metni Türkçeye ve geri İngilizceye çevirir. Metin uzunluğu, Türkçe işaretleri, sayıların korunması, olumsuzluk ve geri çevirinin sözcük kapsamı kontrol edilir. Bu kontrolleri geçen kaynak eşleşmeli adaylar otomatik havuza alınır ve kaynak notunda “Otomatik Türkçe çeviri · MyMemory” görünür. Kesin anlam/atıf doğruluğu garanti edilmez; yönetici sonucu düzeltebilir veya reddedebilir. `QUOTE_AUTO_APPROVE=false` ile hazırlanan çeviriler elle onay bekler. Kota veya kalite hatası ücretli servise geçmez; kayıt bekler ve mevcut havuz devam eder. Anonim ücretsiz servis günlük 5000 karakter kotası ve istek başına 500 UTF-8 bayt sınırı uygular; diğer kullanıcılarla paylaşılan sunucu IP'si nedeniyle kullanılabilir kota daha az olabilir.

Fotoğraf için tam Wikiquote sayfasının Wikidata kimliği ve P18 kaydı kullanılır; rastgele isim araması yapılmaz. Commons imageinfo'dan fotoğrafçı, lisans ve kaynak sayfası alınır. Yalnızca tanınan CC BY, CC BY-SA, CC0 veya açık kamu malı kayıtları kabul edilir; ek kısıtlı veya belirsiz dosyalar atlanır. Fotoğraf ve lisans bağlantıları saklanır; modalda gösterilir. Portre bulunmuyorsa baş harfler kullanılır. Görsel fotoğraf kredisinde siyah beyaz/kırpma işlemi belirtilir.

Tekrar tarama, elle girilmiş çeviri/fotoğrafları veya ret kararını ezmez. Son güncelleme sürümüyle karşılaştırmalı kayıt, eşzamanlı editör değişikliklerini korur. Keşif sayfasının kalıcı Wikiquote revizyon bağlantısı saklanır ve modalda gösterilir.

## Kurulum ve günlük çalıştırma

1. `supabase/migrations/20261024210000_daily_quotes.sql`, ardından `20261024220000_quote_automation.sql` ve `20261024230000_quote_discovery_progress.sql` dosyalarını birer kez uygula. Üçü de bu çalışma sırasında mevcut Supabase projesine uygulanmıştır. Adaylar ve tarama ilerlemesi admin RLS ile korunur; ziyaretçiler yalnızca yayınları okuyabilir. Public RPC tarih parametresi kabul etmez.
2. `.env.example` içindeki `SUPABASE_SECRET_KEY` ve rastgele `CRON_SECRET` değerlerini sunucu ortamına ekle; `NEXT_PUBLIC_` öneki kullanma. Yerel ortam bu çalışma sırasında yapılandırılmıştır. Anahtarlar repoya eklenmez.
3. `vercel.json` günlük `03:00 UTC` (İstanbul 06:00) taraması tanımlar. Vercel Hobby çalışma dakikasını garanti etmez. Bu tarama yeni aday toplar; günlük sözün gece yarısında değişmesi taramaya bağlı değildir.
4. Canlıya alınırken aynı sunucu değişkenleri Vercel projesine eklenmelidir. Yerel geliştirme sunucusu Vercel cron'unu kendisi çalıştırmaz; yerelde admin düğmesini kullan.

Cron `/api/cron/quotes` adresini `Authorization: Bearer CRON_SECRET` ile çağırır. Yetkisiz çağrı 401 döner. Tarama seri istekler, izinli alan adları, kontrollü yönlendirmeler ve en fazla sekiz kaynak kontrolüyle sınırlandırılmıştır. Kontroller yazarlar arasında sırayla paylaşılır; aynı URL çalışma içinde bir kez indirilir. Yeni kaynak aramaya 20 saniye, toplam çalışmaya 50 saniye ağ bütçesi ayrılır. En fazla dört yeni aday ve iki otomatik tamamlama yapılır. Başarısız çeviriler 24 saat içinde yeniden otomatik denenmez. Hata eski yayınları etkilemez. Son tarama özeti ve çeviri bekleyen toplam panelde görünür. Kaynak/kota durumuna göre her gün yeni söz bulunacağı garanti edilmez.

`lib/quote-share-image.ts` tek bir Canvas şablonundan 1080 × 1920 PNG üretir. Referansın geometrik tırnakları, ince sans tipografisi ve siyah beyaz portre yerleşimi korunur. Kaynak, çeviri bilgisi, portre kredisi ve site adresi görselde bulunur. Portre yüklenemezse başka bir yüz yerine yazarın baş harfleri gösterilir.

Modal açılınca dosya hazırlanır; indirme, önizleme ve dosyayla paylaşım aynı PNG'yi kullanır. `/?soz=1` güncel görselin tam ekran kontrol adresidir.

- Tek “Görseli paylaş” düğmesi Web Share API üzerinden hazır PNG dosyasını telefonun paylaşım menüsüne verir. Uygulamayı kullanıcı seçer. Hedef uygulamayı veya Story/Durum ekranını web sitesi zorlayamaz; seçenekler cihaz ve uygulamaya bağlıdır. HTTPS veya API desteği yoksa nedeni gösterilir; paylaş düğmesi otomatik indirme yapmaz. Dosya yalnızca “Görseli indir” ile indirilir. canShare olmayan eski uygulamalarda share mevcutsa gerçek paylaşım denenir.
- Ayrı uygulama düğmeleri ve X/LinkedIn paylaşım linkleri kaldırılmıştır. “Görseli indir” ve “Metni kopyala” yardımcı seçenekleri korunur.
- Herkese açık paylaşım otomatik yayın yapmaz; son adımı kullanıcı tamamlar.

Kaynaklar: https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share ; https://developer.x.com/en/docs/x-for-websites/tweet-button/guides/web-intent ; https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html ; https://www.cs.utexas.edu/~EWD/transcriptions/EWD12xx/EWD1237.html
