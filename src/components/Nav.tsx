import { nav, site } from "../data/content";
import { useClock } from "../hooks/useClock";

export function Nav() {
  const time = useClock();

  return (
    <header className="nav">
      <a className="nav-mark" href="#intro">
        SB
      </a>
      <nav>
        <ul className="nav-links">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="nav-clock">
        <span>{site.location}</span>
        <em>{time} CT</em>
      </div>
    </header>
  );
}
