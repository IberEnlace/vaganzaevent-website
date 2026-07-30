import type { NewEvent } from "./schema";

export const seedEvents: NewEvent[] = [
  {
    titleEn: "Doğan Duru — Live in Lisbon",
    titlePt: "Doğan Duru — Ao Vivo em Lisboa",
    descriptionEn: "An intimate night with the unmistakable voice of Redd, where alternative rock meets Lisbon.",
    descriptionPt: "Uma noite intimista com a voz inconfundível dos Redd, onde o rock alternativo encontra Lisboa.",
    date: "2026-09-18", time: "21:30", venue: "Vaganza, Lisboa", price: 35,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Do%C4%9Fan_Duru_Bronxpi_sahne_Konseri.JPG/1280px-Do%C4%9Fan_Duru_Bronxpi_sahne_Konseri.JPG",
    published: true, featured: true
  },
  {
    titleEn: "Arda Aygün — Acoustic Sessions",
    titlePt: "Arda Aygün — Sessões Acústicas",
    descriptionEn: "Songs, stories and warm acoustic arrangements in a close-up boutique setting.",
    descriptionPt: "Canções, histórias e arranjos acústicos num ambiente boutique e próximo.",
    date: "2026-10-03", time: "21:00", venue: "Vaganza, Lisboa", price: 28,
    image: "https://app.bodrumflow.com/storage/v1/object/public/event-photos/instagram/stories/gumusluksahne/2026-05/3904175807001680167-gumusluksahne-7195cb465a.png",
    published: true, featured: true
  },
  {
    titleEn: "İsmail Tunçbilek — Anatolian Strings",
    titlePt: "İsmail Tunçbilek — Cordas da Anatólia",
    descriptionEn: "A masterful journey through Anatolian melodies, improvisation and the soul of bağlama.",
    descriptionPt: "Uma viagem magistral por melodias da Anatólia, improvisação e a alma do bağlama.",
    date: "2026-10-24", time: "21:30", venue: "Vaganza, Lisboa", price: 40,
    image: "https://cdn.bubilet.com.tr/files/Etkinlik/ismail-tuncbilek-konseri-40412.JPG",
    published: true, featured: true
  }
];
