"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Clock, Phone } from "lucide-react";
import { siteConfig } from "../../lib/siteConfig";

const schema = z.object({
  name:    z.string().min(2, "Name must be at least 2 characters"),
  email:   z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type FormValues = z.infer<typeof schema>;

export function Contact() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success">("idle");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormValues) => {
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
    reset();
  };

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Orbs */}
      <div className="orb orb-violet w-[500px] h-[500px] bottom-0 right-20 opacity-20" />
      <div className="orb orb-pink w-[400px] h-[400px] top-20 left-20 opacity-15" />

      <div className="container mx-auto relative z-10">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-220px" }}
          className="flex flex-col items-center text-center gap-4 mb-16"
        >
          <span className="section-label">
            <Mail className="w-3 h-3" />
            Get In Touch
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tighter text-foreground">
            Let&apos;s Work{" "}
            <span className="gradient-text">Together</span>
          </h2>
          <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
            Have a project in mind or want to collaborate? Drop me a message and I'll get back to you within 24 hours.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
          {/* Sidebar info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-220px" }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            {[
              { icon: Mail,    label: "Email",    value: siteConfig.links.email.replace("mailto:", ""), href: siteConfig.links.email },
              { icon: Phone,   label: "Phone",    value: siteConfig.links.phone,                        href: `tel:${siteConfig.links.phone.replace(/\s/g, "")}` },
              { icon: MapPin,  label: "Location", value: "Addis Ababa, Ethiopia",                       href: "#" },
              { icon: Clock,   label: "Response", value: "Within 24 hours",                             href: "#" },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="glass-card rounded-2xl p-5 flex items-center gap-4 group hover:shadow-card-hover transition-all duration-300 hover:border-primary/20"
              >
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgb(var(--primary)/0.4)] group-hover:scale-110 transition-transform duration-300 text-white">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground">{value}</p>
                </div>
              </a>
            ))}

            <div className="glass-card rounded-2xl p-5 mt-2">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-semibold">Connect</p>
              <div className="flex gap-3">
                {[
                  { label: "GH",  href: siteConfig.links.github },
                  { label: "LI",  href: siteConfig.links.linkedin },
                  { label: "TW",  href: siteConfig.links.twitter },
                ].filter(({ href }) => href).map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 h-10 rounded-xl glass flex items-center justify-center text-xs font-bold font-mono text-muted-foreground hover:text-primary hover:border-primary/30 transition-all border border-border"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-220px" }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-3xl p-8 gradient-border">
              {status === "success" ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto shadow-[0_0_20px_rgb(var(--primary)/0.4)] text-white">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-foreground">Message Sent!</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. I'll get back to you soon.</p>
                  <button onClick={() => setStatus("idle")} className="btn-ghost-neon mt-4">
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
                      <input {...register("name")} className="input-glass" placeholder="John Doe" disabled={status === "loading"} />
                      {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</label>
                      <input {...register("email")} type="email" className="input-glass" placeholder="john@example.com" disabled={status === "loading"} />
                      {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</label>
                    <input {...register("subject")} className="input-glass" placeholder="Project collaboration" disabled={status === "loading"} />
                    {errors.subject && <p className="text-xs text-red-400">{errors.subject.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message</label>
                    <textarea {...register("message")} className="input-glass min-h-[150px] resize-none" placeholder="Tell me about your project..." disabled={status === "loading"} />
                    {errors.message && <p className="text-xs text-red-400">{errors.message.message}</p>}
                  </div>
                  <button type="submit" className="btn-neon w-full" disabled={status === "loading"}>
                    <span className="flex items-center justify-center gap-2">
                      {status === "loading" ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
