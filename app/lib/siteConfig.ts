export const siteConfig = {
  name: "Robel Hailu",
  title: "Robel Hailu Woldesenebet | Backend & Platform Engineer",
  description: "Backend & Platform Engineer specializing in microservices, distributed systems, and fintech platforms — building with Go, Node.js, Kafka, Redis, and PostgreSQL.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "/og.jpg",
  links: {
    github:   "https://github.com/Robiin28",
    linkedin: "https://linkedin.com/in/mr-robel-hailu-854143239/",
    twitter:  "",
    email:    "mailto:robiiihailuu@gmail.com",
    phone:    "+251 986 991 447",
  },
  author: {
    name: "Robel Hailu Woldesenebet",
    role: "Backend & Platform Engineer",
  },
};

export type SiteConfig = typeof siteConfig;
