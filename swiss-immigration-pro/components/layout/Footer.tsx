"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mail, MapPin, ArrowRight, CheckCircle, MessageCircle } from "lucide-react";
import { CONFIG } from "@/lib/config";
import { useT } from "@/lib/i18n/useTranslation";
import { api } from "@/lib/api";

export default function Footer() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set year and mounted flag after hydration to avoid mismatch
  useEffect(() => {
    setYear(new Date().getFullYear());
    setMounted(true);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    try {
      await api.post("/api/newsletter/subscribe", { email, source: "footer" });
    } catch {
      // Don't penalise the user if backend is down
    }
    setSubmitted(true);
    setLoading(false);
  };

  const quickLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/lawyer", label: "Virtual Lawyer" },
    { href: "/employment", label: "Employment" },
    { href: "/citizenship", label: t("visa.citizenship") },
    { href: "/pricing", label: t("nav.pricing") },
    { href: "/tools", label: t("nav.tools") },
  ];

  const resourceLinks = [
    { href: "/faq", label: t("nav.faq") },
    { href: "/about", label: t("nav.about") },
    { href: "/resources", label: t("nav.resources") },
    { href: "/cv-templates", label: "CV Templates" },
    { href: "/contact", label: t("nav.contact") },
    { href: "/consultation", label: t("contact.bookConsultation") },
  ];

  const legalLinks = [
    { href: "/privacy", label: t("footer.privacyPolicy") },
    { href: "/terms", label: t("footer.termsOfService") },
    { href: "/cookie-policy", label: t("footer.cookiePolicy") },
    { href: "/refund-policy", label: t("footer.refundPolicy") },
    { href: "/disclaimer", label: t("footer.disclaimer") },
    { href: "/accessibility", label: t("footer.accessibility") },
  ];

  const trustMetrics = [
    { value: "12,000+", label: "Applications guided" },
    { value: "4.9\u2605", label: "Average rating" },
    { value: "98%", label: "Permit success rate" },
  ];

  const socialLinks = [
    { href: "https://linkedin.com/company/swissimmigrationpro", label: "LinkedIn" },
    { href: "https://x.com/swissimmipro", label: "X (Twitter)" },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Social proof bar */}
      <div className="bg-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0 sm:divide-x sm:divide-slate-700">
            {trustMetrics.map((metric) => (
              <div
                key={metric.label}
                className="flex flex-col items-center px-8 sm:px-12"
              >
                <span className="text-white text-2xl font-bold tracking-tight">
                  {metric.value}
                </span>
                <span className="text-slate-400 text-xs mt-1">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email capture strip */}
      <div className="border-b border-slate-800 bg-slate-800/50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold text-base mb-1">
                Get weekly Swiss immigration tips
              </h3>
              <p className="text-slate-400 text-sm">
                Latest permit updates, cantonal strategies, and success stories.
                No spam.
              </p>
            </div>
            {mounted && submitted ? (
              <div className="flex items-center gap-2 text-green-400 font-medium text-sm whitespace-nowrap">
                <CheckCircle className="w-4 h-4" />
                You&apos;re subscribed!
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex gap-2 w-full md:w-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="flex-1 md:w-64 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm transition-all whitespace-nowrap disabled:opacity-60"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14 lg:py-16">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <img
                src="/images/logo-removebg.png"
                alt={CONFIG.app.name}
                width={36}
                height={36}
                className="w-9 h-9 rounded-lg object-contain bg-white/10"
              />
              <span className="text-white font-semibold text-lg tracking-tight">
                {CONFIG.app.name}
              </span>
            </Link>
            <p className="text-white text-sm font-medium mb-2">
              Your AI-powered Swiss immigration guide
            </p>
            <p className="text-sm leading-relaxed mb-5 text-slate-400">
              {t("footer.description")}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs font-medium transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer.resources")}
            </h4>
            <ul className="space-y-2.5">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              {t("footer.contact")}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="mailto:info@swissimmigrationpro.com"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                  info@swissimmigrationpro.com
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-slate-400">
                <MessageCircle className="w-4 h-4 text-slate-500 shrink-0" />
                Replies within 24 hours
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <span>
                  {CONFIG.app.firm}
                  <br />
                  <span className="text-slate-500">Zurich, Switzerland</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA row */}
        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-2xl px-6 py-5 mt-12 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-300 font-medium">
            Ready to start your Swiss journey?
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
          >
            Begin Free Assessment <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Divider + Bottom */}
        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <p className="text-xs text-slate-500">
              &copy; {year || "2026"} {CONFIG.app.name}.{" "}
              {t("footer.allRightsReserved")}
            </p>
            <span className="text-xs text-slate-600">|</span>
            <p className="text-xs text-slate-500">
              Built for Switzerland
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500">
            {legalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-slate-300 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
