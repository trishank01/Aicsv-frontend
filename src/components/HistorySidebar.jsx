import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { History, FileText, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const HistorySidebar = ({ history, onSelectReport, currentReportId, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="w-80 h-screen border-r bg-card/50 backdrop-blur-xl fixed left-0 top-0 z-40 flex flex-col pt-16 animate-in slide-in-from-left duration-300 shadow-xl">
            <div className="p-4 border-b flex items-center gap-2">
                <History className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-semibold tracking-tight">Report History</h2>
            </div>

            <ScrollArea className="flex-1 p-4">
                {history.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10 text-sm">
                        No history yet. Upload a CSV to get started.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item, idx) => (
                            <Button
                                key={item.id}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-between h-auto py-3 px-4 text-left font-normal border transition-all",
                                    currentReportId === item.id
                                        ? "bg-primary/10 border-primary/20 text-primary shadow-sm"
                                        : "hover:bg-accent border-transparent"
                                )}
                                onClick={() => onSelectReport(item)}
                            >
                                <div className="flex flex-col gap-1 overflow-hidden">
                                    <span className="font-medium truncate">{item.report.title}</span>
                                    <span className="text-xs text-muted-foreground text-ellipsis">
                                        {new Date(item.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                {currentReportId === item.id && <ChevronRight className="h-4 w-4 opacity-50" />}
                            </Button>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    );
};

export default HistorySidebar;
