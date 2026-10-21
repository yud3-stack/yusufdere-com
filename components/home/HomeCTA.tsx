import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { githubProfileUrl } from "@/components/layout/public-links";

export function HomeCTA() {
  return (
    <section className="home-cta-section">
      <Container>
        <div className="content-cta github-invite">
          <div className="github-invite-copy">
            <span className="github-mark"><SocialIcon kind="github" size={32} /></span>
            <div>
              <h2>GitHub’da birlikte geliştirelim.</h2>
              <p>GitHub’da paylaştığım projeleri inceleyebilir, önerilerini paylaşabilir ve katkıda bulunabilirsin.</p>
            </div>
          </div>
          <a href={githubProfileUrl} target="_blank" rel="noopener noreferrer" className="button button-accent">GitHub profilimi ziyaret et<ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
      </Container>
    </section>
  );
}
