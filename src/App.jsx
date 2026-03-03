import React, { useState, useEffect } from 'react';
import { LayoutDashboard, FileText, Menu, X } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import ReportView from '@/components/ReportView';
import HistorySidebar from '@/components/HistorySidebar';
import { uploadCSV } from '@/api';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from 'lucide-react';

function App() {
  const [report, setReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('ai_consultant_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const saveHistory = (newReport) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      report: newReport
    };

    const updatedHistory = [newEntry, ...history].slice(0, 5); // Keep last 5
    setHistory(updatedHistory);
    localStorage.setItem('ai_consultant_history', JSON.stringify(updatedHistory));
    return newEntry;
  };

  const handleUpload = async (file) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await uploadCSV(file);
      // Validate result structure roughly
      if (!result || !result.title) throw new Error("Invalid response from AI");

      const entry = saveHistory(result);
      setReport(entry.report); // Show the report
    } catch (err) {
      console.error(err);
      setError("Failed to analyze data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemoCSV = (filename) => {
    // Explicitly download the file without processing it through AI
    const link = document.createElement("a");
    link.href = `/democsv/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleHistorySelect = (entry) => {
    setReport(entry.report);
    setIsSidebarOpen(false); // Close sidebar on mobile/desktop selection
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col relative overflow-hidden">

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Button variant="ghost" size="icon" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
            <a className="mr-6 flex items-center space-x-2" href="/">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="hidden font-bold sm:inline-block">AI Data Consultant</span>
            </a>
          </div>
          {/* Mobile Menu Button */}
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="w-full flex-1 md:w-auto md:flex-none">
              {/* Could add search here */}
            </div>
            <nav className="flex items-center gap-2">
              <a
                href="https://www.linkedin.com/in/trishank-dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline text-muted-foreground hidden sm:block mr-2"
              >
                Built by Trishank
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-1">
                    Try Demo Data <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => loadDemoCSV('ecommerce_sales.csv')}>
                    E-commerce Sales
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => loadDemoCSV('healthcare_metrics.csv')}>
                    Healthcare Metrics
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => loadDemoCSV('saas_engagement.csv')}>
                    SaaS User Engagement
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => loadDemoCSV('manufacturing_qc.csv')}>
                    Manufacturing Quality
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => loadDemoCSV('real_estate.csv')}>
                    Real Estate Listings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="default" size="sm" onClick={() => setReport(null)}>New Analysis</Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container py-6 md:py-10 relative">
        <HistorySidebar
          history={history}
          onSelectReport={handleHistorySelect}
          currentReportId={null} // We could track current ID
          isOpen={isSidebarOpen}
        />

        <div className={`transition-all duration-300 ${isSidebarOpen ? 'md:pl-80' : ''}`}>
          {error && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 border border-destructive/20">
              {error}
            </div>
          )}

          {!report ? (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">
                  Strategic Data Intelligence
                </h1>
                <p className="text-muted-foreground text-lg">
                  Upload your dataset and get instant, consultant-grade strategic insights powered by AI.
                </p>
              </div>
              <FileUpload onUpload={handleUpload} isLoading={isLoading} />
            </div>
          ) : (
            <ReportView report={report} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
