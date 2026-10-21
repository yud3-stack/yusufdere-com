import { Container } from "@/components/layout/Container";
import { site } from "@/data/site";

const links = [
  site.githubUrl ? { href: site.githubUrl, label: "GitHub", external: true } : null,
  site.linkedinUrl ? { href: site.linkedinUrl, label: "LinkedIn", external: true } : null,
  site.instagramUrl ? { href: site.instagramUrl, label: "Instagram", external: true } : null,
  site.email ? { href: `mailto:${site.email}`, label: "E-posta", external: false } : null,
].flatMap((item) => (item ? [item] : []));

export function AboutContact() {
  if (links.length === 0) {
    return null;
  }

  return (
    <section className="about-contact-section">
      <Container>
        <div className="content-cta">
          <div>
            <h2>Bir şey konuşmak ister misin?</h2>
            <p>
              Proje, iş birliği veya sadece yazılım üzerine konuşmak için bana ulaşabilirsin.
            </p>
          </div>
          <div className="button-row">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="button button-secondary"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
