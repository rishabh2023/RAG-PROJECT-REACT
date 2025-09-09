import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot, 
  Settings, 
  FileText, 
  Trash2, 
  Copy,
  Check,
  MessageSquare
} from "lucide-react";
import { askQuestion } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const Ask = () => {
  const [query, setQuery] = useState("");
  const [topK, setTopK] = useState("5");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAsk = async () => {
    if (!query.trim()) {
      toast({
        title: "Please enter a question first.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery("");
    setLoading(true);
    const startTime = Date.now();
    
    try {
      const response = await askQuestion(query, parseInt(topK));
      const endTime = Date.now();
      
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response.answer,
        timestamp: new Date(),
        responseTime: endTime - startTime,
      };

      setMessages(prev => [...prev, aiMessage]);
      
      toast({
        title: "Answer generated successfully!",
        description: "Your question has been processed.",
      });
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: `I apologize, but I encountered an error while processing your question: ${error.message}`,
        timestamp: new Date(),
        isError: true,
      };

      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Failed to get answer",
        description: error.message,
        variant: "destructive",
      });
      console.error("Ask error:", error);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    toast({
      title: "Chat cleared",
      description: "All messages have been removed.",
    });
  };

  const handleCopyMessage = async (messageContent, messageId) => {
    try {
      await navigator.clipboard.writeText(messageContent);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
      toast({
        title: "Message copied!",
        description: "Message has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy message to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center justify-center">
          <MessageSquare className="h-8 w-8 mr-3 text-primary" />
          AI Chat Assistant
        </h2>
        <p className="text-muted-foreground">Have a conversation with AI powered by your document knowledge base</p>
      </div>

      {/* Chat Container */}
      <Card className="flex-1 rounded-2xl shadow-lg card-hover flex flex-col">
        <CardHeader className="pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-medium text-foreground">Loan Support Assistant</span>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Top K:</span>
                <Select value={topK} onValueChange={setTopK}>
                  <SelectTrigger className="w-16 h-8" data-testid="select-top-k">
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
              
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearChat}
                  className="text-muted-foreground hover:text-destructive"
                  data-testid="button-clear-chat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Start a conversation</h3>
                <p className="text-muted-foreground max-w-md">
                  Ask me anything about loan requirements, eligibility criteria, documentation, or any other questions related to your uploaded documents.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQuery("What are the basic loan eligibility requirements?")}
                    className="text-sm"
                  >
                    💼 Eligibility requirements
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQuery("What documents do I need for a loan application?")}
                    className="text-sm"
                  >
                    📄 Required documents
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setQuery("How long does the loan approval process take?")}
                    className="text-sm"
                  >
                    ⏱️ Processing time
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "ai" && (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <Bot className="h-5 w-5 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-[70%] ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground rounded-2xl rounded-tr-sm"
                          : message.isError
                          ? "bg-destructive/10 text-destructive border border-destructive/20 rounded-2xl rounded-tl-sm"
                          : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                      } p-4 relative group animate-fade-in`}
                    >
                      <div className="whitespace-pre-wrap leading-relaxed" data-testid="message-content">
                        {message.content}
                      </div>
                      
                      <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                        <span>{formatTime(message.timestamp)}</span>
                        {message.responseTime && (
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            {message.responseTime}ms
                          </span>
                        )}
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyMessage(message.content, message.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                      >
                        {copiedMessageId === message.id ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>

                    {message.type === "user" && (
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="h-5 w-5 text-secondary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {loading && (
                  <div className="flex items-start space-x-3 justify-start">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="bg-muted text-foreground rounded-2xl rounded-tl-sm p-4 max-w-[70%]">
                      <div className="flex items-center space-x-2">
                        <LoadingSpinner size="sm" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-border p-4">
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question about loans, eligibility, or documentation..."
                  className="input-focus resize-none min-h-[2.5rem] py-3"
                  disabled={loading}
                  data-testid="input-query"
                />
              </div>
              <Button
                onClick={handleAsk}
                disabled={loading || !query.trim()}
                className="button-primary h-10 w-10 p-0"
                data-testid="button-ask"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="mt-2 flex items-center justify-center text-xs text-muted-foreground">
              <FileText className="h-3 w-3 mr-1" />
              Answers are grounded on your uploaded PDF documents
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ask;
