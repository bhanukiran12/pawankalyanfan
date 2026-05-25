import {
  encodeBlogContent,
  type BlogHighlight,
} from "./blog-highlights";
import { blogsTe } from "./blogs-te";
import { blogsLatest } from "./blogs-latest";
import { blogsSeo } from "./blogs-seo";

export type BlogSeed = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  highlights: BlogHighlight[];
  tags: string[];
  publishedAt: string;
  featured?: boolean;
  coverImage?: string | null;
};

export const blogsCore: BlogSeed[] = [
  {
    title: "Pawan Kalyan as Deputy Chief Minister: What It Means for Andhra Pradesh",
    slug: "pawan-kalyan-deputy-cm-andhra-pradesh-role",
    excerpt:
      "A balanced look at Pawan Kalyan's appointment as Deputy CM, his ministerial portfolios, and what supporters hope his leadership will deliver for the state.",
    tags: ["Deputy CM", "Andhra Pradesh", "Governance", "Jana Sena"],
    publishedAt: "2025-03-15",
    featured: true,
    highlights: [
      {
        type: "trivia",
        text: "Pawan Kalyan took oath as Deputy Chief Minister of Andhra Pradesh on 12 June 2024.",
        source: "Andhra Pradesh Cabinet",
      },
      {
        type: "speech",
        text: "Politics is for my country.",
        source: "Public speech",
      },
      {
        type: "quote",
        text: "Societal good comes first for me.",
        source: "Interview",
      },
    ],
    content: `When Pawan Kalyan took oath as Deputy Chief Minister of Andhra Pradesh in June 2024, it marked a defining moment for both his political career and the state's governance landscape. Appointed alongside Chief Minister N. Chandrababu Naidu as part of the TDP–Jana Sena–BJP alliance, he assumed office with portfolios spanning Panchayat Raj and Rural Development, Rural Water Supply, and Environment, Forest, Science and Technology.

For many observers, the appointment reflected more than a cabinet seat. Pawan Kalyan had spent years building Jana Sena as a party focused on grassroots concerns — employment, rural infrastructure, water access, and accountable local governance. Supporters saw the Deputy CM role as a natural extension of that mission: a chance to translate rally-stage promises into policy outcomes at the state level.

The structure of Andhra Pradesh's government gives the Deputy Chief Minister significant operational responsibility. In practice, Pawan Kalyan has been closely associated with rural development programmes, drinking water initiatives under the Jal Jeevan Mission, and coordination with district administrations on panchayat-level projects. Public reports from his first year in office highlight investments in MGNREGA-linked works, farm pond construction, rural road connectivity, and financial transfers to gram panchayats.

Critics and supporters alike agree on one point: the expectations placed on a Deputy CM with a massive public following are unusually high. Cinema fame brings visibility; governance demands patience, coordination across departments, and sustained delivery. Neutral political observers note that Pawan Kalyan's approach has often emphasised field visits, direct interaction with district officials, and monitoring mechanisms — including war-room-style tracking for rural water supply — rather than purely ceremonial leadership.

For citizens who back Pawan Kalyan, the Deputy CM tenure represents an opportunity to see whether a leader who entered politics promising change can institutionalise that change through ministries that touch everyday life in villages and towns across Andhra Pradesh. The coming years will be measured not only in headlines, but in tap connections, panchayat assets, environmental compliance, and the pace of rural employment schemes.

This article is an independent fan-site editorial written for informational purposes. It is not affiliated with any political party or government office.`,
  },
  {
    title: "From Power Star to Public Office: Pawan Kalyan's Path to Deputy CM",
    slug: "pawan-kalyan-journey-cinema-to-deputy-cm",
    excerpt:
      "Tracing Pawan Kalyan's transition from Telugu cinema icon to Jana Sena chief and Deputy Chief Minister of Andhra Pradesh.",
    tags: ["Power Star", "Jana Sena", "Political Journey", "Telugu Cinema"],
    publishedAt: "2025-04-02",
    featured: true,
    highlights: [
      {
        type: "trivia",
        text: "Johnny was directed by Pawan Kalyan himself.",
        source: "Johnny (2003)",
      },
      {
        type: "quote",
        text: "Politics is for my country.",
        source: "Pawan Kalyan",
      },
      {
        type: "quote",
        text: "I never wanted to become an actor.",
        source: "Harvard talk",
      },
    ],
    content: `Pawan Kalyan's journey from one of Telugu cinema's most influential stars to Deputy Chief Minister of Andhra Pradesh is among the most closely watched political arcs in South India. Long before he held a ministerial portfolio, he had already shaped public conversation — through films, philanthropy, and the founding of the Jana Sena Party in 2014.

His entry into formal politics was never a casual experiment. Jana Sena was positioned as a platform for youth, farmers, and working-class communities who felt underrepresented in mainstream party politics. Over multiple election cycles, Pawan Kalyan refined his message: less personality cult, more emphasis on civic duty, rural dignity, and corruption-free administration — themes that resonated with supporters who saw him as a sincere alternative to traditional career politicians.

The 2024 Andhra Pradesh Assembly elections proved pivotal. Jana Sena contested 21 seats as part of the National Democratic Alliance and won all of them, a result that strengthened the party's bargaining power within the coalition. Alliance leaders subsequently appointed Pawan Kalyan as Deputy Chief Minister, recognising both his electoral contribution and his ability to mobilise large sections of the electorate.

Neutral analysts often describe this trajectory as a blend of celebrity capital and organisational discipline. Cinema provided the initial platform and name recognition; years of ground-level party building supplied the political infrastructure. Supporters argue that his willingness to accept demanding portfolios — rural development and water supply among them — signals seriousness about governance rather than symbolic office.

Whether one views the transition as inspiration or scepticism, the facts are clear: Pawan Kalyan now operates inside the machinery of state government, not outside it. His speeches, policy priorities, and administrative decisions as Deputy CM are judged on delivery timelines, budget utilisation, and visible improvements in villages — a standard very different from box-office opening weekends.

For fans and politically engaged citizens following his career, the cinema-to-governance story remains unfinished — and that is precisely what makes it compelling.`,
  },
  {
    title: "Jal Jeevan Mission in Andhra Pradesh: Progress Under Deputy CM Pawan Kalyan",
    slug: "jal-jeevan-mission-andhra-pawan-kalyan",
    excerpt:
      "How Andhra Pradesh is advancing tap water coverage under the Jal Jeevan Mission, and the monitoring steps linked to Deputy CM Pawan Kalyan's rural water portfolio.",
    tags: ["Jal Jeevan Mission", "Rural Water", "Development", "Andhra Pradesh"],
    publishedAt: "2025-05-10",
    featured: true,
    highlights: [
      {
        type: "trivia",
        text: "As Deputy CM, Pawan Kalyan holds the Rural Water Supply portfolio overseeing Jal Jeevan Mission execution in Andhra Pradesh.",
      },
      {
        type: "speech",
        text: "Public life demands responsibility.",
        source: "Public speech",
      },
      {
        type: "quote",
        text: "Life is bigger than cinema. Cinema is just a part of life.",
        source: "Interview",
      },
    ],
    content: `Access to safe drinking water at the household level remains one of rural India's most transformative development goals. In Andhra Pradesh, the Jal Jeevan Mission (JJM) has become a centrepiece of public discussion — partly because Deputy Chief Minister Pawan Kalyan holds the Rural Water Supply portfolio and has spoken repeatedly about accelerating coverage statewide.

Public reporting in 2025 indicated that Andhra Pradesh had achieved substantial progress, with tap water coverage reaching roughly three-quarters of targeted rural households in official updates — though district-level disparities remain significant. Some districts report near-complete coverage, while others lag behind, underscoring the administrative challenge of uniform delivery across diverse terrain and population density.

Supporters of Pawan Kalyan point to several governance responses tied to his oversight: proposals submitted to the Centre for large-scale JJM funding, district-level monitoring teams headed by collectors, and the establishment of dedicated "war rooms" to track supply issues and resolve bottlenecks quickly. The intent, as described in official communications, is to move from periodic announcements to continuous monitoring — a model increasingly common in data-driven public administration.

Critics note that percentage milestones, while important, do not fully capture water quality, maintenance of infrastructure, or the sustainability of supply during peak summer demand. Neutral observers therefore recommend evaluating JJM not only by connections installed, but by functional tap water availability year-round.

For citizens who support Pawan Kalyan's leadership, the Jal Jeevan Mission represents a tangible test case: a nationally framed programme with local execution, where Deputy CM-level attention can either accelerate outcomes or expose systemic delays. The mission's success in Andhra Pradesh will likely remain a reference point in assessments of his tenure for years to come.

Sources consulted for context include public reporting from The Hindu, Times of India, and government press releases on Jal Jeevan Mission progress in Andhra Pradesh.`,
  },
  {
    title: "Panchayat Raj and Rural Development: Inside Pawan Kalyan's Core Portfolios",
    slug: "panchayat-raj-rural-development-pawan-kalyan",
    excerpt:
      "An overview of Panchayat Raj and Rural Development responsibilities in Andhra Pradesh and how Deputy CM Pawan Kalyan has approached grassroots governance.",
    tags: ["Panchayat Raj", "Rural Development", "Gram Panchayat", "Governance"],
    publishedAt: "2025-06-01",
    highlights: [
      {
        type: "trivia",
        text: "Jana Sena won all 21 Assembly seats it contested in the 2024 Andhra Pradesh elections.",
        source: "2024 Election Results",
      },
      {
        type: "quote",
        text: "Do your duty and disappear.",
        source: "Interview",
      },
      {
        type: "speech",
        text: "Democracy needs courageous citizens.",
        source: "Public speech",
      },
    ],
    content: `Panchayat Raj and Rural Development may not dominate television debates the way high-profile urban projects do, yet these ministries touch the daily lives of millions of Andhra Pradesh residents. As Deputy Chief Minister, Pawan Kalyan holds direct responsibility for strengthening local self-governance and channelling development resources to villages.

The Panchayat Raj system decentralises decision-making by empowering gram panchayats to plan and implement local priorities — from sanitation and street lighting to small infrastructure and employment-linked works. Rural Development ministries typically coordinate flagship schemes such as MGNREGA, rural housing programmes, and asset creation projects that generate livelihoods during agricultural off-seasons.

Reporting from Pawan Kalyan's first year in office highlights emphasis on financial transfers to panchayats, completion of rural connectivity works, construction of farm ponds, and cattle shelter programmes — interventions aimed at drought resilience and livestock support. Supporters view these as aligned with his long-standing rhetoric about village-centric growth and respect for agricultural communities.

Governance experts often note that panchayat-level impact depends on three factors: timely fund release, technical support for planning, and accountability for quality of works. A Deputy CM who prioritises field inspections and direct feedback loops with district collectors can help unblock delays — but sustained improvement requires institutional reform beyond individual leadership.

For politically neutral audiences who nevertheless appreciate Pawan Kalyan's commitment to rural issues, these portfolios offer a meaningful lens: they measure leadership not in slogans alone, but in kilometres of rural roads, functioning panchayat offices, and employment days generated under national rural employment guarantees.`,
  },
  {
    title: "The 2024 NDA Alliance in Andhra Pradesh: Pawan Kalyan's Strategic Role",
    slug: "nda-alliance-andhra-pradesh-pawan-kalyan-2024",
    excerpt:
      "How the TDP–Jana Sena–BJP coalition took shape before the 2024 elections and why analysts credit Pawan Kalyan as a key alliance builder.",
    tags: ["NDA", "TDP", "BJP", "2024 Elections", "Alliance"],
    publishedAt: "2025-06-18",
    highlights: [
      {
        type: "trivia",
        text: "Jana Sena Party was founded on 14 March 2014 — exactly a decade before its 2024 electoral breakthrough.",
      },
      {
        type: "speech",
        text: "I was never apolitical.",
        source: "Harvard talk",
      },
      {
        type: "quote",
        text: "Politics organizes our lives. We can't disregard it.",
        source: "Interview",
      },
    ],
    content: `Andhra Pradesh's 2024 Assembly election result reshaped the state's political map. The National Democratic Alliance — comprising the Telugu Desam Party, Jana Sena Party, and Bharatiya Janata Party — secured a decisive victory over the incumbent YSR Congress Party. Political commentators widely attributed part of that outcome to effective alliance chemistry, seat-sharing discipline, and unified messaging on governance and development.

Pawan Kalyan's role in forging and sustaining the alliance drew significant attention. Having previously contested elections with varying degrees of coalition support, Jana Sena's decision to align fully with TDP and BJP in 2024 reflected a pragmatic reading of electoral arithmetic. Jana Sena contested 21 constituencies and won all of them — a clean sweep that strengthened its position at the negotiating table when ministries were allocated.

Neutral political analysts describe Pawan Kalyan as an "NDA lynchpin" in Andhra Pradesh: his party's vote share in key regions complemented TDP's organisational depth, while BJP's national alignment provided broader coalition legitimacy. Supporters argue that his willingness to prioritise coalition stability over maximal solo expansion demonstrated maturity and a focus on statewide outcomes rather than personal optics.

The post-election reward — the Deputy Chief Ministership — confirmed Jana Sena's upgraded status within the government. For citizens who back Pawan Kalyan, the alliance story is evidence that disciplined partnerships can convert popular support into executive power. Critics caution that coalition governance always involves compromise, and long-term policy coherence depends on continued alignment among partners.

Understanding this chapter is essential for anyone following Andhra politics: it explains not only how Pawan Kalyan reached the Deputy CM chair, but also the political context that will shape every major decision his ministries undertake.`,
  },
  {
    title: "Environment and Forest Portfolio: Green Governance in Andhra Pradesh",
    slug: "environment-forest-portfolio-pawan-kalyan",
    excerpt:
      "Deputy CM Pawan Kalyan also oversees Environment, Forest, Science and Technology — here's what that portfolio means for Andhra Pradesh's ecological priorities.",
    tags: ["Environment", "Forest", "Green Governance", "Sustainability"],
    publishedAt: "2025-07-05",
    highlights: [
      {
        type: "trivia",
        text: "Beyond rural portfolios, Pawan Kalyan also serves as Minister for Environment, Forest, Science and Technology.",
      },
      {
        type: "quote",
        text: "Nature, philosophy and social issues are the three things that always occupy my mind.",
        source: "Interview",
      },
      {
        type: "dialogue",
        text: "Family ante enti, blood kaadu... it's about standing together",
        source: "Attarintiki Daredi (2013)",
      },
    ],
    content: `Alongside rural development and water supply, Pawan Kalyan serves as Minister for Environment, Forest, Science and Technology in the Andhra Pradesh government. While this portfolio receives less daily media coverage than drinking water or employment schemes, it carries long-term significance for climate resilience, biodiversity, and sustainable industrial growth.

Environment ministries typically regulate pollution control, forest conservation, wildlife protection, and environmental clearances for infrastructure projects. Science and Technology departments support research institutions, innovation policy, and digital governance tools that other ministries depend on. Holding these portfolios alongside Deputy CM responsibilities reflects the breadth of Pawan Kalyan's cabinet assignment.

Supporters who admire his public emphasis on natural stewardship — often reflected in speeches about rivers, forests, and responsible development — see the environment ministry as a natural fit. Neutral policy observers note that effective environmental governance requires balancing economic development pressures with compliance enforcement, a challenge in any fast-growing state.

Key issues likely to remain on the agenda include coastal ecosystem management, afforestation targets, air and water quality monitoring, and integration of environmental review into large rural and urban projects. Transparency in clearance processes and community consultation often determines whether environmental policy is perceived as credible or merely procedural.

For readers who support Pawan Kalyan's leadership, this portfolio offers a reminder that Deputy CM tenure spans both visible rural assets and less visible regulatory frameworks. Long-term credibility on green governance will depend on measurable outcomes — restored forest cover, reduced pollution incidents, and science-led policy — not rhetoric alone.`,
  },
  {
    title: "MGNREGS and Rural Livelihoods: A Governance Priority Under Deputy CM Pawan Kalyan",
    slug: "mgnregs-rural-livelihoods-pawan-kalyan",
    excerpt:
      "Examining MGNREGA-linked rural employment and asset creation in Andhra Pradesh during Pawan Kalyan's tenure as Deputy Chief Minister.",
    tags: ["MGNREGA", "Rural Employment", "Livelihoods", "Development"],
    publishedAt: "2025-08-12",
    highlights: [
      {
        type: "trivia",
        text: "The Panchayat Raj ministry directly coordinates MGNREGA works at the village level across Andhra Pradesh.",
      },
      {
        type: "speech",
        text: "To succeed in life, I had a purpose, aim and justification.",
        source: "Public speech",
      },
      {
        type: "quote",
        text: "Failure is half-way to success.",
        source: "Public speech",
      },
    ],
    content: `The Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA) remains India's flagship safety net for rural households, guaranteeing wage employment on public works projects. In Andhra Pradesh, MGNREGA intersects directly with Deputy Chief Minister Pawan Kalyan's Panchayat Raj and Rural Development responsibilities — making employment generation and durable asset creation central to his governance record.

Public summaries of his first year cite significant expenditure on MGNREGA-linked works, including farm ponds, rural roads, and other assets designed to improve agricultural resilience. Pawan Kalyan has publicly emphasised linking employment schemes with productive infrastructure rather than routine earthworks alone — a framing that appeals to supporters who want rural jobs tied to long-term village improvement.

Governance specialists note that MGNREGA outcomes depend on timely wage payments, transparent muster rolls, and quality audits of completed works. High-level political attention can reduce administrative delays, but lasting success requires gram panchayat capacity and vigilant social audit mechanisms.

Neutral observers also highlight the seasonal nature of demand for MGNREGA work: drought years and agricultural distress typically increase enrolment, testing the system's ability to scale without corruption or ghost entries. Deputy CM oversight in such periods can signal government responsiveness to rural economic stress.

For citizens sympathetic to Pawan Kalyan's political vision, MGNREGA performance offers a grounded metric — employment days generated, wages disbursed on schedule, and assets that remain usable years after construction. These numbers may lack cinematic drama, but they matter deeply in village economies across Andhra Pradesh.`,
  },
  {
    title: "Why Supporters See Pawan Kalyan as a Different Kind of Political Leader",
    slug: "pawan-kalyan-different-kind-of-leader",
    excerpt:
      "A thoughtful look at the qualities Pawan Kalyan supporters cite — grassroots connect, direct speech, and a governance style shaped outside traditional party hierarchies.",
    tags: ["Leadership", "Public Support", "Political Style", "Jana Sena"],
    publishedAt: "2025-09-01",
    highlights: [
      {
        type: "trivia",
        text: "Pawan Kalyan formally took charge as Deputy CM on 19 June 2024, a week after his oath ceremony.",
      },
      {
        type: "quote",
        text: "If I do not respond to some situation, my conscience kills me.",
        source: "Interview",
      },
      {
        type: "dialogue",
        text: "Evadu kodithe daniki thodu",
        source: "Gabbar Singh (2012)",
      },
    ],
    content: `Political leaders are often evaluated through ideology, party lineage, or administrative experience. Pawan Kalyan occupies an unusual category: a mass entertainer who built a regional party from scratch and now serves as Deputy Chief Minister of Andhra Pradesh. Supporters frequently describe him as a "different kind of leader" — not as uncritical praise, but as an observation about style, accessibility, and stated values.

Several themes recur in supportive commentary. First, direct communication: Pawan Kalyan has historically addressed supporters in plain language, often focusing on civic responsibility, anti-corruption sentiment, and the dignity of labour. Second, perceived authenticity: many followers believe his entry into politics was driven by conviction rather than inherited party machinery. Third, grassroots orientation: even as Deputy CM, he has been associated with field visits and district-level review meetings more typical of a working minister than a ceremonial figurehead.

Neutral political scientists caution that charisma alone does not guarantee policy success; institutional constraints, fiscal limits, and coalition dynamics shape outcomes regardless of personal popularity. Fair assessment therefore separates leadership style from delivery metrics — water coverage, rural assets, employment disbursements, and environmental compliance.

Yet style matters in democratic politics because it affects trust. In a polarised media environment, leaders who maintain a loyal support base while holding executive office face dual accountability: to coalition partners and to voters who expect visible progress.

For readers who support Pawan Kalyan without viewing him as above scrutiny, the question is constructive: does his approach as Deputy CM convert popular goodwill into durable public goods? That question keeps democratic debate healthy while acknowledging the genuine enthusiasm his leadership continues to generate.`,
  },
  {
    title: "Deputy CM Pawan Kalyan: First-Year Highlights and Governance Focus",
    slug: "deputy-cm-pawan-kalyan-first-year-highlights",
    excerpt:
      "A roundup of widely reported initiatives from Pawan Kalyan's first year as Deputy Chief Minister — rural works, Jal Jeevan Mission push, and panchayat strengthening.",
    tags: ["First Year", "Deputy CM", "Governance", "Review"],
    publishedAt: "2025-10-20",
    featured: true,
    highlights: [
      {
        type: "trivia",
        text: "Public reports note significant MGNREGA-linked rural asset creation during Pawan Kalyan's first year as Deputy CM.",
      },
      {
        type: "speech",
        text: "I'm Indian. I care for our Motherland.",
        source: "Public quote",
      },
      {
        type: "quote",
        text: "It's a passing phase. Never ever lose the spirit.",
        source: "Public speech",
      },
    ],
    content: `June 2024 to mid-2025 marked Pawan Kalyan's first year as Deputy Chief Minister of Andhra Pradesh — a period closely tracked by supporters, journalists, and political rivals alike. While comprehensive independent audits take time, publicly available reporting sketches a tenure concentrated on rural infrastructure, drinking water expansion, and panchayat-level empowerment.

Among the most cited themes in supportive and neutral coverage:

• Jal Jeevan Mission acceleration, including district monitoring teams and war-room tracking for rural water supply bottlenecks.
• MGNREGA-linked asset creation — farm ponds, rural roads, and cattle shelters designed to support agricultural communities.
• Financial transfers and project approvals intended to strengthen gram panchayat execution capacity.
• Field-level inspections emphasising direct feedback from collectors and line departments.

Public narratives from Jana Sena-aligned platforms also highlight personal philanthropy reported after assuming office — a detail supporters cite as consistent with Pawan Kalyan's long public record of charitable activity, though governance evaluation appropriately focuses on institutional outcomes rather than individual donations.

Neutral commentators recommend measuring the first year against baselines: what was the tap water coverage percentage at the start of the term versus current figures? How many panchayat projects reached completion on schedule? Were wage payments under rural employment schemes timely at scale?

For fans documenting his political journey, the first-year summary is not a finale but a chapter heading. Deputy CM responsibilities extend across multiple election cycles; rural development timelines often span years, not months. Supporters who back Pawan Kalyan can engage critically and constructively — celebrating visible progress while asking for continued transparency on districts and schemes that still lag behind state averages.

This editorial synthesises publicly reported information for fan-site readers and does not represent official government communication.`,
  },
  {
    title: "Jana Sena and Andhra Pradesh's Development Agenda: The Road Ahead",
    slug: "jana-sena-andhra-development-agenda-road-ahead",
    excerpt:
      "How Jana Sena's policy priorities align with state development goals — and what supporters hope Deputy CM Pawan Kalyan will prioritise next.",
    tags: ["Jana Sena", "Development Agenda", "Future", "Andhra Pradesh"],
    publishedAt: "2025-11-08",
    highlights: [
      {
        type: "trivia",
        text: "Pawan Kalyan wanted to be a farmer before cinema became his calling — a detail he shared at Harvard.",
        source: "Harvard talk",
      },
      {
        type: "quote",
        text: "I don't choose films. I want films to choose me.",
        source: "Interview",
      },
      {
        type: "speech",
        text: "Politics decides our day-to-day life.",
        source: "Harvard talk",
      },
    ],
    content: `Jana Sena Party entered the 2024 Andhra Pradesh elections with a clear narrative: stronger local governance, better rural infrastructure, employment opportunities for youth, and accountable administration. Winning all contested Assembly seats and securing the Deputy Chief Ministership gave the party executive influence — but also responsibility for translating manifesto themes into measurable state outcomes.

Development agendas in coalition governments emerge from negotiation among partners. TDP, Jana Sena, and BJP each bring priorities — capital region projects, rural welfare, national scheme alignment — that must coexist within shared budget constraints. Pawan Kalyan's ministerial briefs anchor Jana Sena's brand to Panchayat Raj, rural water, and environmental stewardship, sectors where multi-year planning is essential.

Supporters looking ahead typically emphasise several hopes: completing Jal Jeevan Mission targets with equitable district progress; expanding durable rural assets under MGNREGA; strengthening panchayat financial autonomy; and integrating environmental safeguards into industrial and infrastructure growth. Youth employment remains a cross-cutting theme — connecting education, skills, and local job creation rather than migration alone.

Neutral policy observers note that political capital can accelerate approvals and monitoring, but sustainable development requires civil service capacity, fiscal discipline, and consistent audit culture. The "road ahead" therefore depends on both leadership attention and institutional follow-through.

For politically engaged fans of Pawan Kalyan, staying informed — tracking scheme progress, district-level data, and official reviews — is a constructive form of support. Democracy thrives when popular leaders are cheered for achievements and questioned respectfully where delivery falls short. Jana Sena's chapter in Andhra Pradesh's development story is still being written; the Deputy CM's portfolios ensure that much of that story will unfold in villages and mandals across the state.`,
  },
];

export const blogs: BlogSeed[] = [...blogsSeo, ...blogsLatest, ...blogsCore] as BlogSeed[];

/** For sitemap — also mirrored in apps/web/src/lib/blog-sitemap-entries.ts for Docker web-only builds */
export const blogSitemapEntries = blogs.map((b) => ({
  slug: b.slug,
  publishedAt: b.publishedAt,
}));

export function blogPayload(item: BlogSeed) {
  const te = blogsTe[item.slug];
  return {
    title: item.title,
    excerpt: item.excerpt,
    content: encodeBlogContent(item.highlights, item.content, te),
    category: "Blog",
    tags: [
      ...new Set([
        ...item.tags,
        "Blog",
        "Pawan Kalyan",
        "Power Star",
        "PSPK",
        "Pawan Kalyan latest news",
        "Pawan Kalyan movies",
        "Deputy CM",
      ]),
    ],
    coverImage: item.coverImage ?? null,
    published: true,
    featured: item.featured ?? false,
    trending: item.featured ?? false,
    authorName: "Fan Editorial",
    publishedAt: new Date(item.publishedAt),
  };
}
