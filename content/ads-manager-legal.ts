import type { Locale } from "@/lib/locale";

export type LegalSection = {
  title: string;
  paragraphs?: readonly string[];
  items?: readonly string[];
};

export type LegalDocumentContent = {
  eyebrow: string;
  title: string;
  description: string;
  appName: string;
  effectiveDateLabel: string;
  effectiveDate: string;
  contactLabel: string;
  contactEmail: string;
  sections: readonly LegalSection[];
};

const contactEmail = "hello@yusufdere.com";

export const privacyPolicyContent = {
  en: {
    eyebrow: "ADS Manager",
    title: "Privacy policy",
    description:
      "How ADS Manager collects, uses, stores and protects data received through Meta, Facebook and Instagram.",
    appName: "ADS Manager by Yusuf Dere",
    effectiveDateLabel: "Effective date",
    effectiveDate: "September 25, 2026",
    contactLabel: "Privacy contact",
    contactEmail,
    sections: [
      {
        title: "1. Scope",
        paragraphs: [
          "This privacy policy applies to ADS Manager, a service operated by Yusuf Dere in Samsun, Türkiye. ADS Manager helps authorized businesses connect their Meta assets, manage advertising, publish or schedule Instagram content and review performance data.",
          "This policy covers information processed through the ADS Manager website, Meta Platform, Facebook Login for Business, the Marketing API and the Instagram API.",
        ],
      },
      {
        title: "2. Information we process",
        paragraphs: [
          "We process only the information needed to provide the features you authorize. Depending on the permissions you grant, this may include:",
        ],
        items: [
          "Meta account and asset information, such as user, business portfolio, Facebook Page, Instagram professional account and ad account identifiers and names.",
          "OAuth access tokens used to connect to Meta services. Tokens are stored in encrypted form and are never your Facebook or Instagram password.",
          "Instagram content metadata, including media identifiers, captions, media URLs, timestamps and publishing status.",
          "Advertising information, including campaigns, ad sets, ads, targeting settings, budgets and delivery status.",
          "Performance data returned by Meta, such as spend, impressions, reach, clicks, video views, messages, leads or purchases when available for the selected objective.",
          "Operational records, including connection status, audit timestamps and technical error logs needed for security and troubleshooting.",
        ],
      },
      {
        title: "3. Information we do not collect",
        paragraphs: [
          "ADS Manager does not receive or store your Facebook or Instagram password. We do not receive or store complete payment-card details; advertising payments are handled by Meta and the payment provider connected to the relevant ad account.",
        ],
      },
      {
        title: "4. How we use information",
        items: [
          "Connect and display the Meta assets you choose to authorize.",
          "Schedule, publish and manage authorized Instagram content.",
          "Create, review and manage advertising objects and budgets on your behalf.",
          "Retrieve performance data and produce weekly or monthly analysis and recommendations.",
          "Secure the service, investigate errors, prevent misuse and comply with legal obligations.",
        ],
      },
      {
        title: "5. How information is shared",
        paragraphs: [
          "We may share information with Meta when required to perform an action you request, with infrastructure providers that are necessary to operate and secure the service, or with authorities when disclosure is legally required. Providers may process information only for the service they supply to us.",
          "We do not sell personal information or use connected business data for unrelated advertising.",
        ],
      },
      {
        title: "6. Retention and deletion",
        paragraphs: [
          "Access tokens are retained until the connection is removed, the token expires or authorization is revoked. Other connected-account, content and advertising data is retained only for as long as it is needed to provide the service, resolve disputes, maintain security or meet legal obligations.",
          "Verified deletion requests are normally completed within 30 days. Residual encrypted backups may remain for up to 90 days before being overwritten, unless a longer period is required by law. Instructions are available on our Data deletion page.",
        ],
      },
      {
        title: "7. Security",
        paragraphs: [
          "We use reasonable technical and organizational safeguards, including encrypted token storage, access controls, limited permissions and operational logging. No online system is completely risk-free, but we regularly review the controls appropriate to the data we process.",
        ],
      },
      {
        title: "8. Your choices and rights",
        paragraphs: [
          "You may disconnect ADS Manager from Meta, revoke permissions in your Meta settings, or ask us to access, correct or delete stored information. Depending on the law that applies to you, you may also have rights to restrict or object to processing and to submit a complaint to the relevant data-protection authority.",
        ],
      },
      {
        title: "9. Children",
        paragraphs: [
          "ADS Manager is a business service and is not intended for anyone under 18. We do not knowingly collect personal information from children.",
        ],
      },
      {
        title: "10. Changes and contact",
        paragraphs: [
          `We may update this policy as the service or legal requirements change. The effective date above shows the latest revision. For privacy questions or requests, contact ${contactEmail}.`,
        ],
      },
    ],
  },
  tr: {
    eyebrow: "ADS Manager",
    title: "Gizlilik politikası",
    description:
      "ADS Manager'ın Meta, Facebook ve Instagram üzerinden aldığı verileri nasıl topladığı, kullandığı, sakladığı ve koruduğu.",
    appName: "Yusuf Dere tarafından ADS Manager",
    effectiveDateLabel: "Yürürlük tarihi",
    effectiveDate: "25 Eylül 2026",
    contactLabel: "Gizlilik iletişimi",
    contactEmail,
    sections: [
      {
        title: "1. Kapsam",
        paragraphs: [
          "Bu gizlilik politikası, Samsun, Türkiye'de Yusuf Dere tarafından işletilen ADS Manager hizmeti için geçerlidir. ADS Manager, yetkili işletmelerin Meta varlıklarını bağlamasına, reklamlarını yönetmesine, Instagram içeriklerini yayınlamasına veya planlamasına ve performans verilerini incelemesine yardımcı olur.",
          "Bu politika; ADS Manager internet sitesi, Meta Platformu, İşletmeler için Facebook ile Giriş, Pazarlama API'si ve Instagram API'si üzerinden işlenen bilgileri kapsar.",
        ],
      },
      {
        title: "2. İşlediğimiz bilgiler",
        paragraphs: [
          "Yalnızca izin verdiğiniz özellikleri sunmak için gereken bilgileri işleriz. Verdiğiniz izinlere bağlı olarak bunlar şunları içerebilir:",
        ],
        items: [
          "Kullanıcı, işletme portföyü, Facebook Sayfası, Instagram profesyonel hesabı ve reklam hesabı kimlikleri ile adları gibi Meta hesabı ve varlık bilgileri.",
          "Meta hizmetlerine bağlanmak için kullanılan OAuth erişim belirteçleri. Belirteçler şifreli biçimde saklanır; Facebook veya Instagram şifreniz değildir.",
          "Medya kimlikleri, açıklamalar, medya URL'leri, zaman bilgileri ve yayın durumu dahil Instagram içerik meta verileri.",
          "Kampanyalar, reklam setleri, reklamlar, hedefleme ayarları, bütçeler ve yayın durumu dahil reklam bilgileri.",
          "Seçilen hedef için mevcut olduğunda harcama, gösterim, erişim, tıklama, video izleme, mesaj, potansiyel müşteri veya satın alma gibi Meta tarafından döndürülen performans verileri.",
          "Güvenlik ve sorun giderme için gereken bağlantı durumu, denetim zamanları ve teknik hata kayıtları.",
        ],
      },
      {
        title: "3. Toplamadığımız bilgiler",
        paragraphs: [
          "ADS Manager, Facebook veya Instagram şifrenizi almaz ve saklamaz. Tam ödeme kartı bilgilerinizi almaz veya saklamayız; reklam ödemeleri Meta ve ilgili reklam hesabına bağlı ödeme sağlayıcısı tarafından işlenir.",
        ],
      },
      {
        title: "4. Bilgileri nasıl kullanıyoruz",
        items: [
          "Yetkilendirdiğiniz Meta varlıklarını bağlamak ve göstermek.",
          "Yetkili Instagram içeriklerini planlamak, yayınlamak ve yönetmek.",
          "Sizin adınıza reklam nesneleri ve bütçeleri oluşturmak, incelemek ve yönetmek.",
          "Performans verilerini almak, haftalık veya aylık analiz ve öneriler üretmek.",
          "Hizmeti güvenceye almak, hataları araştırmak, kötüye kullanımı önlemek ve yasal yükümlülüklere uymak.",
        ],
      },
      {
        title: "5. Bilgilerin paylaşılması",
        paragraphs: [
          "Talep ettiğiniz bir işlemi gerçekleştirmek için gerektiğinde Meta ile, hizmeti işletmek ve güvenceye almak için gerekli altyapı sağlayıcılarıyla veya açıklamanın yasal olarak zorunlu olduğu durumlarda yetkili makamlarla bilgi paylaşabiliriz. Sağlayıcılar bilgileri yalnızca bize sundukları hizmet için işleyebilir.",
          "Kişisel bilgileri satmayız ve bağlı işletme verilerini ilgisiz reklam amaçlarıyla kullanmayız.",
        ],
      },
      {
        title: "6. Saklama ve silme",
        paragraphs: [
          "Erişim belirteçleri; bağlantı kaldırılana, belirteç sona erene veya yetkilendirme iptal edilene kadar saklanır. Diğer bağlı hesap, içerik ve reklam verileri yalnızca hizmeti sunmak, uyuşmazlıkları çözmek, güvenliği sağlamak veya yasal yükümlülükleri karşılamak için gerektiği süre boyunca tutulur.",
          "Doğrulanmış silme talepleri normalde 30 gün içinde tamamlanır. Daha uzun süre yasal olarak gerekmedikçe, kalan şifreli yedekler üzerine yazılmadan önce 90 güne kadar tutulabilir. Talimatlar Veri silme sayfamızda yer alır.",
        ],
      },
      {
        title: "7. Güvenlik",
        paragraphs: [
          "Şifreli belirteç saklama, erişim kontrolleri, sınırlı izinler ve operasyon kayıtları dahil makul teknik ve idari önlemler kullanırız. Hiçbir çevrim içi sistem tamamen risksiz değildir; işlediğimiz verilere uygun kontrolleri düzenli olarak gözden geçiririz.",
        ],
      },
      {
        title: "8. Tercihleriniz ve haklarınız",
        paragraphs: [
          "ADS Manager bağlantısını Meta'dan kaldırabilir, Meta ayarlarınızdan izinleri iptal edebilir veya saklanan bilgilere erişmemizi, bunları düzeltmemizi ya da silmemizi isteyebilirsiniz. Size uygulanan mevzuata göre işlemeyi kısıtlama, işlemeye itiraz etme ve ilgili veri koruma makamına şikâyette bulunma haklarınız da olabilir.",
        ],
      },
      {
        title: "9. Çocuklar",
        paragraphs: [
          "ADS Manager bir işletme hizmetidir ve 18 yaşından küçüklere yönelik değildir. Çocuklardan bilerek kişisel bilgi toplamayız.",
        ],
      },
      {
        title: "10. Değişiklikler ve iletişim",
        paragraphs: [
          `Hizmet veya yasal gereklilikler değiştikçe bu politikayı güncelleyebiliriz. Yukarıdaki yürürlük tarihi son revizyonu gösterir. Gizlilik soruları veya talepler için ${contactEmail} adresine yazabilirsiniz.`,
        ],
      },
    ],
  },
} satisfies Record<Locale, LegalDocumentContent>;

