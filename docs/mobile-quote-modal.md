# Mobil günün sözü düzeltmesi

Kullanıcı iOS Chrome'da karta basıldığında pencerenin açılmadığını bildirdi. Fiziksel iPhone'a erişim yok; ilk masaüstü Chrome kontrolünde eski pencere açılıyordu. Bu nedenle iOS'taki kesin hata nedeni doğrulanmış sayılmaz.

Pencere animasyonlu/perspektifli portre sahnesinin DOM ağacından çıkarılıp document.body altındaki bir React portalına taşındı. Açılma React state ile yönetilir; HTMLDialogElement.showModal çağrısına bağlı değildir. Yeni Modal bileşeni odağı içeride tutar, Escape/kapatma/arka plan tıklamasını yönetir, arka içeriği inert yapar ve kapanınca eski durumu geri getirir. iOS arka plan kaydırması için body konumu kilitlenir; kaydırma çubuğu boşluğu korunur. Güvenli ekran kenarları, dinamik viewport yüksekliği ve en az 44px paylaşım/kapatma hedefleri kullanılır.

Günün ISO tarih anahtarı locale.format() sıralamasına güvenmek yerine formatToParts ile oluşturulur. Farklı CLDR sürümlerinde MM/DD/YYYY üretilmesi kartın tarih doğrulamasını ve client render'ını bozamaz. Blob indirme bağlantısı tıklanmadan önce DOM'a eklenir.

Doğrulama:
- 390×844 ve 320×568 tarayıcı viewport'larında açılma, kapanma ve tekrar açılma.
- 320px görünümde pencere 16–304px sınırında, yatay taşma yok.
- Escape ve Tab/Shift+Tab odak döngüsü.
- Görsel hazırlandı ve gerçek PNG indirme olayı alındı.
- Mobil menüden Yazılar/Projeler geçişi ve LLMVoice proje seçimi.
- Tarih sıralaması regresyon testi, ESLint, TypeScript ve production build.

Bunlar responsive Chromium kontrolleridir; gerçek iOS/WebKit testi yerine geçmez. Telefon üzerindeki tekrar kontrolü hâlâ gerekir.
