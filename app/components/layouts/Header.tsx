"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { siteConfig } from "../../lib/siteConfig";
import { ThemeSwitch } from "../ui/ThemeSwitch";

const links = [
  { href: "#about",      label: "Overview" },
  { href: "#background", label: "Background" },
  { href: "#monitorhub", label: "Monitor Hub" },
  { href: "#datalab",    label: "Analysis Lab" },
  { href: "#projects",   label: "Projects" },
  { href: "#contact",    label: "Contact" },
];

export function Header() {
  const [scrolled, setScrolled] = React.useState(false);
  const [active,   setActive]   = React.useState<string | null>(null);
  const [isOpen,   setIsOpen]   = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      if (window.scrollY > 120 && isOpen) setIsOpen(false);
    };
    window.addEventListener("scroll", onScroll);
    onScroll(); // Check initial scroll
    return () => window.removeEventListener("scroll", onScroll);
  }, [isOpen]);

  // Close menu when clicking a link
  const handleLinkClick = () => setIsOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-300 ${
          scrolled ? "pt-4" : "pt-0"
        }`}
      >
        <div 
          className={`flex items-center gap-1.5 transition-all duration-300 ${
            scrolled 
              ? "px-3 md:px-4 py-2 md:py-2.5 rounded-full bg-white/70 dark:bg-card/50 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-lg" 
              : "w-full max-w-7xl px-6 py-6 md:py-10 bg-transparent border-transparent shadow-none"
          }`}
        >
              {/* Logo pip */}
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 mr-2 md:mr-4 flex items-center justify-center text-sm font-black text-black shrink-0 shadow-lg shadow-orange-500/20">
                {siteConfig.author.name.charAt(0)}
              </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 mx-auto">
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onMouseEnter={() => setActive(link.href)}
                    onMouseLeave={() => setActive(null)}
                    className={`relative px-4 py-1.5 text-sm font-semibold transition-all duration-200 rounded-full ${
                      scrolled 
                        ? "text-black/60 dark:text-foreground/70 hover:text-black dark:hover:text-foreground" 
                        : "text-white hover:text-white"
                    }`}
                  >
                    {active === link.href && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-black/5 dark:bg-primary/20 dark:border dark:border-primary/20"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                ))}
              </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors ml-auto"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="hidden sm:flex items-center">
            <a
              href="#contact"
              className="ml-1 md:ml-2 px-3 md:px-4 py-1.5 rounded-full bg-amber-400 dark:shadow-[0_0_15px_rgba(251,191,36,0.3)] text-black text-[11px] md:text-sm font-bold hover:bg-amber-300 transition-all shrink-0"
            >
              Hire Me
            </a>
            <div className="ml-1 md:ml-4 pl-2 md:pl-4 border-l border-black/10 dark:border-white/10 shrink-0">
              <ThemeSwitch />
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[-1] md:hidden"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="absolute top-[calc(100%+12px)] left-4 right-4 p-3 rounded-2xl bg-white/90 dark:bg-card/90 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl md:hidden overflow-hidden"
              >
                <div className="flex flex-col gap-1">
                  {links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={handleLinkClick}
                      className="flex items-center px-4 py-3 rounded-xl text-sm font-semibold text-black/70 dark:text-foreground/80 hover:bg-black/5 dark:hover:bg-white/5 hover:text-amber-600 dark:hover:text-amber-400 transition-all"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="pt-2 mt-2 border-t border-black/5 dark:border-white/5 flex flex-col gap-2">
                    <a
                      href="#contact"
                      onClick={handleLinkClick}
                      className="flex items-center justify-center w-full py-3 rounded-xl bg-amber-400 text-black text-sm font-bold hover:bg-amber-300 transition-all"
                    >
                      Hire Me
                    </a>
                    <div className="flex items-center justify-between px-4 py-2 text-sm text-black/50 dark:text-white/50">
                      <span>Appearance</span>
                      <ThemeSwitch />
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
