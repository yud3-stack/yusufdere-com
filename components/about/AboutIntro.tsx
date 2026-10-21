import { Container } from "@/components/layout/Container";

export function AboutIntro() {
  return (
    <section className="about-section">
      <Container>
        <h2>Kısaca Ben</h2>
        <div className="about-prose">
          <p>
            Bir projede en çok ilgimi çeken şey, fikrin gerçekten çalışan ve kullanılabilir bir ürüne dönüşmesi. Bu
            yüzden sadece arayüz tarafıyla değil; ihtiyaca göre backend, masaüstü, mobil veya yapay zekâ tarafıyla da
            ilgileniyorum.
          </p>
          <p>
            Bu siteyi de geliştirdiğim projeleri, karşılaştığım problemleri ve süreç içinde öğrendiklerimi paylaşmak
            için kullanıyorum.
          </p>
        </div>
      </Container>
    </section>
  );
}
