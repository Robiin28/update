import { siteConfig } from "../../lib/siteConfig";
import { Code, User, MessageCircle, Mail, Heart } from "lucide-react";

const links = [
  { href: "#about",      label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills",     label: "Skills" },
  { href: "#background", label: "Background" },
  { href: "#projects",   label: "Projects" },
  { href: "#contact",    label: "Contact" },
];

const social = [
  { href: siteConfig.links.github,   Icon: Code,          label: "GitHub" },
  { href: siteConfig.links.linkedin, Icon: User,          label: "LinkedIn" },
  { href: siteConfig.links.twitter,  Icon: MessageCircle, label: "Twitter" },
  { href: `mailto:${siteConfig.links.email}`, Icon: Mail,  label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border overflow-hidden bg-background">
      {/* Gradient top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

      <div className="container mx-auto py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-display font-bold text-sm shadow-[0_0_15px_rgb(var(--primary)/0.4)]">
                {siteConfig.author.name.charAt(0)}
              </span>
              <span className="font-display font-bold text-lg text-foreground">
                {siteConfig.author.name.split(" ")[0]}<span className="text-primary">.</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[260px]">
              {siteConfig.author.role}. Building and operating production systems in fintech.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Navigation</p>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Connect</p>
            <div className="flex gap-3">
              {social.filter(({ href }) => href).map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl glass flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 hover:shadow-[0_0_15px_rgb(var(--primary)/0.2)] transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {siteConfig.author.name}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            Built with Next.js &amp; Framer Motion
            <Heart className="w-3 h-3 text-rose-500 fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
