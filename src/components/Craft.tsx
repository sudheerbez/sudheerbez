import { crafts } from "../data/content";

export function Craft() {
  return (
    <section className="craft section" id="craft">
      <p className="kicker">05 — Craft</p>
      <h2>Stack</h2>
      {crafts.map((row) => (
        <div className="craft-row" key={row.group}>
          <p className="label">{row.group}</p>
          <p className="craft-items">
            {row.items.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </p>
        </div>
      ))}
    </section>
  );
}