export const dataDeletionContent = {
  en: {
    eyebrow: "ADS Manager",
    title: "Data deletion",
    description:
      "How to request deletion of data stored by ADS Manager after connecting a Meta, Facebook or Instagram account.",
    appName: "ADS Manager by Yusuf Dere",
    effectiveDateLabel: "Effective date",
    effectiveDate: "September 25, 2026",
    contactLabel: "Deletion requests",
    contactEmail,
    sections: [
      {
        title: "Request deletion",
        paragraphs: [
          "You may request deletion of data stored by ADS Manager at any time. Disconnecting the application in Meta may stop future access, but sending a deletion request ensures that eligible data already stored by ADS Manager is removed.",
        ],
        items: [
          `Email ${contactEmail}.`,
          'Use the subject line “ADS Manager Data Deletion Request”.',
          "Include your name, connected Facebook or Instagram username or Page, and business name so we can identify the correct connection.",
          "We may ask for limited additional information to verify that you control the account.",
          "We will confirm the outcome and normally complete a verified request within 30 days.",
        ],
      },
      {
        title: "What we delete",
        items: [
          "Stored Meta account and asset identifiers associated with the connection.",
          "Encrypted OAuth access tokens and connection records.",
          "Cached Instagram content, advertising and performance data associated with the account.",
          "Operational records that are not required for security, fraud prevention or compliance with law.",
        ],
      },
      {
        title: "What this request does not delete",
        paragraphs: [
          "A request to ADS Manager does not automatically delete your Facebook or Instagram account, content, campaigns, ads or billing records held directly by Meta. You can manage those items in Meta Business Suite, Ads Manager and your Meta account settings.",
          "We may retain limited records where required by law, to resolve disputes, prevent fraud or demonstrate that the deletion request was completed. Residual encrypted backups may remain for up to 90 days before being overwritten.",
        ],
      },
      {
        title: "Contact",
        paragraphs: [
          `For questions about a deletion request, email ${contactEmail}. Please do not send passwords, access tokens, card details or other sensitive credentials by email.`,
        ],
      },
    ],
  },
  tr: {
    eyebrow: "ADS Manager",
    title: "Veri silme",
    description:
      "Meta, Facebook veya Instagram hesabı bağlandıktan sonra ADS Manager tarafından saklanan verilerin silinmesini isteme yöntemi.",
    appName: "Yusuf Dere tarafından ADS Manager",
    effectiveDateLabel: "Yürürlük tarihi",
    effectiveDate: "25 Eylül 2026",
    contactLabel: "Silme talepleri",
    contactEmail,
    sections: [
      {
        title: "Silme talebi oluşturun",
        paragraphs: [
          "ADS Manager tarafından saklanan verilerin silinmesini istediğiniz zaman talep edebilirsiniz. Uygulamanın Meta bağlantısını kaldırmak gelecekteki erişimi durdurabilir; ayrıca silme talebi göndermek, ADS Manager'da daha önce saklanan ve silinmeye uygun verilerin kaldırılmasını sağlar.",
        ],
        items: [
          `${contactEmail} adresine e-posta gönderin.`,
          'Konu satırına “ADS Manager Veri Silme Talebi” yazın.',
          "Doğru bağlantıyı belirleyebilmemiz için adınızı, bağlı Facebook veya Instagram kullanıcı adını ya da Sayfayı ve işletme adını ekleyin.",
          "Hesabı kontrol ettiğinizi doğrulamak için sınırlı ek bilgi isteyebiliriz.",
          "Sonucu size bildirir ve doğrulanmış talebi normalde 30 gün içinde tamamlarız.",
        ],
      },
      {
        title: "Sildiğimiz veriler",
        items: [
          "Bağlantıyla ilişkili saklanan Meta hesabı ve varlık kimlikleri.",
          "Şifreli OAuth erişim belirteçleri ve bağlantı kayıtları.",
          "Hesapla ilişkili önbelleğe alınmış Instagram içeriği, reklam ve performans verileri.",
          "Güvenlik, dolandırıcılığın önlenmesi veya yasal uyum için tutulması gerekmeyen operasyon kayıtları.",
        ],
      },
      {
        title: "Bu talebin silmediği veriler",
        paragraphs: [
          "ADS Manager'a gönderilen bir talep; doğrudan Meta tarafından tutulan Facebook veya Instagram hesabınızı, içeriklerinizi, kampanyalarınızı, reklamlarınızı ya da faturalandırma kayıtlarınızı otomatik olarak silmez. Bunları Meta Business Suite, Reklam Yöneticisi ve Meta hesap ayarlarından yönetebilirsiniz.",
          "Yasaların gerektirdiği, uyuşmazlıkları çözmek, dolandırıcılığı önlemek veya silme talebinin tamamlandığını göstermek için gereken sınırlı kayıtları saklayabiliriz. Kalan şifreli yedekler üzerine yazılmadan önce 90 güne kadar tutulabilir.",
        ],
      },
      {
        title: "İletişim",
        paragraphs: [
          `Silme talebinizle ilgili sorular için ${contactEmail} adresine yazabilirsiniz. E-posta ile şifre, erişim belirteci, kart bilgisi veya başka hassas kimlik bilgileri göndermeyin.`,
        ],
      },
    ],
  },
} satisfies Record<Locale, LegalDocumentContent>;
