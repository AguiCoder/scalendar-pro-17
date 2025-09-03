import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  BarChart3, 
  Zap, 
  Heart,
  Shield,
  Star,
  Play,
  ChevronDown,
  Phone,
  Mail,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const LandingPage = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: Calendar,
      title: "Importar plantões",
      description: "Upload da planilha ou integração com sistema existente"
    },
    {
      icon: Users,
      title: "Configurar preferências",
      description: "Cada médico define suas preferências e restrições"
    },
    {
      icon: Zap,
      title: "IA gera escala justa",
      description: "Algoritmo inteligente distribui plantões de forma equilibrada"
    },
    {
      icon: CheckCircle,
      title: "Ajustes rápidos",
      description: "Trocas e alterações em poucos cliques"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Maria Silva",
      role: "Coordenadora de Emergência",
      hospital: "Hospital São Lucas",
      content: "Reduzimos 80% do tempo gasto montando escalas. Agora focamos no que realmente importa: nossos pacientes.",
      rating: 5
    },
    {
      name: "Dr. João Santos",
      role: "Diretor Médico", 
      hospital: "Cooperativa MedCoop",
      content: "A transparência nas escalas eliminou conflitos internos. Todos sabem que o sistema é justo.",
      rating: 5
    },
    {
      name: "Dra. Ana Costa",
      role: "Médica Plantonista",
      hospital: "Hospital Regional",
      content: "Finalmente tenho previsibilidade na minha agenda. Posso planejar minha vida pessoal com antecedência.",
      rating: 5
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Mais tempo para família",
      description: "Escalas previsíveis permitem melhor planejamento pessoal"
    },
    {
      icon: Users,
      title: "Redução de conflitos",
      description: "Distribuição justa elimina discussões sobre plantões"
    },
    {
      icon: Shield,
      title: "Transparência total",
      description: "Todos veem como as escalas são distribuídas"
    },
    {
      icon: BarChart3,
      title: "Métricas de fairness",
      description: "Acompanhe a distribuição equilibrada de plantões"
    }
  ];

  const faqs = [
    {
      question: "E se eu precisar trocar um plantão em cima da hora?",
      answer: "O sistema permite trocas rápidas com notificações automáticas para colegas disponíveis. Todo o processo é rastreado e documentado."
    },
    {
      question: "Como o sistema garante justiça nas escalas?",
      answer: "Nossa IA considera histórico de plantões, preferências pessoais, especialidades e distribuição equilibrada de finais de semana e feriados."
    },
    {
      question: "O que acontece se um médico ficar indisponível de última hora?",
      answer: "O sistema identifica automaticamente substitutos qualificados e envia notificações prioritárias para reorganizar a escala rapidamente."
    },
    {
      question: "Como funciona a integração com sistemas existentes?",
      answer: "Oferecemos APIs e importação de planilhas. Nossa equipe técnica auxilia na integração sem interromper suas operações."
    },
    {
      question: "Os dados dos médicos ficam seguros?",
      answer: "Sim, seguimos rigorosamente a LGPD com criptografia de ponta a ponta, auditoria de dados e conformidade total com regulamentações médicas."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">Escala AI</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#produto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Produto
            </a>
            <a href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Como funciona
            </a>
            <a href="#precos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <a href="#contato" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contato
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              Entrar
            </Button>
            <Button size="sm">
              Agendar Demo
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container px-4 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="secondary" className="w-fit">
              🚀 IA para escalas médicas
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Organize escalas médicas com{" "}
              <span className="text-primary">inteligência artificial</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-[600px]">
              Reduza conflitos, economize tempo e dê mais previsibilidade à vida dos médicos. 
              Nossa IA cria escalas justas e equilibradas automaticamente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg h-12">
                Agende uma demonstração
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg h-12">
                <Play className="mr-2 h-5 w-5" />
                Ver como funciona
              </Button>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-status-confirmed" />
                <span>Setup em 30 minutos</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-status-confirmed" />
                <span>Sem compromisso</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/5">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Escala da Emergência - Dezembro 2024
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium">
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="p-2">{day}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 21 }, (_, i) => (
                    <Card key={i} className={`p-2 text-xs ${i % 7 === 0 || i % 7 === 6 ? 'bg-muted' : 'bg-card'}`}>
                      <div className="text-center font-medium">{i + 1}</div>
                      {i % 3 === 0 && (
                        <Badge variant="secondary" className="text-xs mt-1 w-full justify-center">
                          Dr. Silva
                        </Badge>
                      )}
                    </Card>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>✅ 100% cobertura</span>
                  <span>⚖️ Distribuição justa</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pain vs Solution */}
      <section className="bg-muted/50 py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Da bagunça para a <span className="text-primary">organização inteligente</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Veja como transformamos os maiores problemas das escalas médicas em soluções automáticas
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-destructive/20">
              <CardHeader>
                <div className="text-destructive mb-2">😰</div>
                <CardTitle className="text-destructive">Falta de previsibilidade</CardTitle>
                <CardDescription>
                  Médicos descobrem seus plantões em cima da hora, prejudicando a vida pessoal
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-primary" />
            </div>
            <Card className="border-status-confirmed/20">
              <CardHeader>
                <div className="text-status-confirmed mb-2">🎯</div>
                <CardTitle className="text-status-confirmed">IA gera agenda clara</CardTitle>
                <CardDescription>
                  Escalas definidas com 30 dias de antecedência, permitindo planejamento familiar
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <div className="text-destructive mb-2">😤</div>
                <CardTitle className="text-destructive">Trocas manuais confusas</CardTitle>
                <CardDescription>
                  WhatsApp bagunçado, emails perdidos, trocas não documentadas
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-primary" />
            </div>
            <Card className="border-status-confirmed/20">
              <CardHeader>
                <div className="text-status-confirmed mb-2">⚡</div>
                <CardTitle className="text-status-confirmed">Trocas em 2 cliques</CardTitle>
                <CardDescription>
                  Sistema inteligente encontra substitutos e documenta todas as alterações
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-destructive/20">
              <CardHeader>
                <div className="text-destructive mb-2">⚖️</div>
                <CardTitle className="text-destructive">Conflitos de fairness</CardTitle>
                <CardDescription>
                  Discussões sobre quem trabalha mais finais de semana e feriados
                </CardDescription>
              </CardHeader>
            </Card>
            <div className="flex items-center justify-center">
              <ArrowRight className="h-8 w-8 text-primary" />
            </div>
            <Card className="border-status-confirmed/20">
              <CardHeader>
                <div className="text-status-confirmed mb-2">📊</div>
                <CardTitle className="text-status-confirmed">Distribuição justa</CardTitle>
                <CardDescription>
                  Algoritmo garante equilibrio automático com métricas transparentes
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Confiado por equipes médicas</h2>
            <p className="text-muted-foreground">Já transformamos a gestão de escalas em dezenas de instituições</p>
          </div>
          
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-primary mb-2">80%</div>
              <div className="text-sm text-muted-foreground">menos tempo montando escalas</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">mais previsibilidade para médicos</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm text-muted-foreground">redução de conflitos</div>
            </Card>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-0">
                  <div className="flex mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.hospital}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="bg-muted/50 py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Como funciona</h2>
            <p className="text-xl text-muted-foreground">
              Em 4 passos simples, transforme a gestão das suas escalas
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card 
                    key={index} 
                    className={`p-6 cursor-pointer transition-all duration-300 ${
                      activeStep === index ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-lg'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <CardContent className="pt-0 text-center">
                      <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
                        activeStep === index ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-sm font-medium text-primary mb-2">Passo {index + 1}</div>
                      <h3 className="font-semibold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Mais que um sistema, uma <span className="text-primary">transformação</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
              Impacte positivamente a vida dos médicos e a qualidade do atendimento
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-0">
                    <div className="w-12 h-12 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Monitoring & Intelligence */}
      <section className="bg-muted/50 py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Inteligência além do calendário</h2>
            <p className="text-muted-foreground">
              Monitore fairness, gaps de cobertura e performance da equipe
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Métricas de Fairness
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Dr. Silva - Plantões noturnos</span>
                      <span>8/10</span>
                    </div>
                    <Progress value={80} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Dr. Santos - Finais de semana</span>
                      <span>6/10</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Dra. Costa - Feriados</span>
                      <span>4/10</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-status-confirmed/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-status-confirmed" />
                  </div>
                  <div>
                    <div className="font-medium">Distribuição equilibrada</div>
                    <div className="text-sm text-muted-foreground">
                      Algoritmo garante que todos tenham cargas similares
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-status-available/10 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4 text-status-available" />
                  </div>
                  <div>
                    <div className="font-medium">Análise de gaps</div>
                    <div className="text-sm text-muted-foreground">
                      Identifica automaticamente lacunas de cobertura
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Relatórios em tempo real</div>
                    <div className="text-sm text-muted-foreground">
                      Acompanhe performance e satisfação da equipe
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Strong CTA */}
      <section className="py-16">
        <div className="container px-4">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para transformar a gestão da sua equipe médica?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-[600px] mx-auto">
                Junte-se a centenas de médicos que já descobriram uma forma mais inteligente 
                de gerenciar escalas
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-lg h-12">
                  Agendar Demonstração
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg" className="text-lg h-12">
                  Começar Agora
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-status-confirmed" />
                  <span>Sem compromisso</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-status-confirmed" />
                  <span>Setup gratuito</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-status-confirmed" />
                  <span>Suporte incluso</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/50 py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perguntas frequentes</h2>
            <p className="text-muted-foreground">
              Tire suas dúvidas sobre o Escala AI
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Escala AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Inteligência artificial para escalas médicas mais justas e eficientes.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm">LinkedIn</Button>
                <Button variant="ghost" size="sm">WhatsApp</Button>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-foreground">Integrações</a></li>
                <li><a href="#" className="hover:text-foreground">API</a></li>
                <li><a href="#" className="hover:text-foreground">Segurança</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Sobre nós</a></li>
                <li><a href="#" className="hover:text-foreground">Preços</a></li>
                <li><a href="#" className="hover:text-foreground">Blog</a></li>
                <li><a href="#" className="hover:text-foreground">Carreiras</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>contato@escala.ai</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <div>
              © 2024 Escala AI. Todos os direitos reservados.
            </div>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground">Privacidade</a>
              <a href="#" className="hover:text-foreground">Termos</a>
              <a href="#" className="hover:text-foreground">LGPD</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;