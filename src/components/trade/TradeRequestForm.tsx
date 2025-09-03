import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Shift } from "@/components/ShiftCard";
import { User, Clock, MapPin, Send } from "lucide-react";
import { format, parseISO } from "date-fns";
import { useTranslation } from "react-i18next";
import { getDateFnsLocale } from "@/lib/dateLocale";

const formSchema = z.object({
  suggestedColleague: z.string().optional(),
  reason: z.string().min(10, "Please provide a detailed reason for the trade request (minimum 10 characters)"),
});

interface TradeRequestFormProps {
  selectedShift: Shift;
  onSubmit: (data: z.infer<typeof formSchema>) => void;
}

const mockColleagues = [
  "Dr. Sarah Johnson",
  "Dr. Michael Chen", 
  "Dr. Emily Rodriguez",
  "Dr. David Kim",
  "Dr. Lisa Thompson",
  "Dr. James Wilson",
  "Dr. Maria Garcia",
  "Dr. Robert Lee"
];

export function TradeRequestForm({ selectedShift, onSubmit }: TradeRequestFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      suggestedColleague: "",
      reason: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(data);
    
    toast({
      title: t('myShifts.toast.tradeSubmittedTitle'),
      description: t('myShifts.toast.tradeSubmittedDescription', { date: format(parseISO(selectedShift.date), 'PP', { locale: getDateFnsLocale() }) }),
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="h-5 w-5" />
          {t('trade.form.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Selected Shift Summary */}
        <div className="p-4 border rounded-lg bg-muted/50">
          <h4 className="font-medium mb-3">{t('trade.form.selectedShift')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{format(parseISO(selectedShift.date), "PPP", { locale: getDateFnsLocale() })}</p>
                <p className="text-muted-foreground">{selectedShift.startTime} - {selectedShift.endTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{selectedShift.department}</p>
                <p className="text-muted-foreground">{selectedShift.shiftType}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{selectedShift.doctorName}</p>
                {selectedShift.location && (
                  <p className="text-muted-foreground">{selectedShift.location}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="suggestedColleague"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('trade.form.suggestedColleagueOptional')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('trade.form.selectColleaguePlaceholder')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">{t('trade.form.openToAll')}</SelectItem>
                      {mockColleagues.map((colleague) => (
                        <SelectItem key={colleague} value={colleague}>
                          {colleague}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('trade.form.reasonLabel')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('trade.form.reasonPlaceholder')}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  type="button" 
                  className="w-full" 
                  disabled={!form.formState.isValid || isSubmitting}
                >
                  {isSubmitting ? t('trade.form.submitting') : t('trade.form.submit')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('trade.form.confirmTitle')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('trade.form.confirmDescription', {
                      date: format(parseISO(selectedShift.date), 'PPP', { locale: getDateFnsLocale() }),
                      time: `${selectedShift.startTime} - ${selectedShift.endTime}`
                    })}
                    {form.watch("suggestedColleague") && (
                      <>
                        {" "}{t('trade.form.confirmWillBeSent', { colleague: form.watch('suggestedColleague') })}
                      </>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('myShifts.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={form.handleSubmit(handleSubmit)}>
                    {t('trade.form.confirmAndSubmit')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}