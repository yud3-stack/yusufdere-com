import { Container } from "@/components/layout/Container";

const areas = [
  {
    title: "Web Development",
    text: "React ve Next.js ağırlıklı web uygulamaları, araçlar ve kişisel projeler geliştiriyorum.",
  },
  {
    title: "Desktop & Mobile",
    text: "Projenin ihtiyacına göre masaüstü ve mobil uygulamalar geliştiriyor, farklı platformları aynı sistem içinde bir araya getiriyorum.",
  },
  {
    title: "AI & Developer Tools",
    text: "Yapay zekâ tabanlı araçlar, otomasyonlar ve geliştirme sürecimi kolaylaştıran küçük yardımcı yazılımlar üzerinde çalışıyorum.",
  },
];

export function FocusAreas() {
  return (
    <section className="about-section">
      <Container>
        <h2>
          Neler Üzerinde Çalışıyorum?
        </h2>
        <div className="about-grid">
          {areas.map((area) => (
            <article key={area.title} className="focus-card">
              <h3>{area.title}</h3>
              <p>{area.text}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
