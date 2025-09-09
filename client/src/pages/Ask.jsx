import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Lightbulb, FileText } from "lucide-react";
import { askQuestion } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const Ask = () => {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState("5");
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const { toast } = useToast();

  const handleAsk = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a question first.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await askQuestion(query, parseInt(topK));
      const endTime = Date.now();
      
      setAnswer(response.answer);
      setResponseTime(endTime - startTime);
      
      toast({
        title: "Answer generated successfully!",
        description: "Your question has been processed.",
      });
    } catch (error) {
      toast({
        title: "Failed to get answer",
        description: error.message,
        variant: "destructive",
      });
      console.error("Ask error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">Ask Questions</h2>
        <p className="text-muted-foreground">Get AI-powered answers based on your document knowledge base</p>
      </div>

      {/* Query Interface */}
      <Card className="rounded-2xl shadow-lg card-hover">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="query-input" className="block text-sm font-medium text-foreground mb-2">
                Your Question
              </Label>
              <Input
                id="query-input"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question about loan requirements, eligibility, or documentation..."
                className="input-focus text-lg py-4"
                data-testid="input-query"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Label htmlFor="top-k" className="text-sm font-medium text-foreground">
                  Top K Results:
                </Label>
                <Select value={topK} onValueChange={setTopK}>
                  <SelectTrigger className="w-20" data-testid="select-top-k">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleAsk}
                disabled={loading}
                className="button-primary"
                data-testid="button-ask"
              >
                {loading ? (
                  <span className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Ask Question
                  </span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Answer Display */}
      {answer && (
        <Card className="rounded-2xl shadow-lg card-hover animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2 text-primary" />
              AI Response
            </h3>
            
            <div className="prose max-w-none">
              <div className="bg-muted p-6 rounded-lg border-l-4 border-primary">
                <div className="whitespace-pre-wrap text-foreground leading-relaxed" data-testid="text-answer">
                  {answer}
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <span>
                  Response time: <span className="font-medium" data-testid="text-response-time">{responseTime}ms</span>
                </span>
                <span className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Grounded on uploaded PDFs
                </span>
              </div>
              <label className="flex items-center text-muted-foreground cursor-not-allowed opacity-50">
                <input type="checkbox" disabled className="mr-2" />
                Show sources (coming soon)
              </label>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Ask;
