import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Brain, Sparkles, MessageCircle, Send, ClipboardList, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { AnalysisResult, AnswerResult } from "@shared/schema";

interface ChatMessage {
  id: string;
  type: "question" | "answer";
  content: string;
  timestamp: Date;
}

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await apiRequest("POST", "/api/analyze", { text });
      return response.json() as Promise<AnalysisResult>;
    },
    onSuccess: (result) => {
      setAnalysisResult(result);
      setError(null);
      setChatMessages([]); // Clear previous chat when new analysis is done
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to analyze text";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const askMutation = useMutation({
    mutationFn: async ({ originalText, question }: { originalText: string; question: string }) => {
      const response = await apiRequest("POST", "/api/ask", { originalText, question });
      return response.json() as Promise<AnswerResult>;
    },
    onSuccess: (result, variables) => {
      const questionId = Date.now().toString();
      const answerId = (Date.now() + 1).toString();
      
      setChatMessages(prev => [
        ...prev,
        {
          id: questionId,
          type: "question",
          content: variables.question,
          timestamp: new Date(),
        },
        {
          id: answerId,
          type: "answer",
          content: result.answer,
          timestamp: new Date(),
        }
      ]);
      setCurrentQuestion("");
      setError(null);
    },
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Failed to get answer";
      setError(errorMessage);
      toast({
        title: "Question Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!inputText.trim()) {
      setError("Please enter some text to analyze");
      return;
    }
    analyzeMutation.mutate(inputText);
  };

  const handleAskQuestion = () => {
    if (!currentQuestion.trim()) {
      setError("Please enter a question");
      return;
    }
    if (!inputText.trim()) {
      setError("Please analyze some text first");
      return;
    }
    askMutation.mutate({ originalText: inputText, question: currentQuestion });
  };

  const clearError = () => setError(null);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Brain className="text-primary text-xl w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">TL;DR AI</h1>
              <p className="text-sm text-muted-foreground">Intelligent Text Analysis Tool</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Text Input and Results Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Text Input Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Paste Your Text</CardTitle>
                <CardDescription>
                  Enter any article, report, or document for AI analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your text here... (articles, reports, emails, etc.)"
                    className="min-h-64 resize-none"
                    data-testid="textarea-input"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
                    {inputText.length} characters
                  </div>
                </div>
                
                <Button 
                  onClick={handleAnalyze}
                  disabled={analyzeMutation.isPending || !inputText.trim()}
                  className="w-full"
                  data-testid="button-analyze"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {analyzeMutation.isPending ? "Analyzing..." : "Analyze Text"}
                </Button>
              </CardContent>
            </Card>

            {/* Loading State */}
            {analyzeMutation.isPending && (
              <Card className="shadow-lg">
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">AI is analyzing your text...</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">This may take a few moments</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Results Card */}
            {analysisResult && !analyzeMutation.isPending && (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardList className="w-5 h-5 text-primary" />
                    Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* One-Sentence Summary */}
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
                      Summary
                    </h3>
                    <p className="text-foreground leading-relaxed" data-testid="text-summary">
                      {analysisResult.summary}
                    </p>
                  </div>
                  
                  {/* Key Points */}
                  <div className="bg-accent/30 border border-border rounded-lg p-4">
                    <h3 className="text-sm font-medium text-foreground mb-3 uppercase tracking-wide">
                      Key Points
                    </h3>
                    <ul className="space-y-2" data-testid="list-keypoints">
                      {analysisResult.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-3 text-foreground">
                          <div className="bg-primary/20 p-1 rounded-full mt-1 flex-shrink-0">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          </div>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Q&A Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg h-fit sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  Ask Questions
                </CardTitle>
                <CardDescription>
                  Ask specific questions about the analyzed text
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Chat Messages */}
                <div className="space-y-4 max-h-96 overflow-y-auto" data-testid="chat-messages">
                  {chatMessages.map((message) => (
                    <div key={message.id} className="chat-message animate-in slide-in-from-bottom-2">
                      {message.type === "question" ? (
                        <div className="bg-primary/10 rounded-lg p-3 mb-2">
                          <p className="text-sm text-foreground">{message.content}</p>
                          <span className="text-xs text-muted-foreground">You</span>
                        </div>
                      ) : (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm text-foreground">{message.content}</p>
                          <span className="text-xs text-muted-foreground">AI Assistant</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Question Input */}
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={currentQuestion}
                      onChange={(e) => setCurrentQuestion(e.target.value)}
                      placeholder="Ask a question about the text..."
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAskQuestion();
                        }
                      }}
                      disabled={askMutation.isPending}
                      data-testid="input-question"
                    />
                    <Button
                      onClick={handleAskQuestion}
                      disabled={askMutation.isPending || !currentQuestion.trim() || !inputText.trim()}
                      size="icon"
                      data-testid="button-ask"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Loading indicator for questions */}
                  {askMutation.isPending && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                      <span className="ml-2">AI is thinking...</span>
                    </div>
                  )}
                  
                  <p className="text-xs text-muted-foreground">
                    Questions will be answered based only on the provided text
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 max-w-md z-50">
          <Card className="bg-destructive/10 border-destructive/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-destructive mt-0.5 w-4 h-4" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-destructive-foreground">Error</p>
                  <p className="text-sm text-destructive-foreground/80">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearError}
                  className="h-6 w-6 text-destructive hover:text-destructive/80"
                  data-testid="button-close-error"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
