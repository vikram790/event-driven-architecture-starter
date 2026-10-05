"use client";

import { FormEvent, useState } from "react";
import Client from "@/app/lib/client";

type Result =
  | { state: "idle" }
  | { state: "checking"; url: string }
  | { state: "done"; url: string; up: boolean; ms: number }
  | { state: "error"; message: string };

// LiveCheck calls the real monitor.ping endpoint so visitors can try the
// product before signing up.
export default function LiveCheck() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<Result>({ state: "idle" });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const target = url.trim();
    if (!isValidURL(target)) {
      setResult({ state: "error", message: "Enter a domain like example.com" });
      return;
    }

    setResult({ state: "checking", url: target });
    const started = performance.now();
    try {
      const client = new Client(window.location.origin);
      const { up } = await client.monitor.ping(target);
      const ms = Math.round(performance.now() - started);
      setResult({ state: "done", url: target, up, ms });
    } catch {
      setResult({ state: "error", message: "Check failed. Try again." });
    }
  };

  return (
    <form className="lp-check" onSubmit={onSubmit}>
      <label className="lp-check-label" htmlFor="lp-check-url">
        Try it now. Ping any site.
      </label>
      <div className="lp-check-row">
        <input
          id="lp-check-url"
          className="lp-input"
          type="text"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          placeholder="yourstore.in"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          className="lp-btn lp-btn--primary"
          disabled={result.state === "checking"}
        >
          Check
        </button>
      </div>
      <div className="lp-check-result" aria-live="polite">
        {result.state === "checking" && (
          <>
            <span className="lp-pill lp-pill--wait">Checking</span>
            <span>{result.url}</span>
          </>
        )}
        {result.state === "done" && (
          <>
            <span
              className={`lp-pill ${result.up ? "lp-pill--up" : "lp-pill--down"}`}
            >
              {result.up ? "Up" : "Down"}
            </span>
            <span>
              {result.url} in {result.ms} ms
            </span>
          </>
        )}
        {result.state === "error" && <span>{result.message}</span>}
      </div>
    </form>
  );
}

function isValidURL(raw: string) {
  const idx = raw.lastIndexOf(".");
  if (idx === -1 || raw.substring(idx + 1) === "") return false;
  const withScheme =
    raw.startsWith("http:") || raw.startsWith("https:") ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
