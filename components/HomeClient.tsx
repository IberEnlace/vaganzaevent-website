"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, Minus, Plus, ShoppingBag, Ticket, X } from "lucide-react";
import { VaganzaLogo } from "./VaganzaLogo";

type Lang = "en" | "pt";
type Event = {
  id: number; titleEn: string; titlePt: string; descriptionEn: string; descriptionPt: string;
  date: string; time: string; venue: string; price: number; image: string; featured?: boolean;
};

const copy = {
  en: {
    nav: ["Events", "Experiences", "About", "Contact"], heroKicker: "LISBON NIGHTS, BEAUTIFULLY CURATED",
    heroTitle: "Where every night becomes a story.", heroText: "Intimate concerts, soulful tables and boutique experiences in the heart of Lisbon.",
    explore: "Explore events", reserve: "Private reservations", upcoming: "Upcoming", events: "events",
    discover: "Discover our next nights", discoverText: "Limited seats. Unforgettable company. Made with soul in Lisboa.",
    add: "Add to cart", experienceTitle: "More than a venue", experienceSub: "Five ways to experience Vaganza",
    experiences: [["Fado Nights","Voices, guitar and the soul of Lisboa."],["Rakı Table","Long conversations, shared plates and Anatolian spirit."],["Wine Tasting","Small Portuguese producers, carefully selected."],["DJ Sessions","Eclectic late nights for curious ears."],["Boutique Events","Private celebrations designed around you."]],
    cart: "Your tickets", empty: "Your next unforgettable night starts here.", total: "Total", whatsapp: "Reserve on WhatsApp",
    footer: "Curated nights. Lasting memories.", seats: "tickets", language: "Português"
  },
  pt: {
    nav: ["Eventos", "Experiências", "Sobre", "Contacto"], heroKicker: "NOITES DE LISBOA, COM CURADORIA",
    heroTitle: "Onde cada noite se torna uma história.", heroText: "Concertos intimistas, mesas com alma e experiências boutique no coração de Lisboa.",
    explore: "Ver eventos", reserve: "Reservas privadas", upcoming: "Próximos", events: "eventos",
    discover: "Descubra as nossas próximas noites", discoverText: "Lugares limitados. Companhia inesquecível. Feito com alma em Lisboa.",
    add: "Adicionar", experienceTitle: "Mais do que um espaço", experienceSub: "Cinco formas de viver a Vaganza",
    experiences: [["Noites de Fado","Vozes, guitarra e a alma de Lisboa."],["Mesa de Rakı","Conversas longas, pratos partilhados e espírito da Anatólia."],["Prova de Vinhos","Pequenos produtores portugueses, cuidadosamente escolhidos."],["Sessões de DJ","Noites ecléticas para ouvidos curiosos."],["Eventos Boutique","Celebrações privadas desenhadas à sua medida."]],
    cart: "Os seus bilhetes", empty: "A sua próxima noite inesquecível começa aqui.", total: "Total", whatsapp: "Reservar no WhatsApp",
    footer: "Noites com curadoria. Memórias duradouras.", seats: "bilhetes", language: "English"
  }
};

const experienceImages = [
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1571266028243-d220c9c3b2d2?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85"
];

