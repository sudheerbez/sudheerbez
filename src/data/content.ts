export const site = {
  name: "Sudheer Bezawada",
  first: "Sudheer",
  last: "Bezawada",
  role: "Software Engineer",
  company: "Robinhood",
  location: "Chicago, IL",
  email: "sudheerbez9@gmail.com",
  linkedin: "https://linkedin.com/in/sudheerbez",
  github: "https://github.com/sudheerbez",
  resume: "./SudheerB_Resume.pdf",
  timezone: "America/Chicago",
};

export const manifesto = [
  "I BUILD",
  "THE SYSTEMS",
  "BEHIND THE TAPE.",
];

export const stats = [
  { value: "05+", label: "Years shipping" },
  { value: "99.99", label: "Uptime, percent" },
  { value: "20K+", label: "App downloads" },
  { value: "3.97", label: "MS CS GPA" },
];

export const projects = [
  {
    index: "01",
    kicker: "Fintech / Live Markets",
    title: "Robinhood Strategies",
    subtitle: "The rails behind automated investing.",
    body: "Order execution, strategy evaluation, and real-time portfolio rebalancing. Java and Spring Boot microservices talking to Kafka, GraphQL, and React — tuned for the open, the close, and everything in between.",
    metric: "99.99% uptime · 35% faster APIs",
    tags: ["Java", "Spring Boot", "Kafka", "GraphQL", "React", "AWS"],
    href: "https://github.com/sudheerbez",
    wash: "radial-gradient(circle at 80% 20%, rgba(214,255,63,0.22), transparent 42%)",
  },
  {
    index: "02",
    kicker: "Healthcare / Trust",
    title: "Care Path",
    subtitle: "HIPAA-grade claims and eligibility.",
    body: "Secure microservices connecting payer, eligibility, and claims systems. Event streams, Boomi integrations, and Kubernetes — so clinicians spend less time escalating and more time caring.",
    metric: "30% fewer manual escalations",
    tags: ["Java", "Kafka", "HIPAA", "Kubernetes", "Terraform"],
    href: "https://github.com/sudheerbez",
    wash: "radial-gradient(circle at 80% 20%, rgba(125,211,252,0.2), transparent 42%)",
  },
  {
    index: "03",
    kicker: "Community / Product",
    title: "Open Hands",
    subtitle: "A donation platform that actually moved.",
    body: "Led the end-to-end build of a cross-platform community service product — Java, React, Android — connecting donors with local need through maps, notifications, and a backend that could take the load.",
    metric: "20,000+ downloads · 150% retention",
    tags: ["Java", "React", "Android", "Go", "MySQL"],
    href: "https://github.com/sudheerbez",
    wash: "radial-gradient(circle at 80% 20%, rgba(255,106,61,0.22), transparent 42%)",
  },
  {
    index: "04",
    kicker: "AI / Commerce",
    title: "Signal Commerce",
    subtitle: "Recommendations that compound.",
    body: "An AI-powered storefront with a machine-learning recommendation engine. Spring Boot, Angular, Kafka, and RabbitMQ — commerce that learns what people want before they search.",
    metric: "ML ranking in production",
    tags: ["Spring Boot", "Angular", "Kafka", "TypeScript"],
    href: "https://github.com/sudheerbez/ai-ecommerce-platform",
    wash: "radial-gradient(circle at 80% 20%, rgba(196,181,253,0.22), transparent 42%)",
  },
  {
    index: "05",
    kicker: "Markets / Data",
    title: "The Floor",
    subtitle: "Options intelligence, backtested.",
    body: "Algorithmic backtesting for Nifty options strategies, plus a cinematic D3 map of seventy years of Indian elections. Two sides of the same instinct: make the signal visible.",
    metric: "1951–2024 election atlas",
    tags: ["Python", "D3.js", "TypeScript", "Data Viz"],
    href: "https://github.com/sudheerbez/nifty-options-algorithmic-backtester",
    wash: "radial-gradient(circle at 80% 20%, rgba(253,224,71,0.18), transparent 42%)",
  },
];

export const experience = [
  {
    index: "01",
    company: "Robinhood",
    role: "Software Engineer",
    dates: "Jun 2024 — Present",
    place: "Chicago",
    points: [
      "Shipping the Strategies platform — automated investing, live rebalancing, and insight engines for retail traders.",
      "Designed Java microservices for order execution and strategy evaluation. Cut API latency ~35% with cache and query work.",
      "Wired Kafka pipelines, OAuth/RBAC, Terraform, and CI/CD that halved the path from merge to production.",
    ],
  },
  {
    index: "02",
    company: "Cognizant",
    role: "Software Engineer",
    dates: "Sep 2021 — Jan 2023",
    place: "Healthcare",
    points: [
      "Built Spring Boot services for document workflows and claims — HIPAA-compliant at every layer.",
      "Connected payer APIs, Kafka status streams, and Kubernetes deploys. Manual escalations dropped 30%.",
      "Automated cloud with Terraform. Oracle and Mongo schemas for claims and eligibility.",
    ],
  },
  {
    index: "03",
    company: "Team Tarak Trust",
    role: "Software Developer",
    dates: "Jan 2019 — Dec 2021",
    place: "Nonprofit",
    points: [
      "Led the Android and web platform that linked donors to people in need — maps, GPS, FCM, the full stack.",
      "Java, Go, React, Kotlin. 20,000 downloads. Retention up 150%.",
    ],
  },
];

export const education = {
  school: "Wichita State University",
  degree: "M.S. Computer Science",
  detail: "CGPA 3.97 / 4.0",
};

export const crafts = [
  { group: "Languages", items: ["Java", "TypeScript", "Python", "Go", "Scala", "SQL"] },
  { group: "Platforms", items: ["Spring Boot", "React", "Node.js", "Kafka", "GraphQL"] },
  { group: "Cloud", items: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"] },
  { group: "Data", items: ["PostgreSQL", "MongoDB", "Redis", "Oracle"] },
];

export const nav = [
  { href: "#intro", label: "Intro" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Path" },
  { href: "#craft", label: "Craft" },
  { href: "#contact", label: "Contact" },
];
