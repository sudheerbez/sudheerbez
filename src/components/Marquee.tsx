const items = [
  "Fintech",
  "Distributed Systems",
  "Kafka",
  "Spring Boot",
  "React",
  "AWS",
  "Real-time",
  "Cloud-native",
  "GraphQL",
  "Kubernetes",
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
