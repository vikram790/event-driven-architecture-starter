import type { Metadata } from "next";
import { Barlow, Barlow_Condensed, DM_Mono } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";

import "./landing/landing.css";
import EventFeed from "./landing/EventFeed";
import LiveCheck from "./landing/LiveCheck";
import Reveal from "./landing/Reveal";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
});
const body = Barlow({
  subsets: ["latin"],
  weight: ["300", "500"],
  variable: "--font-body",
});
const mono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Tripwire | Uptime monitoring that only speaks when it matters",
  description:
    "Tripwire checks your sites on a schedule and alerts Slack once when a site goes down and once when it recovers. No alert spam.",
};

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const bar = (color: string) => ({ "--bar": color }) as CSSProperties;

export default function Landing() {
  return (
    <div className={`lp ${display.variable} ${body.variable} ${mono.variable}`}>
      <Reveal />

      <header className="lp-nav">
        <div className="lp-wrap">
          <a href="#top" className="lp-logo" aria-label="Tripwire home">
            <span className="lp-logo-mark" aria-hidden="true" />
            Tripwire
          </a>
          <nav className="lp-nav-links" aria-label="Sections">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a href="/dashboard" className="lp-btn lp-btn--primary">
            Open dashboard
          </a>
        </div>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="lp-hero">
          <div className="lp-wrap lp-hero-grid">
            <div>
              <div className="lp-eyebrow reveal">Uptime monitoring</div>
              <h1 className="lp-h1 reveal" style={delay(80)}>
                Know the minute <em>your site goes dark.</em>
              </h1>
              <p className="lp-lede reveal" style={delay(160)}>
                Tripwire checks every site you add, records each result, and
                posts to Slack exactly twice per incident: once when it goes
                down, once when it comes back. Everything in between stays
                quiet.
              </p>
              <div className="lp-hero-ctas reveal" style={delay(240)}>
                <a href="/dashboard" className="lp-btn lp-btn--primary">
                  Start monitoring free
                </a>
                <a href="#how" className="lp-btn lp-btn--ghost">
                  See how it works
                </a>
              </div>
              <div className="reveal" style={delay(320)}>
                <LiveCheck />
              </div>
            </div>
            <div className="reveal" style={delay(200)}>
              <EventFeed />
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="lp-section">
          <div className="lp-wrap">
            <div className="lp-metrics">
              <Metric color="var(--accent)" value="2" unit="msgs" ms={0}>
                Slack messages per incident. Down, then back up.
              </Metric>
              <Metric color="var(--green)" value="1" unit="s" ms={80}>
                Dashboard status refresh. Watch checks land in real time.
              </Metric>
              <Metric color="var(--amber)" value="60" unit="min" ms={160}>
                Default sweep across every site, plus on demand checks.
              </Metric>
              <Metric color="var(--red)" value="0" unit="repeats" ms={240}>
                Repeat pages while a site stays down. One alert is enough.
              </Metric>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="lp-section">
          <div className="lp-wrap lp-split">
            <div>
              <div className="lp-eyebrow reveal">The problem</div>
              <h2 className="lp-h2 reveal" style={delay(80)}>
                Noisy monitors get muted.
              </h2>
            </div>
            <div className="reveal" style={delay(160)}>
              <div className="lp-callout">
                <span className="lp-callout-tag">Why teams switch</span>
                <p>
                  A monitor that pings Slack on every failed check trains your
                  team to ignore it. By the third duplicate alert the channel
                  is on mute, and the real outage scrolls past.{" "}
                  <strong>
                    Tripwire only fires on a state change, so every message
                    in the channel means something changed.
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="lp-section" id="how">
          <div className="lp-wrap">
            <div className="lp-eyebrow reveal">How it works</div>
            <h2 className="lp-h2 reveal" style={delay(80)}>
              Four services. One clean signal.
            </h2>
            <p className="lp-lede reveal" style={delay(160)}>
              Each piece does one job and talks to the next through events,
              so a slow Slack webhook never delays a check.
            </p>

            <div className="lp-pipe">
              <Step title="Add a site" ms={0}>
                Drop a URL into the dashboard or <code>POST /site</code>. A{" "}
                <code>site.added</code> event triggers an instant first check.
              </Step>
              <Step title="Scheduled sweep" ms={100}>
                A cron job runs <code>check-all</code> every hour and pings
                every tracked site in parallel.
              </Step>
              <Step title="Compare state" ms={200}>
                Each result is stored and compared with the last one. Only a
                flip publishes to the <code>uptime-transition</code> topic.
              </Step>
              <Step title="Notify" ms={300}>
                The Slack subscriber picks up the transition and posts a
                single message to your channel.
              </Step>
            </div>
          </div>
        </section>

        {/* Rules */}
        <section className="lp-section">
          <div className="lp-wrap lp-split">
            <div>
              <div className="lp-eyebrow reveal">Alert logic</div>
              <h2 className="lp-h2 reveal" style={delay(80)}>
                Three rules. No surprises.
              </h2>
              <p className="lp-lede reveal" style={delay(160)}>
                The whole alerting policy fits on one screen. Status codes
                2xx count as up. Anything else, including timeouts and DNS
                failures, counts as down.
              </p>
            </div>
            <div className="lp-rules">
              <Rule
                ms={0}
                cond="Site was up and this check fails"
                condCode="prev=up  now=down"
                action="Publish a transition and post to Slack"
                actionCode='"example.com is down!"'
              />
              <Rule
                ms={100}
                cond="Site was down and this check passes"
                condCode="prev=down  now=up"
                action="Publish a transition and post the recovery"
                actionCode='"example.com is back up."'
              />
              <Rule
                ms={200}
                cond="State is the same as last check"
                condCode="prev == now"
                action="Record the check, stay silent"
                actionCode="history only, no message"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="lp-section" id="features">
          <div className="lp-wrap">
            <div className="lp-eyebrow reveal">Features</div>
            <h2 className="lp-h2 reveal" style={delay(80)}>
              Everything you need. Nothing to babysit.
            </h2>
            <div className="lp-features">
              <Feature title="Live dashboard" icon={<IconPulse />} ms={0}>
                Every site, its current status, and when it was last checked,
                refreshed every second.
              </Feature>
              <Feature title="Slack alerts" icon={<IconBell />} ms={80}>
                Plug in an incoming webhook and get down and recovery
                messages in the channel your team already watches.
              </Feature>
              <Feature title="Full check history" icon={<IconList />} ms={160}>
                Every check is written to Postgres with a timestamp, ready
                for uptime reports and SLA reviews.
              </Feature>
              <Feature title="Check on demand" icon={<IconBolt />} ms={0}>
                Deployed something risky? Trigger a sweep of all sites, or a
                single site, with one API call.
              </Feature>
              <Feature title="Event driven core" icon={<IconFlow />} ms={80}>
                Pub/Sub between services means notifiers can be added without
                touching the checker. Email or PagerDuty next.
              </Feature>
              <Feature title="Open API" icon={<IconCode />} ms={160}>
                Every action in the dashboard is a plain HTTP endpoint with a
                typed client. Script it from CI.
              </Feature>
            </div>
          </div>
        </section>

        {/* API */}
        <section className="lp-section">
          <div className="lp-wrap lp-split">
            <div>
              <div className="lp-eyebrow reveal">Developer first</div>
              <h2 className="lp-h2 reveal" style={delay(80)}>
                Four calls cover it.
              </h2>
              <p className="lp-lede reveal" style={delay(160)}>
                Add sites from your deploy pipeline, force a check after a
                release, or pull status into your own tooling.
              </p>
            </div>
            <div className="lp-code reveal" style={delay(120)}>
              <div className="lp-code-head" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <pre>
                <code>
                  <span className="c"># Is it up right now?</span>
                  {"\n"}
                  <span className="k">curl</span> /ping/yourstore.in
                  {"\n\n"}
                  <span className="c"># Track it on the hourly sweep</span>
                  {"\n"}
                  <span className="k">curl</span> /site -d{" "}
                  <span className="s">{`'{"url":"yourstore.in"}'`}</span>
                  {"\n\n"}
                  <span className="c"># Check everything after a deploy</span>
                  {"\n"}
                  <span className="k">curl</span> -X POST /check-all
                  {"\n\n"}
                  <span className="c"># Current status of every site</span>
                  {"\n"}
                  <span className="k">curl</span> /status
                </code>
              </pre>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="lp-section" id="pricing">
          <div className="lp-wrap">
            <div className="lp-eyebrow reveal">Pricing</div>
            <h2 className="lp-h2 reveal" style={delay(80)}>
              Cheaper than one hour of downtime.
            </h2>
            <p className="lp-lede reveal" style={delay(160)}>
              If your store does ₹50,000 a day, a single unnoticed hour costs
              about ₹2,083. Pro costs less than that for the whole month.
            </p>

            <div className="lp-plans">
              <Plan
                ms={0}
                name="Starter"
                price="₹0"
                period="forever"
                note="For side projects and a first look."
                items={[
                  "5 monitored sites",
                  "Hourly checks",
                  "Slack alerts on state change",
                  "7 day check history",
                ]}
                cta="Start free"
              />
              <Plan
                ms={100}
                featured
                name="Pro"
                price="₹1,499"
                period="/ month"
                note="For businesses where downtime shows up in revenue."
                items={[
                  "50 monitored sites",
                  "5 minute checks",
                  "Slack plus email alerts",
                  "90 day history and uptime reports",
                  "On demand checks from CI",
                ]}
                cta="Start 14 day trial"
              />
              <Plan
                ms={200}
                name="Team"
                price="₹4,999"
                period="/ month"
                note="For agencies running client sites at scale."
                items={[
                  "250 monitored sites",
                  "1 minute checks",
                  "Multiple Slack channels",
                  "1 year history",
                  "Priority support",
                ]}
                cta="Talk to us"
              />
            </div>
            <p className="lp-plans-foot">
              Prices in INR, exclusive of 18% GST. Billed monthly, cancel
              anytime.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="lp-section" id="faq">
          <div className="lp-wrap lp-split">
            <div>
              <div className="lp-eyebrow reveal">FAQ</div>
              <h2 className="lp-h2 reveal" style={delay(80)}>
                Straight answers.
              </h2>
            </div>
            <div className="lp-faq reveal" style={delay(120)}>
              <details>
                <summary>What counts as down?</summary>
                <p>
                  Any response outside 2xx, or no response at all. That covers
                  5xx errors, timeouts, TLS failures and DNS that does not
                  resolve.
                </p>
              </details>
              <details>
                <summary>Will I get spammed during an outage?</summary>
                <p>
                  No. You get one message when the site goes down and one when
                  it recovers. Checks during the outage are recorded but stay
                  silent.
                </p>
              </details>
              <details>
                <summary>How do I connect Slack?</summary>
                <p>
                  Create an incoming webhook in your Slack workspace and paste
                  the URL into Tripwire. Alerts start with the next state
                  change.
                </p>
              </details>
              <details>
                <summary>Can I self host it?</summary>
                <p>
                  Yes. Tripwire is built on Encore and runs anywhere Docker
                  does. The hosted plans exist so you do not have to run the
                  monitor that watches your servers on those same servers.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="lp-section lp-cta">
          <div className="lp-wrap">
            <div className="lp-eyebrow reveal">Two minutes to set up</div>
            <h2 className="lp-h2 reveal" style={delay(80)}>
              Find out before your customers do.
            </h2>
            <p className="lp-lede reveal" style={delay(160)}>
              Add your first site, connect Slack, and let Tripwire stay quiet
              until it has something worth saying.
            </p>
            <div className="lp-hero-ctas reveal" style={delay(240)}>
              <a href="/dashboard" className="lp-btn lp-btn--primary">
                Start monitoring free
              </a>
              <a href="#pricing" className="lp-btn lp-btn--ghost">
                Compare plans
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-wrap">
          <span>© 2026 Tripwire. A Lakchinna Digitals product.</span>
          <nav aria-label="Footer">
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="/dashboard">Dashboard</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function Metric(props: {
  color: string;
  value: string;
  unit: string;
  ms: number;
  children: ReactNode;
}) {
  return (
    <div
      className="lp-metric reveal"
      style={{ ...bar(props.color), ...delay(props.ms) }}
    >
      <span className="lp-num">
        {props.value}
        <small>{props.unit}</small>
      </span>
      <p>{props.children}</p>
    </div>
  );
}

function Step(props: { title: string; ms: number; children: ReactNode }) {
  return (
    <div className="lp-step reveal" style={delay(props.ms)}>
      <h3 className="lp-h3">{props.title}</h3>
      <p>{props.children}</p>
    </div>
  );
}

function Rule(props: {
  ms: number;
  cond: string;
  condCode: string;
  action: string;
  actionCode: string;
}) {
  return (
    <div className="lp-rule reveal" style={delay(props.ms)}>
      <div className="lp-rule-if">
        <span className="lp-rule-tag">IF</span>
        <p>
          {props.cond}
          <span className="lp-mono">{props.condCode}</span>
        </p>
      </div>
      <div className="lp-rule-then">
        <span className="lp-rule-tag">THEN</span>
        <p>
          {props.action}
          <span className="lp-mono">{props.actionCode}</span>
        </p>
      </div>
    </div>
  );
}

function Feature(props: {
  title: string;
  icon: ReactNode;
  ms: number;
  children: ReactNode;
}) {
  return (
    <div className="lp-feature reveal" style={delay(props.ms)}>
      <div className="lp-feature-icon" aria-hidden="true">
        {props.icon}
      </div>
      <h3 className="lp-h3">{props.title}</h3>
      <p>{props.children}</p>
    </div>
  );
}

function Plan(props: {
  ms: number;
  name: string;
  price: string;
  period: string;
  note: string;
  items: string[];
  cta: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`lp-plan reveal ${props.featured ? "lp-plan--featured" : ""}`}
      style={delay(props.ms)}
    >
      {props.featured && <span className="lp-plan-badge">Most picked</span>}
      <h3 className="lp-h3">{props.name}</h3>
      <div className="lp-price">
        <span className="lp-num">{props.price}</span>
        <span>{props.period}</span>
      </div>
      <p className="lp-plan-note">{props.note}</p>
      <ul>
        {props.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a
        href="/dashboard"
        className={`lp-btn ${props.featured ? "lp-btn--primary" : "lp-btn--ghost"}`}
      >
        {props.cta}
      </a>
    </div>
  );
}

// Icons: simple 20px strokes so they inherit the accent color.

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

const IconPulse = () => (
  <Svg>
    <path d="M3 12h4l3-8 4 16 3-8h4" />
  </Svg>
);
const IconBell = () => (
  <Svg>
    <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </Svg>
);
const IconList = () => (
  <Svg>
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </Svg>
);
const IconBolt = () => (
  <Svg>
    <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
  </Svg>
);
const IconFlow = () => (
  <Svg>
    <circle cx="5" cy="6" r="2" />
    <circle cx="5" cy="18" r="2" />
    <circle cx="19" cy="12" r="2" />
    <path d="M7 6h4a4 4 0 0 1 4 4v0M7 18h4a4 4 0 0 0 4-4v0M15 12h2" />
  </Svg>
);
const IconCode = () => (
  <Svg>
    <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
  </Svg>
);
