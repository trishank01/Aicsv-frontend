import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const FileUpload = ({ onUpload, isLoading }) => {
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles?.length > 0) {
            onUpload(acceptedFiles[0]);
        }
    }, [onUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv']
        },
        maxFiles: 1,
        disabled: isLoading
    });

    return (
        <Card className={cn(
            "border-2 border-dashed transition-all duration-300 cursor-pointer hover:border-primary/50",
            isDragActive ? "border-primary bg-primary/5 scale-[1.02]" : "border-border bg-card/50",
            isLoading && "opacity-50 pointer-events-none"
        )}>
            <CardContent
                {...getRootProps()}
                className="flex flex-col items-center justify-center h-64 gap-4 text-center p-6"
            >
                <input {...getInputProps()} />

                {isLoading ? (
                    <div className="flex flex-col items-center animate-pulse">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <p className="text-lg font-medium text-foreground">Analyzing Strategy...</p>
                        <p className="text-sm text-muted-foreground">Consulting with AI models...</p>
                    </div>
                ) : (
                    <>
                        <div className={`p-4 rounded-full ${isDragActive ? "bg-primary/10" : "bg-secondary"}`}>
                            {isDragActive ? (
                                <FileSpreadsheet className="h-10 w-10 text-primary animate-bounce" />
                            ) : (
                                <UploadCloud className="h-10 w-10 text-muted-foreground" />
                            )}
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-semibold tracking-tight">
                                {isDragActive ? "Drop CSV here to analyze" : "Upload Dataset CSV"}
                            </h3>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                Drag and drop your CSV file here, or click to browse.
                                We'll generate a strategic consultant report instantly.
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default FileUpload;
