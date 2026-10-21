export const categories = [
  {
    name: "Web Development",
    slug: "web-development",
  },
];

export const posts = [
  {
    title: "8 Projeden Sonra Vercel: Neden Kullanıyorum, Artıları ve Eksileri",
    slug: "8-projeden-sonra-vercel-neden-kullaniyorum-artilari-ve-eksileri",
    excerpt:
      "8 farklı projede Vercel kullandıktan sonra neden tercih ettiğimi, ücretsiz plan deneyimimi ve karşılaştığım artı-eksi yönleri anlatıyorum.",
    categorySlug: "web-development",
    tags: ["Vercel", "Deployment", "Hosting", "Next.js"],
    status: "published",
    publishedAt: "2026-10-17T12:00:00+03:00",
    coverImage: null,
    content: `Vercel’i ilk kez Mayıs ayında kullanmaya başladım. O zamana kadar web projelerimi yayınlamak için genellikle klasik hosting yöntemini kullanıyordum: domain ve hosting satın alıyor, ardından projeyi cPanel üzerinden yayına alıyordum.

Bu yöntem çalışıyordu ama özellikle React ve Next.js gibi teknolojilerle küçük projeler geliştirirken bana gereğinden fazla uğraştırıcı gelmeye başlamıştı. Zaten kodlarımı GitHub’da tutuyordum. Bir projeyi güncellediğimde GitHub’a gönderip ardından ayrıca hosting tarafıyla uğraşmak çok anlamlı gelmiyordu.

Vercel’i ilk olarak Travel Ticket projemde denedim. GitHub hesabımı bağlayıp repository’yi seçtikten sonra projenin doğrudan deploy edilebildiğini görünce benim için asıl fark burada ortaya çıktı.

Bugün Vercel üzerinde 8 farklı projem yayında ve yeni bir web projesi geliştirirken deployment tarafında ilk baktığım seçenek hâlâ Vercel.

## Vercel’den Önce Ne Kullanıyordum?

Vercel’den önce projelerimi yayınlamak için çoğunlukla domain ve hosting satın alıyordum. Hosting tarafında cPanel kullanıyor, projenin dosyalarını buradan yönetiyordum.

cPanel’in kötü olduğunu düşünmüyorum. Hatta projenin yapısına göre hâlâ daha mantıklı bir tercih olabilir. Ancak benim geliştirdiğim projelerin büyük kısmı React veya Next.js tabanlı küçük ve orta ölçekli uygulamalar olduğu için çoğu zaman klasik hosting bana ekstra bir avantaj sağlamıyordu.

Vercel’i kullanmaya başladıktan sonra fark ettiğim şeylerden biri de her proje için ayrıca hosting satın almak zorunda olmadığım oldu. Kendi domainimi veya subdomain’imi Vercel’deki projeme bağlayabiliyorum ve hosting tarafını ayrıca yönetmem gerekmiyor.

Özellikle sürekli farklı projeler deneyen biri için bu hem daha pratik hem de daha az uğraştırıcı bir çalışma şekli.

## Neden Vercel Kullanmaya Devam Ediyorum?

Ben projelerimi zaten GitHub’da tutuyorum. Bunun iki nedeni var: kodlarımı kaybetmemek ve yaptığım projeleri GitHub profilimde gösterebilmek.

Vercel’in benim için en kullanışlı tarafı da burada başlıyor. Yeni bir proje yayınlamak istediğimde dosyaları ayrıca bir sunucuya göndermem gerekmiyor. GitHub hesabımı Vercel’e bağlıyorum, yayınlamak istediğim repository’yi seçiyorum ve proje birkaç adımda deploy edilebiliyor.

Projede environment variable kullanıyorsam \`.env\` içindeki gerekli değerleri Vercel’e ekliyorum. Bunun dışında çoğu projede ayrıca uzun bir deployment süreciyle uğraşmıyorum.

Daha sonra projede bir değişiklik yaptığımda kodu GitHub’a push etmem yeterli oluyor. Vercel yeni commit’i algılayıp projeyi tekrar build ediyor ve yayındaki sürümü güncelliyor.

Benim açımdan Vercel’in en büyük avantajı tam olarak bu:

**Deployment ayrı bir iş olmaktan çıkıyor.**

Kodumu geliştiriyorum, GitHub’a gönderiyorum ve yayınlama sürecinin büyük kısmı otomatik ilerliyor.

## Ücretsiz Plan Bana Yetiyor mu?

Şu ana kadar benim kullanımım için fazlasıyla yetti.

Bu yazıyı yazdığım sırada Vercel üzerinde 8 farklı projem yayında. Bunların arasında yusufdere.com, studio.yusufdere.com, requestlab.yusufdere.com, llmvoice.yusufdere.com, standartculture.com ve farklı subdomain’lerde çalışan projeler bulunuyor.

Bugüne kadar bu projeler nedeniyle ücretsiz planda beni rahatsız eden ciddi bir kısıtlamayla karşılaşmadım. Benim gibi kişisel projeler, portföy çalışmaları veya henüz yüksek trafik almayan uygulamalar geliştiren biri için ücretsiz plan oldukça kullanışlı.

Ancak burada önemli bir ayrım var:

**Benim projelerime yetmesi, her projeye yeteceği anlamına gelmiyor.**

Yüksek trafik alan, yoğun sunucu kaynağı kullanan veya farklı ihtiyaçları olan bir uygulamanın gereksinimleri çok daha farklı olabilir. Bu yüzden Vercel’i seçerken sadece “ücretsiz” olmasına değil, geliştirdiğiniz projenin ihtiyaçlarına da bakmak gerekiyor.

Benim mevcut kullanımımda ise ayrı bir hosting paketi satın almadan 8 farklı projeyi yayında tutabilmek, Vercel’i tercih etmemde önemli bir neden.

## Vercel’de Sevdiğim Taraflar

Vercel’i kullanmaya devam etmemin tek nedeni ücretsiz olması değil. Benim çalışma şeklime uyan birkaç özelliği var:

- **GitHub entegrasyonu:** Repository’yi bağladıktan sonra yaptığım push’lar otomatik olarak deploy ediliyor.
- **Domain ve subdomain yönetimi:** Aynı domain altında farklı projeleri ayrı subdomain’lerle kolayca yayınlayabiliyorum.
- **React ve Next.js ile uyumu:** Kullandığım teknolojilerle deployment tarafında ekstra uğraş çıkarmıyor.
- **Hızlı kurulum:** Küçük bir projeyi internete açmak için ayrıca sunucu veya dosya yönetimiyle uğraşmam gerekmiyor.

Bunların hiçbiri tek başına Vercel’i “en iyi hosting çözümü” yapmıyor. Ancak benim kullandığım teknoloji yığını ve geliştirdiğim projelerin ölçeği düşünüldüğünde işleri oldukça kolaylaştırıyor.

## Peki Kötü Tarafları Yok mu?

Var.

Benim şu ana kadar en çok uğraştıran konu environment variable yönetimi oldu. Projede birkaç tane \`.env\` değeri varsa sorun değil ama sayı arttıkça bunları tek tek Vercel tarafına eklemek sıkıcı hale gelebiliyor.

Özellikle farklı environment’lar kullanan projelerde hangi değerin nerede kullanıldığını takip etmek dikkat istiyor.

Bir diğer konu veritabanı tarafı. Ben veritabanı ihtiyacımı genellikle Supabase veya Sanity gibi ayrı servislerle çözüyorum. Bu yüzden yapı bazen parçalı hale geliyor:

- Uygulama Vercel’de
- Veritabanı başka bir serviste
- Dosya depolama başka bir serviste olabilir

Küçük projelerde bu benim için büyük bir problem değil. Hatta çoğu zaman bu servislerin ücretsiz planları yeterli oluyor. Ama proje büyüdükçe birden fazla servisi birlikte yönetmek daha fazla takip gerektirebilir.

Ayrıca Vercel’i her proje için doğru seçenek olarak görmüyorum.

Sunucu üzerinde daha fazla kontrol gereken, farklı backend ihtiyaçları olan veya altyapının tamamen sizin yönetiminizde olmasını istediğiniz projelerde klasik VPS ya da başka bir hosting çözümü daha mantıklı olabilir.

Benim kullanımımda Vercel’in eksileri avantajlarının önüne geçmedi. Ama “React veya Next.js kullanıyorum, o zaman kesin Vercel kullanmalıyım” diye düşünmek de doğru değil.

## Bugün Yeni Bir Proje Açsam Yine Vercel Kullanır mıyım?

Büyük ihtimalle evet.

Ama artık her projeyi düşünmeden Vercel’e koymam. Projenin kapsamına, backend ihtiyacına, trafik beklentisine ve ne kadar kontrol istediğime göre karar veririm.

Kişisel bir proje, portföy sitesi, küçük bir SaaS denemesi veya React / Next.js tabanlı bir uygulama geliştiriyorsam ilk baktığım seçenek yine Vercel olur.

Çünkü kodumu zaten GitHub’da tutuyorum, deployment süreciyle ayrıca uğraşmak istemiyorum ve küçük projelerimde Supabase gibi servislerin ücretsiz planları da ihtiyaçlarımı karşılıyor.

Benim için Vercel’in en büyük avantajı aslında tek bir özelliği değil.

**Projeyi internete yayınlama işini, projenin kendisinden daha büyük bir mesele haline getirmemesi.**

Şu ana kadarki 8 projelik kullanımımda da beni başka bir çözüme geçmeye zorlayacak bir problem yaşamadım.

Yarın daha büyük veya farklı ihtiyaçları olan bir proje geliştirirsem tercihim değişebilir. Ama bugün yeni bir kişisel web projesi açsam, yaklaşık %90 ihtimalle yine Vercel ile başlarım.`,
  },
];

