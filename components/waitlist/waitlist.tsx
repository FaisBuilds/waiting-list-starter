"use client";

import * as React from "react";
import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import {
  ArrowRight,
  CheckCircle,
  EnvelopeSimple,
  Users,
  Spinner,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  waitlistConfig as defaultConfig,
  submitToWaitlist,
  getLocalWaitlistCount,
} from "./waitlist-config";

type WaitlistConfig = typeof defaultConfig;

interface WaitlistProps {
  /** Override any part of waitlist-config.ts for this one instance */
  config?: Partial<WaitlistConfig>;
  className?: string;
}

export function Waitlist({ config, className }: WaitlistProps) {
  const cfg = { ...defaultConfig, ...config };
  const isDark = cfg.theme === "dark";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [count, setCount] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  // Entrance animation
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-wl-item]", { opacity: 0, y: 24 });
      gsap.to("[data-wl-item]", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  React.useEffect(() => {
    setCount(getLocalWaitlistCount());
  }, [status]);

  // Success state animation
  useLayoutEffect(() => {
    if (status === "success" && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
      );
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      await submitToWaitlist(email);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 py-24",
        isDark ? "bg-neutral-950 text-neutral-50" : "bg-neutral-50 text-neutral-950",
        className
      )}
    >
      {/* Ambient accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-[120px]"
        style={{ backgroundColor: cfg.accentColor }}
      />

      <div className="relative z-10 flex w-full max-w-lg flex-col items-center text-center">
        <div
          data-wl-item
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
          style={{
            borderColor: `${cfg.accentColor}55`,
            color: cfg.accentColor,
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: cfg.accentColor }}
          />
          {cfg.eyebrow}
        </div>

        <h1
          data-wl-item
          className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          {cfg.headline}
        </h1>

        <p
          data-wl-item
          className={cn(
            "mt-4 max-w-md text-balance text-base",
            isDark ? "text-neutral-400" : "text-neutral-600"
          )}
        >
          {cfg.subheadline}
        </p>

        <div data-wl-item className="mt-8 w-full">
          {status === "success" ? (
            <div
              ref={successRef}
              className={cn(
                "flex flex-col items-center gap-2 rounded-xl border px-6 py-8",
                isDark
                  ? "border-neutral-800 bg-neutral-900"
                  : "border-neutral-200 bg-white"
              )}
            >
              <CheckCircle
                weight="fill"
                size={36}
                style={{ color: cfg.accentColor }}
              />
              <p className="text-lg font-medium">{cfg.successHeadline}</p>
              <p
                className={cn(
                  "text-sm",
                  isDark ? "text-neutral-400" : "text-neutral-600"
                )}
              >
                {cfg.successSubtext}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-3 sm:flex-row"
              noValidate
            >
              <div className="relative flex-1">
                <EnvelopeSimple
                  size={18}
                  className={cn(
                    "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2",
                    isDark ? "text-neutral-500" : "text-neutral-400"
                  )}
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === "error") setStatus("idle");
                  }}
                  placeholder={cfg.placeholder}
                  className={cn(
                    "pl-10",
                    isDark &&
                      "border-neutral-800 bg-neutral-900 text-neutral-50 placeholder:text-neutral-500",
                    status === "error" && "border-red-500 focus-visible:ring-red-500"
                  )}
                  aria-invalid={status === "error"}
                  disabled={status === "loading"}
                />
              </div>
              <Button
                type="submit"
                disabled={status === "loading"}
                style={{ backgroundColor: cfg.accentColor }}
                className="text-white hover:opacity-90"
              >
                {status === "loading" ? (
                  <>
                    <Spinner size={16} className="mr-2 animate-spin" />
                    {cfg.buttonLoadingLabel}
                  </>
                ) : (
                  <>
                    {cfg.buttonLabel}
                    <ArrowRight size={16} className="ml-2" />
                  </>
                )}
              </Button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-2 text-left text-sm text-red-500">
              Enter a valid email address.
            </p>
          )}
        </div>

        {cfg.showCounter && (
          <div
            data-wl-item
            className={cn(
              "mt-6 flex items-center gap-1.5 text-sm",
              isDark ? "text-neutral-500" : "text-neutral-500"
            )}
          >
            <Users size={16} />
            {cfg.counterLabel(count)}
          </div>
        )}
      </div>
    </div>
  );
}
