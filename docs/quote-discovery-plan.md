# Günün sözü: kaynak toplama ve onay

İlk sürümün planıdır. Kullanıcının sonraki “olabildiğince her şey otomatik” talebiyle çeviri ve fotoğraf adımları `quote-automation-plan.md` doğrultusunda otomatikleştirildi; güncel davranış için `daily-quote-sharing.md` dosyasına bak.

## Yapı
- `data/quote-sources.ts`: dar kapsamlı yazar listesi ve izinli özgün kaynak alan adları.
- `lib/quotes/discovery.ts`: Wikiquote API metnini adaylara ayırır; tartışmalı/kaynakçasız sözleri atlar. İzinli özgün kaynakta metin eşleşmesi arar. Doğrulama, yazar atfının kesin kanıtı sayılmaz; insan incelemesi zorunludur.
- `lib/quotes/store.ts`: mevcut Supabase entegrasyonunu kullanır. Sanity'ye geçiş yapılmaz.
- `lib/quotes/actions.ts`, `components/admin/QuoteReview.tsx`, `/admin/quotes`: kaynak toplama, çeviri, onay ve ret. Mobilde tek sütun; mevcut admin bileşenleri ve stilleri.
- `/api/cron/quotes`: CRON_SECRET ile günlük toplama; `/api/quotes/today`: yalnızca bugünün onaylanmış sözü.

## Veri / CMS şeması
- `quote_candidates`: tekilleştirilmiş özgün alıntı, çeviri, yazar, kaynak, keşif sayfası ve revizyonu, kaynak eşleşme durumu, portre kredisi, pending/approved/rejected.
- `quote_publications`: İstanbul tarihi başına tek kayıt; yayınlanan içeriğin JSON anlık kopyası. Onay değişiklikleri geçmiş yayını değiştirmez.
- RLS: adaylar yalnızca admin; günlük yayınlar herkese okunabilir. Güvenli RPC yalnızca gerçek bugünü oluşturur ve onaylı kayıt seçer; tarihle oynanarak gelecekteki yayınlar tüketilemez. İşlem kilidi eşzamanlı ziyaretlerde tek söz seçer.
- Son yayını en eski söz önce seçilir; kullanılmamışlar önceliklidir. Başlangıçtaki üç doğrulanmış söz migration ile hazır havuza alınır. DB erişilemezse mevcut yerel havuz çalışır.

## Otomasyon
Ücretsiz API'ler, sınırlandırılmış seri istekler, zaman aşımı, sabit kaynak listesi, güvenli yönlendirme politikası. Her günlük çalışmada en fazla iki yazar ve birkaç yeni aday. Tekrarlar onayı/çeviriyi ezmez. Cron hatası eski havuzu bozmaz. Yerelde admin düğmesi, Vercel'de günlük cron. Deployment ve DB bağlantısı ayrıca doğrulanır.
