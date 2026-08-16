import { education, experience, stats } from "../data/content";

export function Experience() {
  return (
    <section className="experience section" id="experience">
      <div className="exp-grid">
        <div className="exp-sticky">
          <p className="kicker">04 — Path</p>
          <h2>
            Work
            <br />
            history
          </h2>
        </div>
        <div>
          {experience.map((job) => (
            <article className="job" key={job.company}>
              <span className="job-index">{job.index}</span>
              <div>
                <h3>{job.company}</h3>
                <div className="job-meta">
                  <span>{job.role}</span>
                  <span>{job.dates}</span>
                  <span>{job.place}</span>
                </div>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
          <div className="edu">
            <p className="kicker">Education</p>
            <h4>{education.school}</h4>
            <div className="job-meta">
              <span>{education.degree}</span>
              <span>{education.detail}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stats">
        {stats.map((stat) => (
          <div className="stat" key={stat.label}>
            <b>{stat.value}</b>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
