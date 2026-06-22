import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function FreeAuditPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 py-24 bg-background flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-primary/20 blur-[150px]" />
        
        <div className="container px-4 md:px-6 mx-auto max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm text-primary backdrop-blur-sm mb-6">
            <Search className="mr-2 h-4 w-4" />
            <span>AI Search Visibility Audit</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl mb-6">
            Is Your Website Ready for AI Search?
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10">
            Enter your URL below to get a free, comprehensive analysis of how visible your brand is to ChatGPT, Gemini, and Claude.
          </p>
          
          <div className="bg-card/50 backdrop-blur border border-border/50 p-2 rounded-full flex flex-col sm:flex-row shadow-2xl">
            <Input 
              type="url" 
              placeholder="https://yourwebsite.com" 
              className="border-0 bg-transparent h-14 px-6 text-lg focus-visible:ring-0 shadow-none"
            />
            <Button className="h-14 px-8 rounded-full text-base sm:ml-2 mt-2 sm:mt-0">
              Analyze Website
            </Button>
          </div>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-2xl mb-1">10k+</span>
              Audits Run
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-2xl mb-1">5</span>
              LLMs Checked
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-2xl mb-1">15+</span>
              Data Points
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-foreground text-2xl mb-1">100%</span>
              Actionable
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
