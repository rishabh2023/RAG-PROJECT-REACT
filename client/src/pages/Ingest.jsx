import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, CheckCircle, Info, FileText, Folder, Zap, Database } from "lucide-react";
import { ingestDocuments } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const Ingest = () => {
  const [pdfPath, setPdfPath] = useState("app/data/documents");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const handleIngest = async () => {
    setLoading(true);
    try {
      const response = await ingestDocuments(pdfPath);
      setResults(response.ingested);
      toast({
        title: "PDF ingestion completed successfully!",
        description: `Processed ${response.ingested.pages} pages into ${response.ingested.chunks} chunks.`,
      });
    } catch (error) {
      toast({
        title: "Ingestion failed",
        description: error.message,
        variant: "destructive",
      });
      console.error("Ingest error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center">
          <Database className="h-8 w-8 mr-3 text-primary" />
          Document Ingestion
        </h2>
        <p className="text-muted-foreground">Process PDF documents to build your knowledge base for intelligent search</p>
      </div>

      {/* Ingest Configuration */}
      <Card className="rounded-2xl shadow-lg card-hover">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Folder className="h-5 w-5 mr-2 text-primary" />
            PDF Processing
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pdf-path" className="block text-sm font-medium text-foreground mb-2">
                PDF Folder Path
              </Label>
              <Input
                id="pdf-path"
                type="text"
                value={pdfPath}
                onChange={(e) => setPdfPath(e.target.value)}
                placeholder="app/data/documents"
                className="input-focus"
                data-testid="input-pdf-path"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Specify the folder path containing PDF documents to process
              </p>
            </div>
            
            <Button
              onClick={handleIngest}
              disabled={loading}
              className="button-primary w-full sm:w-auto"
              data-testid="button-ingest"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Ingest PDFs
                </span>
              )}
            </Button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 flex items-start">
              <Info className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0" />
              Re-run ingest after adding or changing PDFs to update the knowledge base.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ingest Results */}
      {results && (
        <Card className="rounded-2xl shadow-lg card-hover animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              Ingestion Complete
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-sm text-green-600 font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Pages Processed
                </div>
                <div className="text-2xl font-bold text-green-700" data-testid="text-pages-count">
                  {results.pages}
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-600 font-medium flex items-center">
                  <Database className="h-4 w-4 mr-1" />
                  Chunks Created
                </div>
                <div className="text-2xl font-bold text-blue-700" data-testid="text-chunks-count">
                  {results.chunks}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Ingest;
