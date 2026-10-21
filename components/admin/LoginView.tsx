import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CodeXml, FileText, FolderKanban, ShieldCheck } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";

export function LoginView() {
  return <div className="admin-login-page">
    <div className="admin-login-frame">
      <section className="admin-login-story" aria-label="Yusuf Dere içerik yönetimi">
        <Link href="/" className="admin-brand"><span><CodeXml size={25} /></span>Yusuf Dere<span className="admin-brand-dot">.</span></Link>
        <div className="admin-login-story-copy"><p className="admin-eyebrow">KENDİ ALANIN. KENDİ HİKÂYEN.</p><h2>Fikirden<br /><span>yayına.</span></h2><p>Yazıların, projelerin ve paylaşmak istediğin her şey için tek bir çalışma alanı.</p><div className="admin-login-features"><span><FileText size={18} />Yazılarını şekillendir</span><span><FolderKanban size={18} />Projelerini paylaş</span><span><ArrowUpRight size={18} />Kendi alanını büyüt</span></div></div>
        <p className="admin-login-signature">Yaz. Geliştir. Paylaş.<span>yusufdere.com</span></p>
      </section>
      <section className="admin-login-panel">
        <Link href="/" className="admin-login-back"><ArrowLeft size={16} />Siteye dön</Link>
        <div className="admin-login-form-wrap"><span className="admin-login-lock"><ShieldCheck size={25} /></span><p className="admin-eyebrow">YÖNETİCİ GİRİŞİ</p><h1>Tekrar hoş geldin.</h1><p className="admin-login-description">Kaldığın yerden devam etmek için hesabına giriş yap.</p><LoginForm /><p className="admin-login-security"><ShieldCheck size={15} />Bu alan yalnızca yetkili yöneticilere açıktır.</p></div>
        <p className="admin-login-footer">Yusuf Dere · İçerik yönetimi</p>
      </section>
    </div>
  </div>;
}
