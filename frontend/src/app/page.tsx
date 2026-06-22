import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Founder } from "@/components/Founder";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-transparent text-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Founder />
      </main>
      <Footer />
    </div>
  );
}