export const projects = [
  {
    title: "LLMVoice",
    slug: "llmvoice",
    description:
      "Windows’ta tamamen yerel çalışan, XTTS-v2 tabanlı ses klonlama ve metinden sese üretim aracı.",
    technologies: ["Python", "XTTS-v2", "PyTorch", "Tauri", "FFmpeg"],
    githubUrl: "https://github.com/yud3-stack/LLMVoice",
    liveUrl: "https://llmvoice.yusufdere.com/",
    featured: true,
    status: "published",
    publishedAt: null,
    coverImage: null,
    content: `## LLMVoice Nedir?

LLMVoice, metinleri yerel olarak sese dönüştürmek ve referans sesler üzerinden ses klonlama yapmak için geliştirdiğim Windows odaklı bir projedir.

Projenin temel amacı, bulut tabanlı bir API kullanmadan ses üretimini tamamen kullanıcının kendi bilgisayarında gerçekleştirebilmek.

## Nasıl Çalışıyor?

LLMVoice, metni doğal parçalara ayırdıktan sonra XTTS-v2 ile ses üretimi yapıyor ve oluşan parçaları birleştirerek ses çıktısı oluşturuyor.

İlk model kurulumu tamamlandıktan sonra sentez işlemleri çevrimdışı çalışabiliyor.

## Kullandığım Teknolojiler

- Python
- XTTS-v2
- PyTorch
- Tauri
- FFmpeg

Projenin hem komut satırı arayüzü hem de masaüstü studio tarafı bulunuyor.

> Not: Proje kaynak kodu ile kullanılan model ağırlıklarının lisans koşulları birbirinden farklı olabilir.`,
  },
  {
    title: "ReklamPilot",
    slug: "reklampilot",
    description:
      "Instagram içerik planlama, Meta reklam yönetimi ve yapay zekâ destekli içerik değerlendirme akışlarını tek panelde birleştirmeyi hedefleyen reklam yönetim platformu.",
    technologies: ["TypeScript", "NestJS", "React", "PostgreSQL", "Prisma", "Meta Graph API", "NVIDIA NIM"],
    githubUrl: null,
    liveUrl: null,
    featured: true,
    status: "published",
    publishedAt: null,
    coverImage: null,
    content: `## ReklamPilot Nedir?

ReklamPilot, bir işletmenin Instagram içeriklerini planlayabilmesi, organik içerik performansını takip edebilmesi ve Meta reklam süreçlerini tek bir panel üzerinden yönetebilmesi için geliştirdiğim bir reklam yönetim platformu.

Projede amacım yalnızca bir sosyal medya planlama aracı yapmak değil; içerik üretimi, yayınlama, performans değerlendirmesi ve reklam kararlarını birbirine bağlayan daha bütünlüklü bir sistem oluşturmak.

Proje halen geliştirme aşamasında.

## İçerik Planlama

Platform üzerinden işletmeye ait içerikler hazırlanabiliyor, medya dosyaları yüklenebiliyor ve Instagram için ileri tarihli yayın planı oluşturulabiliyor.

Zamanı gelen içerikler backend tarafındaki zamanlanmış görevler tarafından işleniyor.

İçerik yayınlanmadan önce yapay zekâ destekli bir değerlendirme akışı da bulunuyor. Görsel ve video içerikler yayın öncesinde analiz edilerek içerikle ilgili ek bilgiler üretilebiliyor.

## Meta Entegrasyonu

ReklamPilot'un Meta tarafında OAuth tabanlı bir bağlantı sistemi bulunuyor.

Kod seviyesinde şu akışlar bulunuyor:

- Facebook sayfası ve Instagram hesabı bağlantısı
- Reklam hesabı seçimi
- Instagram içerik yayını
- Reels, carousel ve hikâye yayınlama akışları
- İçerik performans verilerinin alınması
- Meta kampanyalarının listelenmesi
- Reklam oluşturma
- Reklam onaylama
- Reklamı aktif hale getirme
- Reklam durdurma

Reklam onayı ile reklamın gerçekten aktif hale gelmesi birbirinden ayrı tutuluyor. Böylece bir reklam onaylanmış olsa bile ayrıca aktivasyon işlemi yapılmadan harcama başlamıyor.

## Yapay Zekâ Tarafı

Projede NVIDIA servislerini kullanan birkaç farklı yapay zekâ akışı bulunuyor.

Bunlardan biri içeriklerin yayın öncesi değerlendirilmesi.

Video içeriklerde ses ve medya analizi için ffmpeg / ffprobe tabanlı bir hazırlık süreci bulunuyor.

Ayrıca reklam stüdyosunda farklı reklam metni varyantları oluşturmak ve görsel üretim tarafında NVIDIA tabanlı modelleri kullanmak için ayrı servisler bulunuyor.

## Reklam Yönetimi

Panelde Meta üzerinden alınan reklam kampanyaları görüntülenebiliyor.

Reklam stüdyosu üzerinden yeni reklam taslakları hazırlanabiliyor ve seçilen varyantlardan Meta tarafında reklam oluşturulabiliyor.

Reklam akışı özellikle bilinçli olarak birkaç aşamaya ayrıldı:

1. Reklam taslağının hazırlanması
2. Reklamın oluşturulması
3. Kullanıcı onayı
4. Reklamın aktive edilmesi
5. Gerekirse reklamın durdurulması

Bu yapı sayesinde bütçe harcayan işlemler doğrudan otomatik olarak başlatılmıyor.

## Teknik Mimari

Backend tarafında NestJS kullanıyorum.

Panel React ve Vite ile geliştiriliyor.

Veri katmanında PostgreSQL ve Prisma bulunuyor.

Ana backend modülleri arasında:

- Authentication
- Businesses
- Contents
- Campaigns
- Meta integrations
- Managed Ads
- Image Generation

bulunuyor.

Kullanıcıların işletmeler içindeki yetkileri OWNER, MANAGER ve VIEWER rolleri üzerinden kontrol ediliyor.

Backend tarafında içerik yayınlama, insight senkronizasyonu ve reklam senkronizasyonu için zamanlanmış işler de bulunuyor.

## Şu Anki Durum

ReklamPilot halen aktif olarak geliştirdiğim projelerden biri.

Temel backend, panel, veritabanı yapısı ve Meta / AI entegrasyonlarının önemli bölümü kod seviyesinde bağlı durumda.

Ancak Meta ve NVIDIA gibi dış servislerle çalışan akışların tamamı henüz production ortamında uçtan uca doğrulanmış değil.

Özellikle geliştirmeye devam ettiğim konular arasında:

- çoklu Facebook sayfası ve reklam hesabı seçimi
- AI öneri sisteminin gerçek karar motoruna bağlanması
- işletme ayarlarının genişletilmesi
- medya altyapısının production ortamına uygun hale getirilmesi
- görsel üretim işlemlerinin arka plan işlerine taşınması
- uçtan uca testlerin eklenmesi

bulunuyor.

Bu nedenle projeyi bitmiş bir SaaS ürünü olarak değil, üzerinde çalışmaya devam ettiğim kapsamlı bir ürün geliştirme projesi olarak görüyorum.`,
  },
  {
    title: "RequestLab",
    slug: "requestlab",
    description:
      "API hatalarını maskeleyerek kaydeden, dashboard’da incelemeyi ve test ortamında güvenli biçimde yeniden çalıştırmayı sağlayan geliştirici aracı.",
    technologies: ["TypeScript", "React", "Fastify", "PostgreSQL", "Prisma", "BullMQ", "Redis", "TanStack Query"],
    githubUrl: null,
    liveUrl: null,
    featured: true,
    status: "published",
    publishedAt: null,
    coverImage: null,
    content: `## RequestLab Nedir?

RequestLab, gerçek uygulamalardan gelen API isteklerini ve hataları kaydetmek, incelemek ve gerektiğinde development, test veya staging ortamında yeniden çalıştırmak için geliştirdiğim bir developer tool.

Projeyi geliştirirken temel amacım sadece HTTP request loglayan bir panel yapmak değildi. Özellikle gerçek uygulamalardan gelen verilerde hassas bilgilerin korunması ve replay işleminin güvenli sınırlar içinde tutulması üzerine yoğunlaştım.

## Event Ingestion

RequestLab API isteklerini event olarak sisteme alıyor.

Event oluşturulurken proje ve \`externalEventId\` bazında tekillik kontrolü uygulanıyor. Environment bilgisinin de ilgili API key ile aynı projeye ait olması gerekiyor.

Ingestion işlemi API key üzerinden yapılıyor.

Ayrıca request içindeki bazı hassas alanlar kaydedilmeden önce otomatik olarak maskeleniyor.

Örneğin:

- Authorization
- Cookie
- password
- token

gibi değerler \`[REDACTED]\` olarak saklanıyor.

Header ve JSON body için de boyut limitleri bulunuyor.

## Dashboard

Frontend tarafı React ve Vite ile geliştiriliyor.

Panel üzerinden:

- projeler
- environment'lar
- event listesi
- event detayları
- istatistikler
- API key bilgileri
- replay işlemleri

görüntülenebiliyor.

Veri çekme ve cache yönetiminde TanStack Query kullanılıyor.

## Güvenli Replay Sistemi

RequestLab’in önemli parçalarından biri başarısız bir API isteğini test ortamında yeniden çalıştırabilmek.

Replay sırasında kullanıcı serbest bir URL yazmıyor.

Hedef URL:

- environment içindeki \`baseUrl\`
- request method
- request path

üzerinden oluşturuluyor.

Replay işlemleri BullMQ ve Redis üzerinden kuyruğa alınıyor.

Worker tarafında güvenlik amacıyla:

- private IP hedefleri
- tehlikeli header’lar
- kontrolsüz redirect’ler
- istenmeyen HTTP/HTTPS hedefleri

için kısıtlamalar bulunuyor.

Bu yapı replay mekanizmasının SSRF gibi güvenlik problemlerine açık hale gelmesini önlemek için tasarlandı.

## Yetkilendirme

Projede işletme/proje üyeliğine bağlı rol kontrolü bulunuyor.

Kod seviyesinde:

- OWNER
- ADMIN
- VIEWER

rolleri kullanılıyor.

API key oluşturma yalnızca OWNER ve ADMIN tarafından yapılabiliyor.

VIEWER rolündeki kullanıcılar replay başlatamıyor.

Tam kullanıcı kayıt ve login sistemi ise henüz projede tamamlanmış değil.

Production tarafında mevcut yapı demo session token veya geliştirme ortamında özel user id header’ı üzerinden kimlik oluşturuyor.

## Demo API

RequestLab içinde sistemin nasıl çalıştığını göstermek için ayrı bir demo API de bulunuyor.

Demo API şu tür örnek endpoint'ler içeriyor:

- ürün listeleme
- sipariş oluşturma
- login senaryosu
- yavaş request senaryosu

Node SDK tarafında Fastify hook üzerinden event’ler RequestLab’e gönderiliyor.

Event gönderimi başarısız olsa bile demo uygulamanın ana isteğini durdurmaması için fail-open yaklaşımı kullanılıyor.

## Teknik Mimari

Proje pnpm workspace yapısında geliştiriliyor.

Ana parçalar:

### Frontend

React

Vite

React Router

TanStack Query

React Hook Form

### Backend

Fastify

TypeScript

Zod

### Data

PostgreSQL

Prisma

### Replay Infrastructure

BullMQ

Redis

undici

Projede frontend, API ve replay worker birbirinden ayrılmış durumda.

Deployment dokümantasyonunda frontend için Vercel, API ve demo API için Render kullanımı tanımlanmış.

## Şu Anki Durum

RequestLab’in event ingestion, masking, dashboard, replay kuyruğu ve replay güvenlik kontrolleri kod seviyesinde bağlı durumda.

README içinde production smoke ve Redis replay testlerinin geçtiği belirtiliyor ancak bu portföy incelemesi sırasında bu testler yeniden çalıştırılmadı.

Henüz tamamlanmamış veya yeniden doğrulanması gereken taraflar arasında:

- gerçek kullanıcı kayıt/login sistemi
- canlı production domain doğrulaması
- production Redis ve database doğrulaması
- browser tabanlı görsel regresyon testleri
- maskelenmiş credential gereken replay senaryoları için ayrı secret provider

bulunuyor.

Bu nedenle projeyi bitmiş bir SaaS ürünü olarak değil, güvenli API hata analizi ve replay akışını araştırdığım aktif bir developer tool projesi olarak görüyorum.`,
  },
  {
    title: "WinSoundMixer",
    slug: "winsoundmixer",
    description:
      "Windows’taki uygulama seslerini ve oynatma cihazlarını yöneten, WebSocket üzerinden uzaktan komut alabilecek şekilde geliştirilmiş WinForms tabanlı masaüstü ses kontrol aracı.",
    technologies: ["C#", "WinForms", ".NET Framework", "CSCore", "CoreAudio", "Fleck", "WebSocket", "QRCoder"],
    githubUrl: "https://github.com/yusufdere55/winsoundmixer-project",
    liveUrl: null,
    featured: true,
    status: "published",
    publishedAt: null,
    coverImage: null,
    content: `## WinSoundMixer Nedir?

WinSoundMixer, Windows üzerinde çalışan uygulamaların ses seviyelerini ve oynatma cihazlarını tek bir masaüstü arayüzünden yönetmek için geliştirdiğim bir WinForms uygulaması.

Projeyi geliştirirken Windows'un ses oturumlarına doğrudan erişmek ve bunu yalnızca masaüstü arayüzüyle sınırlamayıp ağ üzerinden kontrol edilebilecek bir yapıya dönüştürmek istedim.

Bu nedenle uygulamanın içinde yerel ağ üzerinden JSON tabanlı komutlar kabul eden bir WebSocket sunucusu da bulunuyor.

## Uygulama Seslerini Yönetme

WinSoundMixer, Windows'taki aktif ses oturumlarını CSCore üzerinden okuyabiliyor.

Arayüzde aktif uygulamalar listeleniyor ve her uygulamanın ses seviyesi ayrı ayrı değiştirilebiliyor.

Ses oturumları belirli aralıklarla yeniden okunarak arayüz güncel tutuluyor.

Uygulama bazında:

- mevcut ses seviyesini görüntüleme
- ses seviyesini değiştirme
- sesi geçici olarak kapatma
- önceki ses seviyesine geri dönme

akışları bulunuyor.

Mute işlemi doğrudan WASAPI mute bayrağı yerine ses seviyesinin 0'a çekilmesi ve önceki değerin saklanması üzerinden uygulanıyor.

## Ses Cihazları

Uygulama yalnızca programların ses seviyelerini değil, Windows'taki playback cihazlarını da yönetebiliyor.

AudioSwitcher CoreAudio üzerinden mevcut oynatma cihazları listeleniyor.

Kullanıcı seçtiği cihazı Windows'un varsayılan oynatma cihazı olarak ayarlayabiliyor.

Bu sayede örneğin kulaklık ve hoparlör arasında geçiş yapmak için Windows ayarlarına ayrıca girmek gerekmiyor.

## WebSocket Kontrolü

WinSoundMixer içerisinde Fleck tabanlı bir WebSocket sunucusu bulunuyor.

Sunucu yerel IPv4 adresi ve uygulama ayarlarında belirlenen port üzerinden çalışacak şekilde tasarlanmış.

Kod seviyesinde desteklenen komutlar arasında:

- getAudioSessions
- setVolume
- getAudioDevices
- setDefaultDevice

bulunuyor.

Bu yapı sayesinde başka bir istemci Windows uygulamasındaki ses oturumlarını okuyabilecek veya değiştirebilecek bir protokole sahip oluyor.

WebSocket katmanında kullanıcı doğrulaması bulunmadığı için bu yapı güvenilen yerel ağ kullanımına göre tasarlanmış.

## QR ile Bağlantı

Uygulama bağlantı adresini QR kod olarak üretebiliyor.

QR içerisinde:

ws://IP:port

formatındaki WebSocket adresi yer alıyor.

Bu özellik, ayrı bir istemcinin bağlantı bilgisini elle yazmak yerine daha hızlı eşleştirilmesi amacıyla geliştirilmiş.

Mevcut GitHub deposunda tamamlanmış bir mobil istemci bulunmadığı için bu bölümü yalnızca bağlantı altyapısı olarak değerlendiriyorum.

## Arayüz ve Ayarlar

WinSoundMixer içerisinde masaüstü kullanımına yönelik bazı ek ayarlar da bulunuyor.

Bunlar arasında:

- Dark tema
- Light tema
- Türkçe
- İngilizce
- Almanca dil dosyaları
- WebSocket port ayarı
- Windows açılışında çalıştırma
- sistem tepsisi desteği

bulunuyor.

Ayarlar JSON dosyası üzerinden saklanıyor.

Windows başlangıcında çalıştırma tercihi ise kullanıcının HKCU Run kaydı üzerinden yönetiliyor.

## Teknik Mimari

Proje C# ve WinForms ile geliştirilmiş bir .NET Framework 4.7.2 uygulaması.

Ses oturumlarının yönetiminde:

CSCore

kullanılıyor.

Windows oynatma cihazlarının listelenmesi ve varsayılan cihaz değişiminde:

AudioSwitcher.AudioApi.CoreAudio

kullanılıyor.

Ağ katmanında:

Fleck

ile WebSocket sunucusu bulunuyor.

Diğer kullanılan bileşenler arasında:

- Newtonsoft.Json
- System.Text.Json
- QRCoder

yer alıyor.

## Şu Anki Durum

WinSoundMixer'ın temel masaüstü ses yönetimi, playback cihazı seçimi, WebSocket protokolü, QR bağlantısı ve uygulama ayarları kaynak kodda bağlı durumda.

Ancak bu portföy incelemesi sırasında proje yeniden build edilmedi veya Windows üzerinde çalıştırılarak doğrulanmadı.

Mevcut repoda tamamlanmış bir mobil istemci bulunmuyor.

Ayrıca otomatik güncelleme sistemi üzerinde çalışılmış olsa da mevcut updater akışı tamamlanmış bir production özelliği değil.

Kodda geliştirme ortamına bağlı kalan bazı noktalar da bulunuyor.

Bu nedenle projeyi bitmiş ticari bir ürün olarak değil, Windows ses API'leri, masaüstü geliştirme ve yerel ağ üzerinden uzaktan kontrol konularında geliştirdiğim bir masaüstü projesi olarak değerlendiriyorum.`,
  },
];
