/* Content extracted from canadiaimpact.com (2 Sep 2026) plus the
   brand guideline v1.0. Copy typos in the source are corrected here
   and flagged with a NOTE. */

export const site = {
  name: "Canadia Impact Fund",
  tagline: "Investing Today. Impacting Tomorrow.",
  // NOTE: guideline prints canadiaimpactfund.com; live site is
  // canadiaimpact.com. Unresolved — confirm with client.
  url: "https://www.canadiaimpact.com",
  linkedin: "https://www.linkedin.com/company/canadia-impact-fund",
  // NOTE: guideline gives "Diamond Island, Sangkat Tonle Bassac,
  // Khan Chamkar Mon" — a different address. Unresolved.
  address:
    "Nº315, Ang Doung Street, Corner of Monivong Blvd, Sangkat Wat Phnom, Khan Daun Penh, Phnom Penh, Cambodia",
};

export const nav = [
  { href: "/about", label: "About Us" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/our-team", label: "Our Team" },
  { href: "/news", label: "News" },
];

export const hero = {
  /* Split across the viewport: lead sits left, tail sits right.
     Lines are explicit so the break never depends on wrapping. */
  titleLead: ["Investing in", "Cambodia’s Future"],
  titleTail: ["Empowering", "Generations"],
  body:
    "Canadia Impact Fund fuels innovation, sustainability, and social transformation by investing in ventures that drive long-term impact for Cambodia. From startups to green development and frontier technologies like AI, we empower ideas that shape tomorrow.",
};

export const imagery = {
  kohPich: {
    src: "/koh-pich-aerial.webp",
    alt: "Aerial view of Koh Pich (Diamond Island), Phnom Penh, where the Bassac meets the Mekong — high-rise development along the riverfront",
  },
  towerDusk: {
    src: "/canadia-tower-dusk.webp",
    alt: "Canadia Tower at dusk, its glass facade catching the last light above the Phnom Penh skyline",
  },
  /* Source was a drone HEIC lying on its side with no orientation tag.
     Rotated upright and the dead black sky trimmed off the top. */
  towerNight: {
    src: "/canadia-tower-night.webp",
    alt: "Canadia Tower at night, its crown and edges picked out in gold light above the lit sprawl of central Phnom Penh",
  },
};

/* Heritage row on /about. Ordered to match the section lede: the
   temples of Angkor, then living tradition, then the modern skyline. */
export const heritage = [
  {
    src: "/bayon.webp",
    alt: "The stone face towers of the Bayon temple at Angkor Thom, lit low against a clouded sky",
    caption: "The Bayon, Angkor Thom",
  },
  {
    src: "/apsara-dancers.webp",
    alt: "Dancers of the Royal Ballet of Cambodia performing Apsara in gold headdresses and silk",
    caption: "Royal Ballet of Cambodia",
  },
  {
    src: "/phnom-penh-skyline.webp",
    alt: "Aerial view of Phnom Penh at dusk, the lit riverfront and downtown towers wrapped by the river, a cable-stayed bridge crossing at left",
    caption: "Phnom Penh riverfront",
  },
];

export const whoWeAre =
  "Canadia Impact Fund is established under Canadia Group, focusing on impact-driven investments that combine financial growth with positive societal outcomes. By understanding global and local markets, our vision is to foster sustainable urban development, digital transformation, and inclusive growth for Cambodia and beyond.";

export const mission =
  "Investing globally in ventures that create sustainable impact and lasting value, contributing to Cambodia’s continued development and regional growth.";

/* Was hidden with display:none on the live site. */
export const principles = [
  { title: "Impact-Driven Investment", body: "We deploy capital into ventures and projects that deliver clear, measurable social or environmental benefit." },
  { title: "Strategic Partnership",    body: "We work closely with local stakeholders, communities, and experts to maximise outcomes." },
  { title: "Rigorous Management",      body: "Performance metrics, transparency, and accountability guide every investment." },
];

export const stats = [
  { value: "17,500+", label: "Employees" },
  { value: "USD 15BN", label: "Invested in Cambodia" },
  { value: "100+", label: "Investment in Companies" },
];

/* Alt text describes what is actually in each frame. The live site
   shipped architecture-template alt on an investment site, or none at
   all — see the audit's T7/T8. */
export const sectors: {
  name: string;
  tagline: string;
  image?: string;
  alt?: string;
}[] = [
  {
    name: "Healthcare",
    tagline: "Advancing care through innovation",
    image: "/sector-healthcare.webp",
    alt: "Clinical staff at Intercare Hospital reviewing patient notes together on a ward",
  },
  {
    name: "Biotech",
    tagline: "Transforming science into solutions",
    image: "/sector-biotech.jpg",
    alt: "Laboratory research work in progress",
  },
  // NOTE: live site reads "Building a greener guiture" — typo corrected.
  {
    name: "Sustainable Tech",
    tagline: "Building a greener future",
    image: "/sector-sustainable-tech.jpg",
    alt: "Green technology and renewable energy infrastructure",
  },
  {
    name: "Education",
    tagline: "Empowering minds for progress",
    image: "/canadian-international-school.webp",
    alt: "The Canadian International School campus in Phnom Penh, its red and white facade fronted by a full-height glass atrium",
  },
  {
    name: "AI",
    tagline: "Intelligence powering human potential",
    image: "/sector-ai.webp",
    alt: "Abstract visualisation of artificial intelligence",
  },
  {
    name: "Logistics",
    tagline: "Connecting markets with efficiency",
    image: "/jalat-mobile-hub.webp",
    alt: "The Jalat Logistics team at their mobile hub, beside a branded delivery truck and handling trolleys",
  },
];

/* Logo intrinsic dimensions travel with each entry — the marks have
   very different aspect ratios (Jalat is 2.26:1, NewWave is square), so
   the grid normalises on height rather than width. */
export const portfolio = [
  {
    name: "Jalat Logistics",
    url: "https://www.jalatlogistics.info/",
    sector: "Logistics",
    logo: "/jalat-logo.png",
    logoW: 2000,
    logoH: 885,
  },
  {
    // NOTE: the company styles itself "NeWwave" on new-wave.io — confirm
    // which spelling they want before launch.
    name: "NewWave",
    url: "https://www.new-wave.io/",
    sector: "Software Development",
    logo: "/newwave.png",
    logoW: 256,
    logoH: 256,
  },
];

/* Portraits are cropped to 2:3 in the card, so the source only needs to
   be tall enough — every file is 1200w except the aspect noted below. */
export const team = [
  // NOTE: supplied portrait is filenamed "Mr. Thierry Tea- VP" but the
  // role of record is CEO. Confirm which is current before launch.
  { name: "Thierry Tea",      role: "Chief Executive Officer",        photo: "/team/thierry-tea.webp" },
  { name: "Sophanarith Ou",   role: "Chief Financial Officer",        photo: "/team/sophanarith-ou.webp" },
  { name: "Sherry Lin",       role: "Investment Advisor",             photo: "/team/sherry-lin.webp" },
  { name: "Jim Baldy",        role: "Senior Investment Associate",    photo: "/team/jim-baldy.webp" },
  { name: "Anandha Khaou",    role: "Investment Associate",           photo: "/team/anandha-khaou.webp" },
  { name: "Siriwat Chhem",    role: "Investment Advisor",             photo: "/team/siriwat-chhem.webp" },
  { name: "Eva Berlinson",    role: "CSR & Sustainability Associate", photo: "/team/eva-berlinson.webp" },
  { name: "Kanaya Chamroeun", role: "Investment Analyst",             photo: "/team/kanaya-chamroeun.webp" },
].map((m) => ({ ...m, basedIn: "Phnom Penh, Cambodia" }));

/* The live site has these three written but the whole section is
   display:none, /news 404s, and every "Learn More" points at "#". */
export const news = [
  { slug: "rabbit-school-campus", title: "OCIC Group and KPCC are supporting Rabbit School in expanding its Phnom Penh campus to provide inclusive education for more children with intellectual disabilities and autism." },
  { slug: "dmu-cambodia-mou",     title: "OCIC has signed an MoU with DMU Cambodia to Expand Student Academic and Career Opportunities." },
  { slug: "caic-vinci-airports",  title: "The agreement was signed by Pung Kheav Se, Chairman of CAIC and by Nicolas Notebaert, President of VINCI Airports." },
];

export const faq = [
  { q: "What is Canadia Impact Fund?", a: "An investment platform dedicated to driving social, environmental, and financial impact in Cambodia." },
  { q: "How do you measure impact?", a: "Through clear performance metrics, regular reporting, and third-party evaluations to ensure measurable outcomes." },
  { q: "What types of projects do you invest in?", a: "We focus on ventures across healthcare, biotech, green innovation, education, artificial intelligence, and logistics — sectors driving sustainable growth and societal progress." },
  { q: "Do you work only in Cambodia?", a: "Our primary focus is Cambodia, but we also explore opportunities across the world that create cross-border impact." },
  { q: "Who can apply for funding?", a: "Entrepreneurs, organizations, and partners with scalable solutions that align with our impact mission." },
  { q: "How can I partner with the fund?", a: "You can reach out via our contact page to discuss investment opportunities, collaborations, or advisory partnerships." },
];

export const inquiryTypes = [
  "General Inquiry",
  "Project Proposal",
  // NOTE: live site has "Investment proposal" (lowercase p) — normalised.
  "Investment Proposal",
  "Partnership Opportunities",
  "Other",
];