export default function HomeClient({ events }: { events: Event[] }) {
  const [lang, setLang] = useState<Lang>("en");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [open, setOpen] = useState(false);
  const t = copy[lang];
  const total = useMemo(() => events.reduce((sum, event) => sum + event.price * (cart[event.id] ?? 0), 0), [cart, events]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const update = (id: number, change: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + change) }));
  const reserve = () => {
    const lines = events.filter((e) => cart[e.id]).map((e) => `${cart[e.id]}× ${lang === "en" ? e.titleEn : e.titlePt} (€${e.price})`);
    const message = lang === "en" ? `Hello Vaganza, I'd like to reserve:\n${lines.join("\n")}\nTotal: €${total}` : `Olá Vaganza, gostaria de reservar:\n${lines.join("\n")}\nTotal: €${total}`;
    window.open(`https://wa.me/351912372921?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <main>
      <header className="site-header">
        <a href="#" className="brand-link"><VaganzaLogo /></a>
        <nav>{t.nav.map((item, index) => <a key={item} href={`#${["events","experiences","about","contact"][index]}`}>{item}</a>)}</nav>
        <div className="header-actions">
          <button className="lang" onClick={() => setLang(lang === "en" ? "pt" : "en")}>{lang === "en" ? "PT" : "EN"} <span>{t.language}</span></button>
          <button className="bag" onClick={() => setOpen(true)} aria-label={t.cart}><ShoppingBag size={20} />{count > 0 && <b>{count}</b>}</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <p className="eyebrow">{t.heroKicker}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-copy">{t.heroText}</p>
          <div className="hero-actions"><a className="button gold" href="#events">{t.explore}</a><a className="button ghost" href="https://wa.me/351912372921" target="_blank">{t.reserve}</a></div>
        </div>
        <div className="hero-art" aria-hidden="true"><span className="arch arch-one" /><span className="arch arch-two" /><span className="arch arch-three" /><i>V</i></div>
        <div className="hero-meta"><span>{t.upcoming}</span><strong>{events.length}</strong><small>{t.events}</small></div>
      </section>

      <section id="events" className="section events-section">
        <p className="eyebrow">{t.upcoming.toUpperCase()} {t.events.toUpperCase()}</p>
        <div className="section-heading"><h2>{t.discover}</h2><p>{t.discoverText}</p></div>
        <div className="event-grid">
          {events.map((event) => {
            const title = lang === "en" ? event.titleEn : event.titlePt;
            const description = lang === "en" ? event.descriptionEn : event.descriptionPt;
            const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "pt-PT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${event.date}T12:00:00`));
            return <article className="event-card" key={event.id}>
              <div className="event-image"><Image src={event.image} alt={title} fill sizes="(max-width: 800px) 100vw, 33vw" /><span>€{event.price}</span></div>
              <div className="event-body">
                <p className="event-date"><CalendarDays size={15} /> {date}</p><h3>{title}</h3><p>{description}</p>
                <div className="details"><span><Clock3 size={15} />{event.time}</span><span><MapPin size={15} />{event.venue}</span></div>
                <button className="add-button" onClick={() => { update(event.id, 1); setOpen(true); }}><Ticket size={18} />{t.add}</button>
              </div>
            </article>;
          })}
        </div>
      </section>

      <section id="experiences" className="section experience-section">
        <p className="eyebrow">{t.experienceTitle.toUpperCase()}</p><div className="section-heading"><h2>{t.experienceSub}</h2></div>
        <div className="experience-grid">{t.experiences.map(([title, text], i) => <article key={title} className={i === 0 ? "wide" : ""}>
          <Image src={experienceImages[i]} alt="" fill sizes="50vw" /><div><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></div>
        </article>)}</div>
      </section>

      <section id="about" className="manifesto"><VaganzaLogo compact /><blockquote>“{t.heroTitle}”</blockquote><p>{t.heroText}</p></section>
      <footer id="contact"><VaganzaLogo /><p>{t.footer}</p><div><a href="tel:+351912372921">+351 912 372 921</a><span>Rua Fernandes Tomás, 67<br />Lisboa, Portugal</span></div><small>© {new Date().getFullYear()} Vaganza Events & Entertainment</small></footer>

      <div className={`cart-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`cart ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="cart-head"><div><p className="eyebrow">VAGANZA</p><h2>{t.cart}</h2></div><button onClick={() => setOpen(false)}><X /></button></div>
        <div className="cart-items">{count === 0 ? <div className="empty"><ShoppingBag /><p>{t.empty}</p></div> : events.filter((e) => cart[e.id]).map((e) => <div className="cart-item" key={e.id}>
          <Image src={e.image} alt="" width={72} height={72} /><div><strong>{lang === "en" ? e.titleEn : e.titlePt}</strong><small>€{e.price}</small><div className="qty"><button onClick={() => update(e.id, -1)}><Minus /></button><span>{cart[e.id]}</span><button onClick={() => update(e.id, 1)}><Plus /></button></div></div>
        </div>)}</div>
        {count > 0 && <div className="cart-bottom"><div><span>{t.total}</span><strong>€{total}</strong></div><button onClick={reserve}>{t.whatsapp}</button><small>{count} {t.seats}</small></div>}
      </aside>
    </main>
  );
}
