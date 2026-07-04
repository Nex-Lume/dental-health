export interface ProcessStep {
  step: number;
  title: string;
  description: string;
  duration?: string;
}

export interface ServiceData {
  slug: string;
  num: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  heroImage: string;
  galleryImages: string[];
  price: string;
  priceRange: { min: number; max: number };
  duration: string;
  videoId: string;
  category: string;
  benefits: string[];
  processSteps: ProcessStep[];
  faqs: { q: string; a: string }[];
}

export const SERVICES_DATA: ServiceData[] = [
  {
    slug: 'general-dentistry',
    num: '01',
    name: 'General Dentistry',
    tagline: 'Your complete oral health, simplified.',
    description:
      'Comprehensive dental care covering all aspects of oral health — from routine checkups to complex restorations.',
    longDescription:
      'General dentistry is the foundation of a healthy smile. Our expert dentists provide a full spectrum of preventive, restorative, and cosmetic dental treatments designed to keep your teeth and gums in optimal condition. Whether it\'s a simple cleaning or a complex restoration, we use the latest technology to ensure every visit is comfortable, efficient, and effective.',
    heroImage: '/img-general-dentistry.png',
    galleryImages: ['/img-dental-checkup.png', '/img-dental-fillings.png'],
    price: '₹500 – ₹5,000',
    priceRange: { min: 500, max: 5000 },
    duration: 'Varies by treatment',
    videoId: '7_7ZlSer0U8',
    category: 'Preventive',
    benefits: [
      'Comprehensive oral health assessment',
      'Early detection of dental problems',
      'Personalised treatment plans',
      'Latest digital diagnostic tools',
      'Pain-free procedures with anaesthesia',
    ],
    processSteps: [
      {
        step: 1,
        title: 'Initial Consultation',
        description:
          'We begin with a thorough examination of your teeth, gums, and jaw. Digital X-rays help us detect hidden issues not visible to the naked eye.',
        duration: '20 min',
      },
      {
        step: 2,
        title: 'Diagnosis & Planning',
        description:
          'Your dentist explains findings clearly and creates a tailored treatment plan, prioritising urgent issues while outlining a roadmap for long-term oral health.',
        duration: '15 min',
      },
      {
        step: 3,
        title: 'Treatment',
        description:
          'We carry out the recommended treatments — from fillings to cleanings — using modern techniques and materials for lasting results.',
        duration: 'Varies',
      },
      {
        step: 4,
        title: 'Review & Aftercare',
        description:
          'Post-treatment guidance is provided along with a schedule for follow-up visits to maintain your oral health.',
        duration: '10 min',
      },
    ],
    faqs: [
      {
        q: 'How often should I visit the dentist?',
        a: 'We recommend a check-up every 6 months for most patients. Those with specific conditions may need more frequent visits.',
      },
      {
        q: 'Is general dentistry painful?',
        a: 'Modern dentistry prioritises comfort. We use local anaesthesia and advanced techniques to make procedures as painless as possible.',
      },
    ],
  },
  {
    slug: 'dental-checkups',
    num: '02',
    name: 'Dental Checkups',
    tagline: 'Prevention is the best treatment.',
    description:
      'Routine dental examinations that detect issues early and keep your smile healthy for life.',
    longDescription:
      'A dental checkup is more than just a look inside your mouth. Our comprehensive examination includes digital X-rays, gum health analysis, oral cancer screening, and a full review of your bite and jaw function. Catching problems early means simpler, less expensive treatment — and a healthier smile for years to come.',
    heroImage: '/img-dental-checkup.png',
    galleryImages: ['/img-general-dentistry.png', '/img-dental-fillings.png'],
    price: '₹300 – ₹800',
    priceRange: { min: 300, max: 800 },
    duration: '30–45 minutes',
    videoId: 'xKd7kWCvq14',
    category: 'Preventive',
    benefits: [
      'Early detection of decay and gum disease',
      'Oral cancer screening included',
      'Digital X-rays — low radiation',
      'Bite and jaw assessment',
      'Custom hygiene recommendations',
    ],
    processSteps: [
      {
        step: 1,
        title: 'Medical History Review',
        description:
          'We review your medical history, current medications, and any dental concerns you\'ve noticed since your last visit.',
        duration: '5 min',
      },
      {
        step: 2,
        title: 'Digital X-Rays',
        description:
          'Low-radiation digital X-rays reveal cavities between teeth, bone loss, and other issues invisible to the naked eye.',
        duration: '10 min',
      },
      {
        step: 3,
        title: 'Clinical Examination',
        description:
          'Your dentist examines every tooth surface, gum tissue, and oral structures including the tongue, cheeks, and palate for any abnormalities.',
        duration: '15 min',
      },
      {
        step: 4,
        title: 'Treatment Recommendations',
        description:
          'You receive a clear explanation of findings and a personalised plan — no unnecessary procedures, only what you actually need.',
        duration: '10 min',
      },
    ],
    faqs: [
      {
        q: 'Do checkups include cleaning?',
        a: 'A basic exam does not include cleaning. We recommend scheduling both a checkup and a cleaning on the same visit for convenience.',
      },
      {
        q: 'Are X-rays safe?',
        a: 'Yes. Our digital X-rays emit up to 90% less radiation than traditional film X-rays and are completely safe.',
      },
    ],
  },
  {
    slug: 'teeth-cleaning',
    num: '03',
    name: 'Teeth Cleaning',
    tagline: 'The freshest start your mouth can have.',
    description:
      'Professional scaling and polishing to remove plaque, tartar, and surface stains for a cleaner, healthier smile.',
    longDescription:
      'Even the most diligent brushing and flossing cannot remove all plaque and tartar buildup. Our professional cleaning (prophylaxis) uses ultrasonic scalers and fine polishing pastes to remove deposits from all surfaces of your teeth — including the hard-to-reach areas between teeth and below the gumline. Regular cleanings prevent gum disease, cavities, and bad breath.',
    heroImage: '/img-general-dentistry.png',
    galleryImages: ['/img-dental-checkup.png', '/img-teeth-whitening.png'],
    price: '₹800 – ₹2,500',
    priceRange: { min: 800, max: 2500 },
    duration: '45–60 minutes',
    videoId: '-bWnOss2bWQ',
    category: 'Preventive',
    benefits: [
      'Removes stubborn tartar not removable by brushing',
      'Prevents gum disease and cavities',
      'Eliminates bad breath',
      'Brightens teeth by removing surface stains',
      'Includes fluoride treatment for protection',
    ],
    processSteps: [
      {
        step: 1,
        title: 'Plaque Assessment',
        description:
          'The hygienist assesses the extent of plaque and tartar buildup using a dental probe, identifying areas that need extra attention.',
        duration: '5 min',
      },
      {
        step: 2,
        title: 'Scaling',
        description:
          'Using an ultrasonic scaler, we gently break down and remove calculus (tartar) from all tooth surfaces and below the gumline.',
        duration: '20 min',
      },
      {
        step: 3,
        title: 'Polishing',
        description:
          'A rotating rubber cup with mildly abrasive polish removes surface stains and leaves teeth smooth and less susceptible to plaque.',
        duration: '10 min',
      },
      {
        step: 4,
        title: 'Flossing & Fluoride',
        description:
          'Professional flossing clears debris between teeth, followed by a fluoride treatment to strengthen enamel and prevent future cavities.',
        duration: '10 min',
      },
    ],
    faqs: [
      {
        q: 'Does cleaning hurt?',
        a: 'Most patients experience minimal discomfort. If you have sensitive teeth or gum inflammation, let us know and we can adjust the approach.',
      },
      {
        q: 'How often should I get a cleaning?',
        a: 'Twice a year for most people. Patients with gum disease may need a cleaning every 3–4 months.',
      },
    ],
  },
  {
    slug: 'teeth-whitening',
    num: '04',
    name: 'Teeth Whitening',
    tagline: 'Brilliance, restored.',
    description:
      'Professional-grade whitening treatments that safely lighten teeth by several shades in a single visit.',
    longDescription:
      'Our professional teeth whitening uses clinically proven hydrogen peroxide gels — far more effective and safer than over-the-counter products. Custom-fitted trays ensure the gel contacts every surface evenly, while our LED light activation accelerates the whitening process. The result? A dramatically brighter smile in just one session, with results that last up to two years.',
    heroImage: '/img-teeth-whitening.png',
    galleryImages: ['/img-general-dentistry.png', '/img-dental-checkup.png'],
    price: '₹4,000 – ₹15,000',
    priceRange: { min: 4000, max: 15000 },
    duration: '60–90 minutes',
    videoId: 'FI1dQf73k6U',
    category: 'Cosmetic',
    benefits: [
      'Up to 8 shades lighter in one session',
      'Safe for enamel when professionally done',
      'Long-lasting results (1–2 years)',
      'Custom trays for uniform coverage',
      'LED-accelerated for faster results',
    ],
    processSteps: [
      {
        step: 1,
        title: 'Shade Assessment',
        description:
          'We photograph your teeth and use a shade guide to document your current colour and set realistic whitening goals.',
        duration: '10 min',
      },
      {
        step: 2,
        title: 'Gum Protection',
        description:
          'A protective barrier is applied to your gums and soft tissue to prevent any sensitivity from the whitening gel.',
        duration: '5 min',
      },
      {
        step: 3,
        title: 'Gel Application & LED Activation',
        description:
          'Whitening gel is applied to all visible teeth surfaces. An LED light activates the gel, breaking down stain molecules at an accelerated rate.',
        duration: '45–60 min',
      },
      {
        step: 4,
        title: 'Final Shade Check & Aftercare',
        description:
          'We remove the gel, rinse thoroughly, and compare the new shade with your before photograph. You receive aftercare instructions and home maintenance trays.',
        duration: '10 min',
      },
    ],
    faqs: [
      {
        q: 'Will whitening damage my enamel?',
        a: 'Professional whitening is clinically proven to be safe for enamel when performed correctly under dental supervision.',
      },
      {
        q: 'How long do the results last?',
        a: 'Results typically last 1–2 years with good oral hygiene. Touch-up treatments can extend longevity.',
      },
    ],
  },
  {
    slug: 'dental-fillings',
    num: '05',
    name: 'Dental Fillings',
    tagline: 'Restoring strength, invisibly.',
    description:
      'Tooth-coloured composite fillings that repair cavities and blend seamlessly with your natural teeth.',
    longDescription:
      'Modern composite resin fillings are both functional and aesthetic. Unlike old amalgam (silver) fillings, composite matches the exact shade of your tooth, bonding directly to the enamel for a strong, seamless repair. Our fillings are mercury-free, durable, and require minimal tooth removal — preserving more of your natural tooth structure.',
    heroImage: '/img-dental-fillings.png',
    galleryImages: ['/img-general-dentistry.png', '/img-dental-checkup.png'],
    price: '₹500 – ₹3,500',
    priceRange: { min: 500, max: 3500 },
    duration: '30–60 minutes',
    videoId: 'g-dtpqWk_gI',
    category: 'Restorative',
    benefits: [
      'Tooth-coloured, completely invisible',
      'Mercury-free composite material',
      'Strong bond to natural tooth structure',
      'Minimal removal of healthy tooth',
      'Completed in a single appointment',
    ],
    processSteps: [
      {
        step: 1,
        title: 'Anaesthesia',
        description:
          'A local anaesthetic is applied to completely numb the area around the affected tooth, ensuring a pain-free procedure.',
        duration: '5 min',
      },
      {
        step: 2,
        title: 'Decay Removal',
        description:
          'Using a dental drill or laser, the decayed portion of the tooth is precisely removed while preserving as much healthy tooth structure as possible.',
        duration: '10–15 min',
      },
      {
        step: 3,
        title: 'Composite Bonding',
        description:
          'The cavity is etched, primed, and layered with composite resin that is carefully colour-matched to your tooth. Each layer is cured with a blue LED light.',
        duration: '15 min',
      },
      {
        step: 4,
        title: 'Shaping & Polishing',
        description:
          'The filling is shaped to match your natural bite, then polished to a smooth, tooth-like finish. Your bite is checked and adjusted if needed.',
        duration: '10 min',
      },
    ],
    faqs: [
      {
        q: 'How long do composite fillings last?',
        a: 'With proper care, composite fillings typically last 7–10 years. Avoiding hard foods and maintaining good hygiene helps extend their lifespan.',
      },
      {
        q: 'Can old silver fillings be replaced?',
        a: 'Yes. We can safely remove old amalgam fillings and replace them with tooth-coloured composites for a more natural look.',
      },
    ],
  },
  {
    slug: 'root-canal',
    num: '06',
    name: 'Root Canal Treatment',
    tagline: 'Save your tooth, end the pain.',
    description:
      'Precise endodontic treatment that eliminates infection and saves your natural tooth from extraction.',
    longDescription:
      'Root canal treatment has an undeserved reputation for being painful — in reality, modern root canal therapy relieves pain rather than causing it. When the soft pulp inside a tooth becomes infected or inflamed, a root canal removes the infected tissue, cleans and disinfects the canals, and seals the tooth permanently. This saves your natural tooth and eliminates the need for extraction.',
    heroImage: '/img-root-canal.png',
    galleryImages: ['/img-general-dentistry.png', '/img-crowns-bridges.png'],
    price: '₹3,000 – ₹12,000',
    priceRange: { min: 3000, max: 12000 },
    duration: '60–120 minutes',
    videoId: 'oBGqPBDg3tw',
    category: 'Restorative',
    benefits: [
      'Eliminates severe toothache and infection',
      'Saves the natural tooth from extraction',
      'Modern technique — virtually painless',
      'High success rate (95%+)',
      'Restored with a crown for full function',
    ],
    processSteps: [
      {
        step: 1,
        title: 'X-Ray & Diagnosis',
        description:
          'Digital X-rays reveal the extent of infection and the anatomy of the root canals, guiding the treatment plan.',
        duration: '15 min',
      },
      {
        step: 2,
        title: 'Anaesthesia & Access',
        description:
          'Local anaesthesia ensures complete numbness. A small opening is made in the crown of the tooth to access the infected pulp chamber.',
        duration: '10 min',
      },
      {
        step: 3,
        title: 'Canal Cleaning & Shaping',
        description:
          'Specialised files remove infected pulp tissue. The canals are flushed with antimicrobial solution and progressively shaped to receive the filling material.',
        duration: '40–60 min',
      },
      {
        step: 4,
        title: 'Sealing & Crown Placement',
        description:
          'Canals are filled with biocompatible gutta-percha and sealed. A dental crown is placed to restore the tooth\'s full strength and function.',
        duration: '20–30 min',
      },
    ],
    faqs: [
      {
        q: 'Is root canal treatment painful?',
        a: 'With modern anaesthesia and techniques, the procedure is no more uncomfortable than getting a filling. Most patients are pleasantly surprised.',
      },
      {
        q: 'What happens if I don\'t get a root canal?',
        a: 'The infection will spread to the surrounding bone and tissue, potentially requiring tooth extraction and more complex treatment.',
      },
    ],
  },
  {
    slug: 'tooth-extraction',
    num: '07',
    name: 'Tooth Extraction',
    tagline: 'Safe, gentle, and when necessary.',
    description:
      'Professional tooth removal performed with precision and care to minimise discomfort and promote fast healing.',
    longDescription:
      'We always try to save natural teeth, but sometimes extraction is the safest option — for severely decayed teeth, impacted wisdom teeth, or teeth damaged beyond repair. Our dentists use the most gentle techniques possible, including conscious sedation for anxious patients. After extraction, we provide clear aftercare instructions and discuss replacement options like implants or bridges.',
    heroImage: '/img-general-dentistry.png',
    galleryImages: ['/img-dental-checkup.png', '/img-dental-implants.png'],
    price: '₹500 – ₹5,000',
    priceRange: { min: 500, max: 5000 },
    duration: '20–60 minutes',
    videoId: '9MvP3iJRHWw',
    category: 'Surgical',
    benefits: [
      'Eliminates pain from severely damaged teeth',
      'Prevents infection from spreading',
      'Includes wisdom tooth removal',
      'Sedation options available',
      'Post-extraction implant planning offered',
    ],
    processSteps: [
      {
        step: 1,
        title: 'Assessment & X-Rays',
        description:
          'We evaluate the tooth and surrounding bone with X-rays to plan the safest extraction approach — simple or surgical.',
        duration: '10 min',
      },
      {
        step: 2,
        title: 'Anaesthesia',
        description:
          'Local anaesthesia is administered around the tooth. For complex extractions or anxious patients, sedation options are available.',
        duration: '5 min',
      },
      {
        step: 3,
        title: 'Extraction',
        description:
          'The tooth is gently loosened from its socket using specialised instruments, then carefully removed. Complex cases may require a small incision.',
        duration: '10–30 min',
      },
      {
        step: 4,
        title: 'Aftercare & Replacement Planning',
        description:
          'Gauze is placed to control bleeding. You receive detailed aftercare instructions, medications if needed, and we discuss tooth replacement options.',
        duration: '10 min',
      },
    ],
    faqs: [
      {
        q: 'How long is the recovery?',
        a: 'Most patients recover within 3–5 days for simple extractions. Wisdom tooth removal may require up to 2 weeks for full healing.',
      },
      {
        q: 'What can I replace the missing tooth with?',
        a: 'We recommend dental implants as the gold standard, but bridges or dentures are also options depending on your situation.',
      },
    ],
  },
  {
    slug: 'crowns-bridges',
    num: '08',
    name: 'Dental Crowns & Bridges',
    tagline: 'Rebuild. Restore. Renew.',
    description:
      'Custom-crafted porcelain crowns and bridges that restore damaged teeth to their natural beauty and full function.',
    longDescription:
      'Dental crowns and bridges are precision-crafted restorations that cap damaged teeth or replace missing ones. Our crowns are made from high-strength zirconia or porcelain, matched to your exact tooth shade for a completely natural appearance. A bridge uses adjacent teeth as anchors to span a gap left by a missing tooth — no surgery required. With proper care, both last 10–15 years or more.',
    heroImage: '/img-crowns-bridges.png',
    galleryImages: ['/img-general-dentistry.png', '/img-dental-implants.png'],
    price: '₹5,000 – ₹25,000',
    priceRange: { min: 5000, max: 25000 },
    duration: '2 sessions',
    videoId: 'HIYXfpz4z7w',
    category: 'Restorative',
    benefits: [
      'Restores full chewing function',
      'Natural tooth-coloured materials',
      'Protects weak or cracked teeth',
      'Replaces missing teeth without surgery',
      'Lasts 10–15+ years with care',
    ],
    processSteps: [
      {
        step: 1,
        title: 'Tooth Preparation',
        description:
          'The tooth receiving the crown is gently shaped to create space for the restoration. For a bridge, anchor teeth on either side of the gap are prepared.',
        duration: '30 min',
      },
      {
        step: 2,
        title: 'Impressions & Temporary Crown',
        description:
          'Digital or physical impressions of the prepared tooth are taken and sent to the lab. A temporary crown protects your tooth in the interim.',
        duration: '20 min',
      },
      {
        step: 3,
        title: 'Lab Fabrication',
        description:
          'Skilled ceramists craft your permanent crown or bridge to match the exact shade, shape, and size of your natural teeth.',
        duration: '7–14 days (lab)',
      },
      {
        step: 4,
        title: 'Fitting & Cementing',
        description:
          'The permanent restoration is tried in, adjusted for fit and bite, then permanently cemented into place for a natural, lasting result.',
        duration: '30 min',
      },
    ],
    faqs: [
      {
        q: 'Do crowns look natural?',
        a: 'Modern zirconia and porcelain crowns are virtually indistinguishable from natural teeth, matching colour, translucency, and texture.',
      },
      {
        q: 'Is a bridge better than an implant?',
        a: 'Implants are generally the superior long-term solution as they preserve bone. Bridges are a valid option when implants are not suitable.',
      },
    ],
  },
  {
    slug: 'dental-implants',
    num: '09',
    name: 'Dental Implants',
    tagline: 'Your permanent second chance.',
    description:
      'Titanium implants that fuse with your jawbone to provide a permanent, natural-looking tooth replacement.',
    longDescription:
      'Dental implants are the gold standard for replacing missing teeth. A small titanium post is surgically placed into the jawbone, where it fuses over several months (osseointegration) to create a stable foundation. A custom crown is then attached, producing a replacement tooth that looks, feels, and functions exactly like a natural tooth — without affecting adjacent teeth. Implants also prevent bone loss that naturally occurs after tooth extraction.',
    heroImage: '/img-dental-implants.png',
    galleryImages: ['/img-crowns-bridges.png', '/img-general-dentistry.png'],
    price: '₹25,000 – ₹80,000',
    priceRange: { min: 25000, max: 80000 },
    duration: '3–6 months',
    videoId: 'j6Ys8r2eeqk',
    category: 'Implant',
    benefits: [
      'Permanent solution — lasts a lifetime',
      'Prevents jawbone loss',
      'Functions and feels like a natural tooth',
      'No effect on adjacent healthy teeth',
      'Up to 98% success rate',
    ],
    processSteps: [
      {
        step: 1,
        title: 'Consultation & 3D Scan',
        description:
          'A 3D cone beam CT scan evaluates your bone density and volume, allowing us to plan the exact implant position digitally before any procedure.',
        duration: '45 min',
      },
      {
        step: 2,
        title: 'Implant Placement Surgery',
        description:
          'Under local anaesthesia (or sedation), a small titanium post is precisely placed into the jawbone. The gum is stitched closed and healing begins.',
        duration: '60–90 min',
      },
      {
        step: 3,
        title: 'Osseointegration',
        description:
          'Over 3–6 months, the titanium implant fuses with your jawbone in a process called osseointegration, creating a rock-solid foundation for the crown.',
        duration: '3–6 months',
      },
      {
        step: 4,
        title: 'Crown Attachment',
        description:
          'Once fully healed, a custom-made porcelain crown is attached to the implant via an abutment. The result is a permanent, natural-looking tooth.',
        duration: '60 min',
      },
    ],
    faqs: [
      {
        q: 'Am I a candidate for implants?',
        a: 'Most adults with good general health and adequate bone density are candidates. We assess suitability during the initial consultation.',
      },
      {
        q: 'How long do implants last?',
        a: 'Implants can last a lifetime with proper care. The crown typically needs replacement after 15–20 years due to normal wear.',
      },
    ],
  },
  {
    slug: 'orthodontics',
    num: '10',
    name: 'Orthodontics',
    tagline: 'Straighten your story.',
    description:
      'Modern braces and clear aligner systems that straighten teeth comfortably and discreetly at any age.',
    longDescription:
      'Orthodontic treatment has transformed dramatically. Today\'s options include traditional metal braces, ceramic braces, and clear aligner systems (like Invisalign) that are virtually invisible. Beyond aesthetics, orthodontics corrects bite problems, reduces wear on teeth, and improves oral hygiene. Our orthodontist designs a precise treatment plan using 3D digital scans and models — no messy impressions needed.',
    heroImage: '/img-orthodontics.png',
    galleryImages: ['/img-general-dentistry.png', '/img-teeth-whitening.png'],
    price: '₹30,000 – ₹1,50,000',
    priceRange: { min: 30000, max: 150000 },
    duration: '12–24 months',
    videoId: 'DBTpwa8QLi4',
    category: 'Orthodontics',
    benefits: [
      'Straighter teeth and improved confidence',
      'Corrects bite, overbite, and underbite',
      'Clear aligners — virtually invisible',
      'Suitable for teens and adults',
      '3D digital treatment planning',
    ],
    processSteps: [
      {
        step: 1,
        title: 'Digital Consultation & Scan',
        description:
          'A 3D intraoral scan captures your teeth accurately. We use software to simulate your final result so you can see your new smile before treatment begins.',
        duration: '45 min',
      },
      {
        step: 2,
        title: 'Treatment Plan & Fitting',
        description:
          'Braces are bonded to teeth, or your first set of clear aligners is provided. You\'re guided through care instructions and what to expect.',
        duration: '60–90 min',
      },
      {
        step: 3,
        title: 'Progress Monitoring',
        description:
          'Regular check-ups every 6–8 weeks allow us to make adjustments, ensuring teeth are moving according to plan. Aligners are changed every 1–2 weeks.',
        duration: 'Ongoing',
      },
      {
        step: 4,
        title: 'Retainers & Completion',
        description:
          'Once your teeth are in their final position, appliances are removed and custom retainers are fitted to maintain your beautiful new smile permanently.',
        duration: '45 min',
      },
    ],
    faqs: [
      {
        q: 'What\'s the difference between braces and clear aligners?',
        a: 'Braces are fixed and highly effective for complex cases. Clear aligners are removable and near-invisible, ideal for mild to moderate misalignment.',
      },
      {
        q: 'Is orthodontic treatment just for kids?',
        a: 'Not at all. We treat adults of all ages. In fact, clear aligner treatment is particularly popular with adult professionals.',
      },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceData | undefined {
  return SERVICES_DATA.find((s) => s.slug === slug);
}

export function getAllSlugs(): string[] {
  return SERVICES_DATA.map((s) => s.slug);
}
