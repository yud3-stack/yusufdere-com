import { Container } from "@/components/layout/Container";

export function WorkingStyle() {
  return (
    <section className="about-section">
      <Container>
        <h2>Nasıl Çalışıyorum?</h2>
        <div className="about-prose">
          <p>
            Bir projeye başlarken önce çalışan ve mümkün olduğunca sade bir temel kurmayı tercih ediyorum. Özellikleri
            de gerçekten ihtiyaç oldukça eklemek bana daha mantıklı geliyor.
          </p>
          <p>
            Kullandığım teknolojiye bağlı kalmak yerine probleme uygun aracı seçmeye çalışıyorum. Kendi projelerimde
            arayüzden backend&apos;e ve deployment&apos;a kadar farklı taraflarla ilgilenmemin nedeni de bu.
          </p>
        </div>
      </Container>
    </section>
  );
}
