import { Header }  from "./components/layouts/Header";
import { Hero }     from "./components/sections/Hero";
import { About }    from "./components/sections/About";
import { Background } from "./components/sections/Background";
import { MonitorHub } from "./components/sections/MonitorHub";
import { DataLab } from "./components/sections/DataLab";
import { Projects } from "./components/sections/Projects";
import { Contact }  from "./components/sections/Contact";
import { Footer }   from "./components/sections/Footer";
import { ChatBot }  from "./components/ui/ChatBot";
import { CustomCursor } from "./components/ui/CustomCursor";
import { AnalyticsCommand } from "./components/ui/AnalyticsCommand";
import { GlobalSentinel } from "./components/ui/GlobalSentinel";
import { getFeaturedProjects, getExperiences, getSkills, getBackground, getProfile } from "./lib/data";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default async function Home() {
  const [projects, experiences, skillsData, background, profile] = await Promise.all([
    getFeaturedProjects(),
    getExperiences(),
    getSkills(),
    getBackground(),
    getProfile(),
  ]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background" style={{ cursor: "none" }}>
        <CustomCursor />
        <AnalyticsCommand />
        <Header />
        <main className="flex-grow">
          <Hero yearsExperience={profile.yearsExperience} resumeUrl={profile.resumeUrl} />
          <About
            experiences={experiences}
            skills={skillsData.categories}
            portraitUrl={profile.aboutPortraitUrl}
            bio={profile.bio}
            location={profile.location}
            availabilityText={profile.availabilityText}
          />
          <Background data={background} />
          <MonitorHub />
          <DataLab />
          <Projects initialProjects={projects} />
          <Contact />
        </main>
        <GlobalSentinel portraitUrl={profile.sentinelPortraitUrl} />
        <ChatBot />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}
