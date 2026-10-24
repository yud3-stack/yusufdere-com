# Tamamlayıcı otomasyon

- Wikimedia: yapılandırılmış yazarın tam Wikiquote sayfasından Wikidata kimliği; P18 fotoğrafı; Commons imageinfo ile fotoğrafçı ve açık lisans. İsimle rastgele görsel araması yapılmaz. Lisansı veya kimliği belirsiz fotoğraf alınmaz. Portre eksikse baş harfler devam eder.
- MyMemory ücretsiz anonim GET API: İngilizce → Türkçe; geri çeviriyle temel kapsam, sayı ve olumsuzluk kontrolleri. Kota veya kontrol hatasında bekleyen kayıt korunur. Ücretli API, anahtar veya ücretli plana geçiş kullanılmaz.
- Kaynakta eşleşen, boş çevirili ve reddedilmemiş adaylar otomatik tamamlanır. Kontroller geçenler kullanıcının otomasyon talebiyle otomatik havuza alınır; makine çevirisi olduğu kaynak notunda görünür. Kesin doğruluk iddiası yoktur. Elle girilmiş çeviriler ve fotoğraflar ezilmez.
- Veri: adaylarda fotoğraf sayfası/lisans URL'si, otomatik onay işareti, son deneme ve sonuç notu. Mevcut günlük yayın anlık kopyası korunur. Yeni fotoğraf metaverisi sonraki yayınlarda kullanılır.
- Admin: otomasyonu elle tetikleme, otomatik sonucu görme ve düzeltme/ret. Mevcut mobil tek sütun kartları; fotoğraf önizlemesi ve kaynak bağlantıları.
- Bütçe: tek çalışma en çok 50 sn ağ süresi, en çok 2 çeviri; yeni kaynak tarama bütçesi 20 sn. Başarısız adaylar aynı gün tekrar tekrar ücretsiz kotayı tüketmez. QUOTE_AUTO_APPROVE=false ile elle onay moduna dönülebilir.
