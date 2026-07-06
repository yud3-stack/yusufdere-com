import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

type PageIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="border-b border-border py-20 sm:py-24">
      <Container>
        <Badge>{eyebrow}</Badge>
        <h1 className="mt-8 max-w-4xl text-5xl font-semibold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
          {title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl sm:leading-9">
          {description}
        </p>
      </Container>
    </section>
  );
}
