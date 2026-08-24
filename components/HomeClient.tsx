"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { CalendarDays, Clock3, Facebook, Instagram, Mail, MapPin, Minus, Phone, Plus, Send, ShoppingBag, Ticket, X } from "lucide-react";
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
    past: "Past events", pastTitle: "Nights we remember", pastText: "A look back at Vaganza gatherings that brought music, culture and people together.", completed: "Completed",
    add: "Add to cart", experienceTitle: "More than a venue", experienceSub: "Five ways to experience Vaganza",
    experiences: [["Fado Nights","Voices, guitar and the soul of Lisboa."],["Rakı Table","Long conversations, shared plates and Anatolian spirit."],["Wine Tasting","Small Portuguese producers, carefully selected."],["DJ Sessions","Eclectic late nights for curious ears."],["Boutique Events","Private celebrations designed around you."]],
    cart: "Your tickets", empty: "Your next unforgettable night starts here.", total: "Total", whatsapp: "Reserve on WhatsApp",
    footer: "Curated nights. Lasting memories.", seats: "tickets", language: "Português",
    contactTitle: "Let’s create an unforgettable night.", contactText: "Concerts, private events, collaborations and special requests.",
    name: "Your name", email: "Email address", message: "Tell us about your event", send: "Send message",
    sending: "Sending…", sent: "Thank you — your message has been sent.", failed: "We couldn’t send it. Please email hello@vaganzaevent.com."
  },
  pt: {
    nav: ["Eventos", "Experiências", "Sobre", "Contacto"], heroKicker: "NOITES DE LISBOA, COM CURADORIA",
    heroTitle: "Onde cada noite se torna uma história.", heroText: "Concertos intimistas, mesas com alma e experiências boutique no coração de Lisboa.",
    explore: "Ver eventos", reserve: "Reservas privadas", upcoming: "Próximos", events: "eventos",
    discover: "Descubra as nossas próximas noites", discoverText: "Lugares limitados. Companhia inesquecível. Feito com alma em Lisboa.",
    past: "Eventos passados", pastTitle: "Noites que recordamos", pastText: "Um olhar sobre os encontros Vaganza que reuniram música, cultura e pessoas.", completed: "Realizado",
    add: "Adicionar", experienceTitle: "Mais do que um espaço", experienceSub: "Cinco formas de viver a Vaganza",
    experiences: [["Noites de Fado","Vozes, guitarra e a alma de Lisboa."],["Mesa de Rakı","Conversas longas, pratos partilhados e espírito da Anatólia."],["Prova de Vinhos","Pequenos produtores portugueses, cuidadosamente escolhidos."],["Sessões de DJ","Noites ecléticas para ouvidos curiosos."],["Eventos Boutique","Celebrações privadas desenhadas à sua medida."]],
    cart: "Os seus bilhetes", empty: "A sua próxima noite inesquecível começa aqui.", total: "Total", whatsapp: "Reservar no WhatsApp",
    footer: "Noites com curadoria. Memórias duradouras.", seats: "bilhetes", language: "English",
    contactTitle: "Vamos criar uma noite inesquecível.", contactText: "Concertos, eventos privados, colaborações e pedidos especiais.",
    name: "O seu nome", email: "Endereço de email", message: "Conte-nos sobre o seu evento", send: "Enviar mensagem",
    sending: "A enviar…", sent: "Obrigado — a sua mensagem foi enviada.", failed: "Não foi possível enviar. Escreva para hello@vaganzaevent.com."
  }
};

const experienceImages = [
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=85",
  "/images/dj-performance.jpg",
  "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=85"
];

