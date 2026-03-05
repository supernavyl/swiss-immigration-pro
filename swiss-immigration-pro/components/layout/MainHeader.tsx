"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  Shield,
  ArrowRight,
  Sparkles,
  ChevronDown,
  Crown,
} from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { useT } from "@/lib/i18n/useTranslation";
import { AnimatePresence, motion } from "framer-motion";
import AdvancedSearch from "@/components/ui/AdvancedSearch";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import DarkModeToggle from "@/components/ui/DarkModeToggle";
import ResourcesDropdown from "@/components/layout/ResourcesDropdown";
import MobileDrawer from "@/components/layout/MobileDrawer";
import NotificationBell from "@/components/layout/NotificationBell";
import KeyboardShortcutsModal from "@/components/layout/KeyboardShortcutsModal";
import { useHaptic } from "@/lib/hooks/useHaptic";
import { useIsMobile } from "@/lib/hooks/useMediaQuery";
import { cn } from "@/lib/utils/cn";

interface AppUser {
  id?: string;
  email?: string | null;
  name?: string | null;
  isAdmin?: boolean;
  packId?: string | null;
}

export default function MainHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useT();
  const { haptic } = useHaptic();
  const isMobile = useIsMobile();
  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 8);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobile && isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobile, isMenuOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "?" && !["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setShortcutsOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const appUser: AppUser | null = useMemo(() => {
    if (typeof window === "undefined" || !mounted) return null;
    if (status === "loading" || !session?.user) return null;
    const u = session.user as AppUser;
    return {
      id: u.id,
      email: u.email ?? null,
      name: u.name ?? null,
      isAdmin: u.isAdmin ?? false,
      packId: u.packId ?? null,
    };
  }, [session, status, mounted]);

  const navigationItems = useMemo(
    () => [
      { href: "/visas", label: t("nav.visas") || "Visas & Permits" },
      { href: "/pricing", label: t("nav.pricing") || "Pricing" },
      { href: "/b2b", label: t("nav.b2b") || "For Companies" },
    ],
    [t],
  );

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    haptic("light");
  }, [haptic]);
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => {
      const next = !prev;
      haptic(next ? "medium" : "light");
      return next;
    });
  }, [haptic]);
  const handleSignOut = useCallback(async () => {
    await signOut({ callbackUrl: "/" });
  }, []);
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  if (mounted && pathname?.startsWith('/auth')) return null

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.08)] border-b border-gray-200/60 dark:border-gray-800/60"
          : "bg-white dark:bg-gray-950 border-b border-transparent",
      )}
    >
      {/* Announcement bar */}
      <div
        className={cn(
          "bg-gradient-to-r from-indigo-600 via-blue-600 to-blue-600 text-white text-xs overflow-hidden transition-all duration-200 ease-out",
          announcementVisible ? "max-h-10 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="sip-container-wide py-2 flex items-center justify-center gap-2 relative">
          <div className="flex items-center gap-1.5 sm:gap-2 pr-6 sm:pr-0">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
            <span className="font-medium text-xs">
              <span className="hidden sm:inline">New: </span>Citizenship Timeline Calculator
            </span>
            <Link
              href="/tools/citizenship-timeline"
              className="underline underline-offset-2 font-semibold hover:text-blue-100 transition-colors whitespace-nowrap text-xs"
            >
              Try free &rarr;
            </Link>
          </div>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-3 sm:right-4 p-1 hover:bg-white/20 rounded transition-colors touch-manipulation"
            aria-label="Dismiss announcement"
          >
            <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>

      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          {logoError && mounted ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white text-sm font-bold shadow-sm">
              CH
            </div>
          ) : (
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900 ring-1 ring-gray-200/80 dark:ring-gray-800 transition-transform duration-200 group-hover:scale-105 shrink-0">
              <img
                src="/images/logo-removebg.png"
                alt="Swiss Immigration Pro"
                width={32}
                height={32}
                className="w-full h-full object-contain"
                onError={() => setLogoError(true)}
                onLoad={() => setLogoError(false)}
              />
            </div>
          )}
          <div className="hidden sm:block">
            <span className="text-[15px] font-bold tracking-tight text-gray-900 dark:text-white">
              Swiss<span className="text-red-600">Immigration</span>
            </span>
            <span className="ml-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
              Pro
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative px-3.5 py-2 text-sm font-medium rounded-md transition-colors duration-150",
                isActive(item.href)
                  ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800/60"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-900",
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-red-600 rounded-full" />
              )}
            </Link>
          ))}
          <ResourcesDropdown />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          <div className="hidden lg:block">
            <AdvancedSearch />
          </div>
          <div className="hidden lg:block w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1" />
          <div className="hidden sm:block">
            <DarkModeToggle />
          </div>
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          {mounted && appUser && (
            <div className="hidden sm:block">
              <NotificationBell />
            </div>
          )}
          <div className="hidden lg:block w-px h-5 bg-gray-200 dark:bg-gray-800 mx-1" />

          {/* Desktop auth */}
          {mounted && (
            <div className="hidden lg:flex items-center gap-1">
              {appUser ? (
                <>
                  {/* Show upgrade CTA for free users */}
                  {appUser.packId === "free" && (
                    <Link
                      href="/pricing"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg transition-all duration-200 hover:shadow-md"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      Upgrade to Pro
                    </Link>
                  )}
                  {/* Profile dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileOpen((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    >
                      {appUser.isAdmin ? (
                        <Shield className="h-3.5 w-3.5" />
                      ) : (
                        <User className="h-3.5 w-3.5" />
                      )}
                      {appUser.name ?? (appUser.isAdmin ? t("auth.admin") : t("nav.dashboard"))}
                      <ChevronDown className="h-3 w-3" />
                    </button>
                    <AnimatePresence>
                      {profileOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setProfileOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.97 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 w-56 z-50 bg-white dark:bg-gray-900 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-800 py-2"
                          >
                            {/* Pack badge */}
                            <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                                  appUser.packId === "citizenship"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
                                    : appUser.packId === "advanced"
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
                                      : appUser.packId === "immigration"
                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
                                )}
                              >
                                <Crown className="h-3 w-3" />
                                {(appUser.packId ?? "free").toUpperCase()} PACK
                              </span>
                              {appUser.packId !== "citizenship" && (
                                <Link
                                  href="/pricing"
                                  onClick={() => setProfileOpen(false)}
                                  className="block mt-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                >
                                  Upgrade plan &rarr;
                                </Link>
                              )}
                            </div>
                            <Link
                              href={appUser.isAdmin ? "/admin" : "/dashboard"}
                              onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              {appUser.isAdmin ? (
                                <Shield className="h-3.5 w-3.5" />
                              ) : (
                                <User className="h-3.5 w-3.5" />
                              )}
                              {appUser.isAdmin ? t("auth.admin") : t("nav.dashboard")}
                            </Link>
                            <button
                              onClick={() => {
                                setProfileOpen(false);
                                handleSignOut();
                              }}
                              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            >
                              <LogOut className="h-3.5 w-3.5" />
                              Sign out
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="px-3.5 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                  >
                    {t("auth.login")}
                  </Link>
                  <Link
                    href="/consultation"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm"
                  >
                    Book Consultation
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              )}
            </div>
          )}

          {/* Mobile toggle */}
          <button
            onClick={toggleMenu}
            className="ml-1 inline-flex items-center justify-center rounded-lg p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors lg:hidden touch-manipulation"
            aria-label="Toggle navigation menu"
            style={{ WebkitTapHighlightColor: "transparent" }}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <MobileDrawer
            appUser={appUser}
            navigationItems={navigationItems}
            isActive={isActive}
            onClose={closeMenu}
            onSignOut={handleSignOut}
          />
        )}
      </AnimatePresence>

      <KeyboardShortcutsModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </header>
  );
}
