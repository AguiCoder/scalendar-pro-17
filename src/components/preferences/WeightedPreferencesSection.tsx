import { useState } from "react";
import { Brain, Plus, Trash2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import type { WeightedPreference } from "@/types/preferences";
import { useTranslation } from "react-i18next";

const PREFERENCE_CATEGORIES = [
  { value: 'time_preference', label: 'Time Preference' },
  { value: 'shift_type', label: 'Shift Type' },
  { value: 'department', label: 'Department' },
  { value: 'colleague', label: 'Colleague' },
  { value: 'custom', label: 'Custom' }
] as const;

const WEIGHT_LABELS = {
  0: 'None',
  1: 'Very Low',
  2: 'Low',
  3: 'Low',
  4: 'Medium',
  5: 'Medium',
  6: 'Medium',
  7: 'High',
  8: 'High',
  9: 'Very High',
  10: 'Critical'
};

const getWeightColor = (weight: number) => {
  if (weight <= 2) return 'text-muted-foreground';
  if (weight <= 4) return 'text-status-available';
  if (weight <= 6) return 'text-status-negotiation';
  if (weight <= 8) return 'text-status-vacation';
  return 'text-status-confirmed';
};

const getWeightBadgeVariant = (weight: number) => {
  if (weight <= 2) return 'secondary';
  if (weight <= 6) return 'default';
  return 'destructive';
};

const initialPreferences: WeightedPreference[] = [
  {
    id: '1',
    category: 'time_preference',
    title: 'Avoid Sunday nights',
    description: 'Prefer not to work Sunday evening shifts',
    weight: 8,
    isActive: true
  },
  {
    id: '2',
    category: 'shift_type',
    title: 'Prefer morning shifts',
    description: 'Work better during morning hours',
    weight: 6,
    isActive: true
  },
  {
    id: '3',
    category: 'department',
    title: 'Emergency Department preference',
    description: 'Prefer working in the Emergency Department',
    weight: 4,
    isActive: true
  }
];

export function WeightedPreferencesSection() {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState<WeightedPreference[]>(initialPreferences);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [category, setCategory] = useState<WeightedPreference['category']>('time_preference');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [weight, setWeight] = useState([5]);

  const handleAddPreference = () => {
    if (!title.trim() || !description.trim()) return;

    const newPreference: WeightedPreference = {
      id: Date.now().toString(),
      category,
      title: title.trim(),
      description: description.trim(),
      weight: weight[0],
      isActive: true
    };

    setPreferences(prev => [...prev, newPreference]);
    
    // Reset form
    setCategory('time_preference');
    setTitle('');
    setDescription('');
    setWeight([5]);
    setIsDialogOpen(false);
  };

  const togglePreference = (id: string, isActive: boolean) => {
    setPreferences(prev => prev.map(preference => 
      preference.id === id ? { ...preference, isActive } : preference
    ));
  };

  const updateWeight = (id: string, newWeight: number) => {
    setPreferences(prev => prev.map(preference => 
      preference.id === id ? { ...preference, weight: newWeight } : preference
    ));
  };

  const removePreference = (id: string) => {
    setPreferences(prev => prev.filter(preference => preference.id !== id));
  };

  const getCategoryLabel = (category: WeightedPreference['category']) => {
    return t(`preferences.weighted.categories.${category}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {t('preferences.weighted.title')}
            </CardTitle>
            <CardDescription>
              {t('preferences.weighted.subtitle')}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('preferences.weighted.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('preferences.weighted.dialog.title')}</DialogTitle>
                <DialogDescription>
                  {t('preferences.weighted.dialog.description')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="category">{t('preferences.weighted.dialog.category')}</Label>
                  <Select value={category} onValueChange={(value: WeightedPreference['category']) => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PREFERENCE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {t(`preferences.weighted.categories.${cat.value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">{t('preferences.weighted.dialog.titleLabel')}</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t('preferences.weighted.dialog.titlePlaceholder')}
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t('preferences.weighted.dialog.descriptionLabel')}</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t('preferences.weighted.dialog.descriptionPlaceholder')}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>{t('preferences.weighted.dialog.importance')}</Label>
                  <div className="space-y-3">
                    <Slider
                      value={weight}
                      onValueChange={setWeight}
                      max={10}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t('preferences.weighted.dialog.low0')}</span>
                      <span>{t('preferences.weighted.dialog.medium5')}</span>
                      <span>{t('preferences.weighted.dialog.critical10')}</span>
                    </div>
                    <div className="text-center">
                      <Badge variant={getWeightBadgeVariant(weight[0])} className="px-3 py-1">
                        {weight[0]} - {t(`preferences.weighted.weights.${WEIGHT_LABELS[weight[0] as keyof typeof WEIGHT_LABELS].replace(' ', '')}`)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('preferences.weighted.dialog.cancel')}
                </Button>
                <Button 
                  onClick={handleAddPreference}
                  disabled={!title.trim() || !description.trim()}
                >
                  {t('preferences.weighted.dialog.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {preferences.length === 0 ? (
          <div className="text-center py-8">
            <Brain className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">{t('preferences.weighted.empty.title')}</h3>
            <p className="text-muted-foreground">{t('preferences.weighted.empty.subtitle')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {preferences.map((preference) => (
              <div key={preference.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Switch
                      checked={preference.isActive}
                      onCheckedChange={(checked) => togglePreference(preference.id, checked)}
                      aria-label={t('preferences.restrictions.aria.toggle', { title: preference.title })}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-medium ${preference.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {preference.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(preference.category)}
                        </Badge>
                      </div>
                      <p className={`text-sm ${preference.isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                        {preference.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePreference(preference.id)}
                    aria-label={t('preferences.weighted.labels.removeAria')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {preference.isActive && (
                  <div className="mt-4 pl-8">
                    <div className="flex items-center gap-4">
                      <Label className="text-xs text-muted-foreground min-w-[60px]">
                        {t('preferences.weighted.labels.weight')}
                      </Label>
                      <div className="flex-1 max-w-xs">
                        <Slider
                          value={[preference.weight]}
                          onValueChange={(value) => updateWeight(preference.id, value[0])}
                          max={10}
                          min={0}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <Badge 
                        variant={getWeightBadgeVariant(preference.weight)}
                        className="min-w-[80px] justify-center"
                      >
                        {preference.weight} - {t(`preferences.weighted.weights.${WEIGHT_LABELS[preference.weight as keyof typeof WEIGHT_LABELS].replace(' ', '')}`)}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}