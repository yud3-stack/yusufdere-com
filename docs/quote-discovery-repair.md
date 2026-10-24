# Kaynak taramasının ilerlemesi

Sorun: sabit Dijkstra önceliği, her çalışmada aynı ilk beş başarısız kaynak ve kısıtlı yazar/yayınevi listesi keşfi durduruyordu. Yönetici tarafından reddedilmiş kayıtlar korunur.

Veri: `quote_discovery_progress` tablosunda yazar başına sonraki kaynak indisi; `__catalog__` satırında yazar sırası ve son tarama özeti. Tablo yalnızca admin/service_role erişimine açık. Mevcut onay ve günlük yayın şeması korunur.

Akış: tanımlı on yazar arasından, havuzda az bulunanlara öncelik vererek dönüşümlü dört sayfa alınır. Yazar başına kaynak indisi kaldığı yerden devam eder. Kontroller yazarlar arasında sırayla paylaşılır. Aynı kaynak URL'si bir çalışma içinde tekrar indirilmez. Özgün metin eşleşmesi şartı korunur; erişilemeyen, metni uyuşmayan ve aynı kayıtlar ayrı sayılır. Başarısız kaynaklar sonraki kaynaklara ilerlemeyi engellemez.

Admin: son tarama, yazar sayısı ve çeviri bekleyen toplam görünür; mevcut tek sütun mobil düzeni korunur. Günlük yayının o güne sabitlenmesi değişmez.
