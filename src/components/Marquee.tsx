const items = [
  "Fintech",
  "LangChain",
  "RAG",
  "Spring AI",
  "Kafka",
  "Spring Boot",
  "React",
  "GCP",
  "AWS",
  "Pinecone",
  "Kubernetes",
  "Terraform",
];

export function Marquee() {
  const line = items.map((item, i) => (
    <span key={`${item}-${i}`}>
      {item} <em>—</em>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {line}
        {line}
      </div>
    </div>
  );
}
