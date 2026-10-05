"use client";

import { useEffect, useRef, useState } from "react";

type Kind = "check" | "down" | "up" | "slack";

interface Row {
  id: number;
  time: string;
  kind: Kind;
  label: string;
  text: string;
}

// A scripted sequence that mirrors what the backend does: quiet checks,
// then one transition event and one Slack message per state change.
const SCRIPT: Omit<Row, "id" | "time">[] = [
  { kind: "check", label: "CHECK", text: "api.northwind.in  200  up" },
  { kind: "check", label: "CHECK", text: "shop.northwind.in  200  up" },
  { kind: "check", label: "CHECK", text: "docs.northwind.in  200  up" },
  { kind: "check", label: "CHECK", text: "pay.northwind.in  503  down" },
  { kind: "down", label: "UP > DOWN", text: "transition.publish  pay.northwind.in" },
  { kind: "slack", label: "SLACK", text: "#ops  pay.northwind.in is down!" },
  { kind: "check", label: "CHECK", text: "api.northwind.in  200  up" },
  { kind: "check", label: "CHECK", text: "pay.northwind.in  503  down  (silent)" },
  { kind: "check", label: "CHECK", text: "shop.northwind.in  200  up" },
  { kind: "check", label: "CHECK", text: "pay.northwind.in  200  up" },
  { kind: "up", label: "DOWN > UP", text: "transition.publish  pay.northwind.in" },
  { kind: "slack", label: "SLACK", text: "#ops  pay.northwind.in is back up." },
];

const MAX_ROWS = 11;

function stamp(d: Date) {
  return d.toTimeString().slice(0, 8);
}

export default function EventFeed() {
  const [rows, setRows] = useState<Row[]>([]);
  // Kept across effect re-runs so row keys stay unique.
  const nextID = useRef(0);

  useEffect(() => {
    let i = 0;
    setRows([]);
    const push = () => {
      const next = SCRIPT[i % SCRIPT.length];
      i++;
      const id = nextID.current++;
      setRows((prev) =>
        [{ ...next, id, time: stamp(new Date()) }, ...prev].slice(0, MAX_ROWS),
      );
    };
    // Prefill so the panel never looks empty, then tick.
    for (let n = 0; n < 5; n++) push();
    const timer = setInterval(push, 1400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="lp-feed" aria-label="Example event stream">
      <div className="lp-feed-head">
        <span>Event stream / demo</span>
        <span className="lp-feed-live">Live</span>
      </div>
      <ol className="lp-feed-body" aria-hidden="true">
        {rows.map((r) => (
          <li
            key={r.id}
            className={`lp-feed-row ${r.kind !== "check" ? "lp-feed-row--hot" : ""}`}
          >
            <span className="lp-feed-time">{r.time}</span>
            <span className={`lp-feed-kind--${r.kind}`}>{r.label}</span>
            <span>{r.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
