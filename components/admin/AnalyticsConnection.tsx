import Link from "next/link";
import { Check, Circle, ExternalLink, ShieldCheck } from "lucide-react";
import { CONSENT_VERSION } from "@/lib/cookies/consent";

type Connection = { trackingConfigured: boolean; propertyConfigured: boolean; credentialsConfigured: boolean };

export function AnalyticsConnection({ connection }: { connection: Connection }) {
  const steps = [
    { ready: connection.trackingConfigured, title: "Site ölçümü", detail: "GA4 sağlayıcısı ve G- ile başlayan Ölçüm Kimliği" },
    { ready: connection.propertyConfigured, title: "Rapor mülkü", detail: "GA4’teki sayısal Mülk Kimliği" },
    { ready: connection.credentialsConfigured, title: "Rapor yetkilendirmesi", detail: "Sunucuda tutulan hizmet hesabı bilgileri; API erişimi rapor alındığında doğrulanır" },
  ];
  return <section className="admin-card admin-analytics-connection"><div className="admin-card-heading"><h2>Ölçüm ve çerez durumu</h2><Link href="/privacy">Gizlilik ve çerezler <ExternalLink size={13} /></Link></div><div className="admin-connection-grid">{steps.map(step => <div key={step.title} className="admin-connection-step"><span className={step.ready ? "is-ready" : ""}>{step.ready ? <Check size={17} /> : <Circle size={15} />}</span><div><h3>{step.title}</h3><p>{step.detail}</p><small>{step.ready ? "Yapılandırılmış" : "Kurulum bekliyor"}</small></div></div>)}</div><div className="admin-analytics-consent"><ShieldCheck size={19} /><p>Analytics yalnızca ziyaretçinin onayından sonra yüklenir. Tercihler tarayıcıda saklanır (sürüm {CONSENT_VERSION}); merkezi bir kabul/red sayacı tutulmuyor. Admin sayfaları raporlara dahil edilmez.</p></div></section>;
}