export default function HomeClient({ events }: { events: Event[] }) {
  const [lang, setLang] = useState<Lang>("en");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [open, setOpen] = useState(false);
  const [contactState, setContactState] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const t = copy[lang];
  const displayImage = (event: Event) => event.titleEn.toLocaleLowerCase("tr").includes("arda aygün") ? "/images/arda-aygun.jpg" : event.image;
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return {
      upcomingEvents: events.filter((event) => event.date >= today),
      pastEvents: events.filter((event) => event.date < today).sort((a, b) => b.date.localeCompare(a.date))
    };
  }, [events]);
  const total = useMemo(() => upcomingEvents.reduce((sum, event) => sum + event.price * (cart[event.id] ?? 0), 0), [cart, upcomingEvents]);
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const update = (id: number, change: number) => setCart((current) => ({ ...current, [id]: Math.max(0, (current[id] ?? 0) + change) }));
  const reserve = () => {
    const lines = upcomingEvents.filter((e) => cart[e.id]).map((e) => `${cart[e.id]}× ${lang === "en" ? e.titleEn : e.titlePt} (€${e.price})`);
    const message = lang === "en" ? `Hello Vaganza, I'd like to reserve:\n${lines.join("\n")}\nTotal: €${total}` : `Olá Vaganza, gostaria de reservar:\n${lines.join("\n")}\nTotal: €${total}`;
    window.open(`https://wa.me/351912372921?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };
  const sendContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactState("sending");
    const form = event.currentTarget;
    const fields = new FormData(form);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fields.get("name"),
          email: fields.get("email"),
          message: fields.get("message"),
          website: fields.get("website"),
          language: lang
        })
      });
      if (!response.ok) throw new Error("Contact request failed");
      form.reset();
      setContactState("sent");
    } catch {
      setContactState("failed");
    }
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
        <div className="hero-content">
          <p className="eyebrow">{t.heroKicker}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-copy">{t.heroText}</p>
          <div className="hero-actions"><a className="button gold" href="#events">{t.explore}</a><a className="button ghost" href="https://wa.me/351912372921" target="_blank">{t.reserve}</a></div>
        </div>
        <div className="hero-meta"><span>{t.upcoming}</span><strong>{upcomingEvents.length}</strong><small>{t.events}</small></div>
      </section>

      <section id="events" className="section events-section">
        <p className="eyebrow">{t.upcoming.toUpperCase()} {t.events.toUpperCase()}</p>
        <div className="section-heading"><h2>{t.discover}</h2><p>{t.discoverText}</p></div>
        <div className="event-grid">
          {upcomingEvents.map((event) => {
            const title = lang === "en" ? event.titleEn : event.titlePt;
            const description = lang === "en" ? event.descriptionEn : event.descriptionPt;
            const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "pt-PT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${event.date}T12:00:00`));
            return <article className="event-card" key={event.id}>
              <div className="event-image"><Image src={displayImage(event)} alt={title} fill sizes="(max-width: 800px) 100vw, 33vw" /><span>€{event.price}</span></div>
              <div className="event-body">
                <p className="event-date"><CalendarDays size={15} /> {date}</p><h3>{title}</h3><p>{description}</p>
                <div className="details"><span><Clock3 size={15} />{event.time}</span><span><MapPin size={15} />{event.venue}</span></div>
                <button className="add-button" onClick={() => { update(event.id, 1); setOpen(true); }}><Ticket size={18} />{t.add}</button>
              </div>
            </article>;
          })}
        </div>
      </section>

      {pastEvents.length > 0 && <section id="past-events" className="section past-events-section">
        <p className="eyebrow">{t.past.toUpperCase()}</p>
        <div className="section-heading"><h2>{t.pastTitle}</h2><p>{t.pastText}</p></div>
        <div className="event-grid">
          {pastEvents.map((event) => {
            const title = lang === "en" ? event.titleEn : event.titlePt;
            const description = lang === "en" ? event.descriptionEn : event.descriptionPt;
            const date = new Intl.DateTimeFormat(lang === "en" ? "en-GB" : "pt-PT", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${event.date}T12:00:00`));
            return <article className="event-card" key={event.id}>
              <div className="event-image"><Image src={displayImage(event)} alt={title} fill sizes="(max-width: 800px) 100vw, 50vw" /><span className="past-badge">{t.completed}</span></div>
              <div className="event-body">
                <p className="event-date"><CalendarDays size={15} /> {date}</p><h3>{title}</h3><p>{description}</p>
                <div className="details"><span><Clock3 size={15} />{event.time}</span><span><MapPin size={15} />{event.venue}</span></div>
              </div>
            </article>;
          })}
        </div>
      </section>}

      <section id="experiences" className="section experience-section">
        <p className="eyebrow">{t.experienceTitle.toUpperCase()}</p><div className="section-heading"><h2>{t.experienceSub}</h2></div>
        <div className="experience-grid">{t.experiences.map(([title, text], i) => <article key={title} className={i === 0 ? "wide" : ""}>
          <Image src={experienceImages[i]} alt="" fill sizes="50vw" /><div><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></div>
        </article>)}</div>
      </section>

      <section id="about" className="manifesto"><VaganzaLogo compact /><blockquote>“{t.heroTitle}”</blockquote><p>{t.heroText}</p></section>
      <section id="contact" className="contact-section">
        <div className="contact-copy">
          <p className="eyebrow">VAGANZA LISBOA</p>
          <h2>{t.contactTitle}</h2>
          <p>{t.contactText}</p>
          <div className="contact-details">
            <a href="mailto:hello@vaganzaevent.com"><Mail />hello@vaganzaevent.com</a>
            <a href="tel:+351912372921"><Phone />+351 912 372 921</a>
            <span><MapPin />Rua Fernandes Tomás, 67, Lisboa</span>
          </div>
        </div>
        <form className="contact-form" onSubmit={sendContact}>
          <label className="contact-honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <label>{t.name}<input name="name" required /></label>
          <label>{t.email}<input name="email" type="email" required /></label>
          <label>{t.message}<textarea name="message" required rows={6} /></label>
          <button type="submit" disabled={contactState === "sending"}><Send />{contactState === "sending" ? t.sending : t.send}</button>
          {contactState === "sent" && <p className="form-status success" role="status">{t.sent}</p>}
          {contactState === "failed" && <p className="form-status error" role="alert">{t.failed}</p>}
        </form>
      </section>
      <footer>
        <VaganzaLogo />
        <p>{t.footer}</p>
        <div className="socials">
          <a href="https://www.instagram.com/vaganzaevent/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram /></a>
          <a href="https://www.facebook.com/vaganzaevent/" target="_blank" rel="noreferrer" aria-label="Facebook"><Facebook /></a>
          <a href="mailto:hello@vaganzaevent.com" aria-label="Email"><Mail /></a>
        </div>
        <small>© {new Date().getFullYear()} Vaganza Events & Entertainment</small>
      </footer>

      <div className={`cart-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`cart ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="cart-head"><div><p className="eyebrow">VAGANZA</p><h2>{t.cart}</h2></div><button onClick={() => setOpen(false)}><X /></button></div>
        <div className="cart-items">{count === 0 ? <div className="empty"><ShoppingBag /><p>{t.empty}</p></div> : upcomingEvents.filter((e) => cart[e.id]).map((e) => <div className="cart-item" key={e.id}>
          <Image src={e.image} alt="" width={72} height={72} /><div><strong>{lang === "en" ? e.titleEn : e.titlePt}</strong><small>€{e.price}</small><div className="qty"><button onClick={() => update(e.id, -1)}><Minus /></button><span>{cart[e.id]}</span><button onClick={() => update(e.id, 1)}><Plus /></button></div></div>
        </div>)}</div>
        {count > 0 && <div className="cart-bottom"><div><span>{t.total}</span><strong>€{total}</strong></div><button onClick={reserve}>{t.whatsapp}</button><small>{count} {t.seats}</small></div>}
      </aside>
    </main>
  );
}
