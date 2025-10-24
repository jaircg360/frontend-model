import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAgent } from "@/hooks/useAgent";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "agent";
  timestamp: Date;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "¡Hola! 👋 Soy tu agente inteligente. Puedo ayudarte con preguntas sobre el sistema, análisis de datos, recomendaciones de modelos y más. ¿En qué puedo asistirte?",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { askQuestion } = useAgent();

  // Auto-scroll al último mensaje
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const response = await askQuestion(inputMessage);
      
      setIsTyping(false);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response || "Lo siento, no pude procesar tu pregunta.",
        sender: "agent",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      setIsTyping(false);
      toast.error("Error al comunicarse con el agente");
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.",
        sender: "agent",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all duration-300 hover:scale-110 z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Card 
          className="w-80 border-primary/20 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm shadow-2xl cursor-pointer hover:shadow-glow transition-all duration-300"
          onClick={() => setIsMinimized(false)}
        >
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 bg-gradient-to-r from-primary to-secondary">
                  <AvatarFallback className="text-white font-bold">
                    <Sparkles className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card"></div>
              </div>
              <div>
                <CardTitle className="text-base">Agente Inteligente</CardTitle>
                <p className="text-xs text-muted-foreground">En línea</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setIsMinimized(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-300">
      <Card className="w-96 h-[600px] border-primary/20 bg-gradient-to-br from-card to-card/95 backdrop-blur-sm shadow-2xl flex flex-col">
        {/* Header */}
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10 bg-gradient-to-r from-primary to-secondary">
                <AvatarFallback className="text-white font-bold">
                  <Sparkles className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-card animate-pulse"></div>
            </div>
            <div>
              <CardTitle className="text-base">Agente Inteligente</CardTitle>
              <p className="text-xs text-muted-foreground">En línea • Contestamos inmediatamente</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {
                setIsOpen(false);
                setIsMinimized(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom duration-300`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {message.sender === "agent" && (
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-primary to-secondary flex-shrink-0">
                      <AvatarFallback className="text-white">
                        <Sparkles className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-primary to-secondary text-white"
                        : "bg-muted/80 text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-accent to-purple-500 flex-shrink-0">
                      <AvatarFallback className="text-white font-bold">
                        Tú
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start animate-in fade-in duration-300">
                <div className="flex gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-primary to-secondary">
                    <AvatarFallback className="text-white">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted/80 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <CardContent className="p-4 border-t border-border/50">
          <div className="flex gap-2">
            <Input
              placeholder="Escribe tu mensaje..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-muted/50 border-border/50 focus-visible:ring-primary"
              disabled={isTyping}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              className="bg-gradient-to-r from-primary to-secondary hover:shadow-glow transition-all duration-300"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Powered by AI • Model Prep Pro
          </p>
        </CardContent>
      </Card>
    </div>
  );
}



