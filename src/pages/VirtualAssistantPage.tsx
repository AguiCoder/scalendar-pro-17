import { useState, useRef, useEffect } from "react";
import { Send, Mic, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MedicalSidebar } from "@/components/MedicalSidebar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickCommands = [
  "Quem está de plantão amanhã?",
  "Quero trocar meu plantão de sábado",
  "Mostre meus próximos 3 plantões",
  "Quem pode me substituir hoje?",
  "Como solicitar férias?",
  "Ver escala da próxima semana"
];

const mockMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "Olá! Sou o assistente virtual do Escala AI. Como posso ajudá-lo hoje? Você pode me perguntar sobre seus plantões, solicitar trocas, ou verificar a escala da equipe.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5)
  },
  {
    id: "2",
    type: "user",
    content: "Quais são meus próximos plantões?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3)
  },
  {
    id: "3",
    type: "assistant",
    content: "Aqui estão seus próximos plantões:\n\n📅 **Amanhã (4 de janeiro)** - 08h às 18h\n🏥 Departamento: Medicina de Emergência\n📍 Local: Andar 1\n\n📅 **6 de janeiro** - 14h às 22h\n🏥 Departamento: Cardiologia\n📍 Local: Andar 2\n\n📅 **8 de janeiro** - 19h às 07h (plantão noturno)\n🏥 Departamento: UTI\n📍 Local: Andar 3\n\nPrecisa de alguma informação específica sobre estes plantões?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2)
  }
];

export default function VirtualAssistantPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "agora";
    if (diffInMinutes < 60) return `há ${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `há ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `há ${diffInDays}d`;
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Simulate assistant response
    setTimeout(() => {
      const assistantResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: generateResponse(userMessage.content),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("plantão") && input.includes("trocar")) {
      return "Entendi que você quer trocar um plantão. Vou te ajudar com isso!\n\n🔄 **Para solicitar uma troca:**\n1. Acesse 'Meus Plantões'\n2. Encontre o plantão que deseja trocar\n3. Clique em 'Trocar'\n4. Escolha um colega ou deixe aberto para todos\n\nQual plantão específico você gostaria de trocar?";
    }
    
    if (input.includes("quem") && input.includes("plantão")) {
      return "📋 **Plantões de amanhã (4 de janeiro):**\n\n🌅 **Manhã (08h-18h):**\n• Dr. Sarah Johnson - Medicina de Emergência\n• Dr. Michael Chen - Cardiologia\n• Dr. Emily Rodriguez - Pediatria\n\n🌙 **Noite (19h-07h):**\n• Dr. David Kim - UTI\n• Dr. Lisa Thompson - Medicina de Emergência\n\nPrecisa de mais detalhes sobre algum departamento específico?";
    }
    
    if (input.includes("férias") || input.includes("folga")) {
      return "🏖️ **Para solicitar férias ou folga:**\n\n1. Vá para 'Preferências' → 'Férias e Ausências'\n2. Clique em 'Adicionar Férias'\n3. Escolha as datas e tipo de ausência\n4. Adicione uma descrição breve\n\nLembre-se: Solicitações com antecedência têm maior chance de aprovação. Posso te ajudar com alguma data específica?";
    }
    
    if (input.includes("escala") || input.includes("agenda")) {
      return "📅 **Sua escala desta semana:**\n\n• **Segunda (3/1)** - Folga\n• **Terça (4/1)** - 08h-18h (Emergência)\n• **Quarta (5/1)** - Folga\n• **Quinta (6/1)** - 14h-22h (Cardiologia)\n• **Sexta (7/1)** - Folga\n• **Sábado (8/1)** - 19h-07h (UTI)\n• **Domingo (9/1)** - Folga\n\nQuer ver a escala de alguma semana específica?";
    }
    
    return "Entendi sua pergunta! Posso te ajudar com:\n\n🔹 **Plantões**: Ver escala, solicitar trocas\n🔹 **Colegas**: Quem está trabalhando\n🔹 **Férias**: Como solicitar ausências\n🔹 **Administração**: Políticas e procedimentos\n\nO que você gostaria de saber especificamente?";
  };

  const handleQuickCommand = (command: string) => {
    setInputValue(command);
    textareaRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MedicalSidebar />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-6">
              <div>
                <h1 className="text-xl font-semibold text-foreground">Assistente Virtual</h1>
                <p className="text-sm text-muted-foreground">Chat inteligente para gerenciar seus plantões e solicitações</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 p-4">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.type === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.type === "assistant" && (
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={cn(
                      "flex flex-col gap-1 max-w-[80%] md:max-w-[70%]",
                      message.type === "user" ? "items-end" : "items-start"
                    )}>
                      <Card className={cn(
                        "p-3",
                        message.type === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted/50"
                      )}>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      </Card>
                      
                      <Tooltip>
                        <TooltipTrigger>
                          <span className="text-xs text-muted-foreground px-1">
                            {formatTimeAgo(message.timestamp)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{message.timestamp.toLocaleString('pt-BR')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {message.type === "user" && (
                      <Avatar className="w-8 h-8 mt-1">
                        <AvatarFallback className="bg-muted">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 mt-1">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    
                    <Card className="p-3 bg-muted/50">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce delay-200" />
                      </div>
                    </Card>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Quick Commands */}
            <div className="px-4 py-2 border-t border-border bg-background/95">
              <div className="max-w-4xl mx-auto">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex gap-2 pb-2">
                    {quickCommands.map((command, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                        onClick={() => handleQuickCommand(command)}
                      >
                        {command}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border bg-background">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-2 items-end">
                  <div className="flex-1 relative">
                    <Textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Digite sua pergunta ou solicitação..."
                      className="min-h-[44px] max-h-32 resize-none pr-12"
                      rows={1}
                    />
                    
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1 h-8 w-8 p-0"
                          disabled
                        >
                          <Mic className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Suporte de voz em breve</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  <Button
                    onClick={sendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="h-11 px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}