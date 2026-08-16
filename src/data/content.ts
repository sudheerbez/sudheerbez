export const site = {
  name: "Sudheer Bezawada",
  first: "Sudheer",
  last: "Bezawada",
  role: "Software Engineer",
  company: "Robinhood",
  location: "New York, NY",
  email: "sudheerbez9@gmail.com",
  linkedin: "https://linkedin.com/in/sudheerbez",
  github: "https://github.com/sudheerbez",
  resume: "./SudheerB_Resume.pdf",
  timezone: "America/New_York",
};

export const manifesto = [
  "I BUILD",
  "THE SYSTEMS",
  "BEHIND THE TAPE.",
];

export const stats = [
  { value: "05+", label: "Years shipping" },
  { value: "99.99", label: "Uptime, percent" },
  { value: "~22%", label: "AI rec. accuracy lift" },
  { value: "20K+", label: "App downloads" },
];

export const projects = [
  {
    index: "01",
    kicker: "Robinhood / Markets + AI",
    title: "Strategies Platform",
    subtitle: "Automated investing, live rebalancing, LLM insight.",
    body: "Java and Spring Boot microservices for order execution, strategy evaluation, and real-time portfolio rebalancing. REST and Graph APIs, Kafka, React. RAG pipelines over financial documents with OpenAI, LangChain, Spring AI, and Pinecone — personalized recommendations up ~22%, APIs ~35% faster, 99.99% uptime.",
    metric: "99.99% uptime · ~35% faster APIs · ~22% rec. lift",
    tags: ["Java", "Spring Boot", "Kafka", "OpenAI", "LangChain", "Pinecone", "React", "GCP", "AWS"],
    href: "https://github.com/sudheerbez",
    wash: "radial-gradient(circle at 80% 20%, rgba(214,255,63,0.22), transparent 42%)",
  },
  {
    index: "02",
    kicker: "Project / Quant AI · May 2026",
    title: "AI Blue Swan",
    subtitle: "A multi-agent engine that writes and stresses trading strategies.",
    body: "LangGraph agents generate, backtest, critique, and optimize US equity strategies. A 4-agent self-correcting loop for improvement, code fixes, and routing — plus sandboxed execution for LLM-written Python. Walk-forward optimization with Sharpe, MaxDD, CAGR, and transaction-cost modeling.",
    metric: "4-agent workflow · walk-forward optimization",
    tags: ["LangGraph", "Python", "LLMs", "Backtesting"],
    href: "https://github.com/sudheerbez/AIBlueSwan",
    wash: "radial-gradient(circle at 80% 20%, rgba(253,224,71,0.2), transparent 42%)",
  },
  {
    index: "03",
    kicker: "Cognizant / Healthcare",
    title: "Claims & Eligibility",
    subtitle: "HIPAA-grade rails between payers and care.",
    body: "Spring Boot microservices for document workflows and claims. Secure REST APIs, Dell Boomi payer integrations, Kafka status streams, MongoDB and Oracle schemas. Kubernetes on AWS and GCP. Spring AI pipelines for patient risk analytics. Manual escalations down 30%.",
    metric: "30% fewer manual escalations",
    tags: ["Java", "Spring Boot", "HIPAA", "Kafka", "Boomi", "Kubernetes", "GCP"],
    href: "https://github.com/sudheerbez",
    wash: "radial-gradient(circle at 80% 20%, rgba(125,211,252,0.2), transparent 42%)",
  },
  {
    index: "04",
    kicker: "Team Tarak Trust / Community",
    title: "Donation Platform",
    subtitle: "A volunteer-built app that actually got used.",
    body: "Led the Android app and website for a Hyderabad charitable trust — Java, Kotlin, React, Go, MySQL. Maps and GPS to connect donors with local need, FCM notifications, blood drives and event alerts. 20,000+ downloads. Retention up 150%.",
    metric: "20,000+ downloads · 150% retention",
    tags: ["Java", "Kotlin", "React", "Go", "MySQL", "Android"],
    href: "https://github.com/sudheerbez",
    wash: "radial-gradient(circle at 80% 20%, rgba(255,106,61,0.22), transparent 42%)",
  },
];

export const experience = [
  {
    index: "01",
    company: "Robinhood",
    role: "Software Engineer",
    dates: "Jun 2024 — Present",
    place: "New York, United States",
    points: [
      "Contribute to Strategies — automated investing, live portfolio rebalancing, and data-driven insight for retail traders.",
      "Java / Spring Boot services for order execution and strategy evaluation. REST and Graph APIs ~35% faster via cache and query work.",
      "LLM features with OpenAI, LangChain, and RAG over market documents; Spring AI + Pinecone for semantic search. Recommendation accuracy ~22%.",
      "Kafka pipelines, OAuth 2.0 / RBAC, Terraform. Deployed on GCP and AWS. CI/CD cut merge-to-prod time by over 50%.",
    ],
  },
  {
    index: "02",
    company: "Cognizant",
    role: "Software Engineer",
    dates: "Sep 2021 — Jan 2023",
    place: "Chennai, India",
    points: [
      "Spring Boot microservices for healthcare document workflows and claims, HIPAA-compliant at every layer.",
      "Dell Boomi flows to payer APIs, Kafka status streams, Kubernetes on AWS and GCP. Manual escalations dropped 30%.",
      "Spring AI pipelines for patient risk analytics. Terraform, MongoDB, Oracle. React and Bootstrap for operations UI.",
    ],
  },
  {
    index: "03",
    company: "Team Tarak Trust",
    role: "Software Developer",
    dates: "Jan 2019 — Dec 2021",
    place: "Hyderabad, India",
    points: [
      "Led the volunteer Android and web platform connecting donors with people in need — maps, GPS, FCM, the full stack.",
      "Java, Go, React, Kotlin, MySQL. 20,000+ downloads. User retention up 150%.",
    ],
  },
];

export const education = {
  school: "Wichita State University",
  degree: "M.S. Computer Science",
  detail: "Jan 2023 — May 2024 · CGPA 3.97 / 4.0 · Wichita, Kansas",
};

export const crafts = [
  { group: "Languages", items: ["Java", "Python", "TypeScript", "Scala", "SQL", "Go"] },
  { group: "AI & ML", items: ["OpenAI API", "LangChain", "Spring AI", "RAG", "Pinecone", "LangGraph"] },
  { group: "Platforms", items: ["Spring Boot", "React", "Node.js", "Kafka", "REST"] },
  { group: "Cloud", items: ["GCP", "AWS", "Docker", "Kubernetes", "Terraform"] },
];

export const nav = [
  { href: "#intro", label: "Intro" },
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Path" },
  { href: "#craft", label: "Craft" },
  { href: "#contact", label: "Contact" },
];
