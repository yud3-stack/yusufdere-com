import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="status-page">
      <p className="eyebrow">404</p>
      <h1>Sayfa bulunamadı</h1>
      <p>Aradığın yazı veya proje burada yok.</p>
      <Link href="/" className="button button-accent">Ana sayfaya dön</Link>
    </Container>
  );
}
