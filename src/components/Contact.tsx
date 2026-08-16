import { site } from "../data/content";

export function Contact() {
  return (
    <section className="contact section" id="contact">
      <p className="kicker">06 — Contact</p>
      <h2>
        Let’s
        <br />
        <em>build.</em>
      </h2>
      <a className="contact-mail" href={`mailto:${site.email}`}>
        {site.email}
      </a>
      <div className="contact-row">
        <a href={site.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={site.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={site.resume} download>
          Resume PDF
        </a>
        <span>{site.location}</span>
      </div>
      <div className="footer-note">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Designed as a cinematic instrument — not a template</span>
      </div>
    </section>
  );
}
