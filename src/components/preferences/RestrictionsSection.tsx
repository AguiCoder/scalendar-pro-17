import { useState } from "react";
import { Shield, Plus, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Restriction } from "@/types/preferences";
import { useTranslation } from "react-i18next";

const RESTRICTION_TEMPLATES = [
  {
    type: 'max_consecutive_nights' as const,
    title: 'Maximum consecutive night shifts',
    description: 'Limit the number of consecutive night shifts',
    valueType: 'number',
    placeholder: '2'
  },
  {
    type: 'min_weekends_off' as const,
    title: 'Minimum weekends off per month',
    description: 'Ensure adequate work-life balance',
    valueType: 'number',
    placeholder: '1'
  },
  {
    type: 'max_hours_per_week' as const,
    title: 'Maximum hours per week',
    description: 'Set weekly hour limits',
    valueType: 'number',
    placeholder: '40'
  },
  {
    type: 'no_back_to_back_shifts' as const,
    title: 'No back-to-back shifts',
    description: 'Prevent scheduling consecutive shifts',
    valueType: 'boolean',
    placeholder: ''
  }
];

const initialRestrictions: Restriction[] = [
  {
    id: '1',
    type: 'max_consecutive_nights',
    title: 'Maximum consecutive night shifts',
    description: 'No more than 2 consecutive night shifts',
    value: 2,
    isActive: true
  },
  {
    id: '2',
    type: 'min_weekends_off',
    title: 'Minimum weekends off per month',
    description: 'At least 1 weekend off per month',
    value: 1,
    isActive: true
  }
];

export function RestrictionsSection() {
  const { t } = useTranslation();
  const [restrictions, setRestrictions] = useState<Restriction[]>(initialRestrictions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [customTitle, setCustomTitle] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [restrictionValue, setRestrictionValue] = useState<string>('');

  const handleAddRestriction = () => {
    const template = RESTRICTION_TEMPLATES.find(t => t.type === selectedTemplate);
    const isCustom = selectedTemplate === 'custom';
    
    if (!template && !isCustom) return;
    if (isCustom && (!customTitle.trim() || !customDescription.trim())) return;
    if (!isCustom && template?.valueType === 'number' && !restrictionValue.trim()) return;

    const newRestriction: Restriction = {
      id: Date.now().toString(),
      type: isCustom ? 'custom' : (selectedTemplate as any),
      title: isCustom ? customTitle.trim() : template!.title,
      description: isCustom ? customDescription.trim() : `${template!.description}${template!.valueType === 'number' ? ` (${restrictionValue})` : ''}`,
      value: template?.valueType === 'number' ? parseInt(restrictionValue) : restrictionValue || 'enabled',
      isActive: true
    };

    setRestrictions(prev => [...prev, newRestriction]);
    
    // Reset form
    setSelectedTemplate('');
    setCustomTitle('');
    setCustomDescription('');
    setRestrictionValue('');
    setIsDialogOpen(false);
  };

  const toggleRestriction = (id: string, isActive: boolean) => {
    setRestrictions(prev => prev.map(restriction => 
      restriction.id === id ? { ...restriction, isActive } : restriction
    ));
  };

  const removeRestriction = (id: string) => {
    setRestrictions(prev => prev.filter(restriction => restriction.id !== id));
  };

  const selectedTemplateData = RESTRICTION_TEMPLATES.find(t => t.type === selectedTemplate);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('preferences.restrictions.title')}
            </CardTitle>
            <CardDescription>
              {t('preferences.restrictions.subtitle')}
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('preferences.restrictions.add')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{t('preferences.restrictions.dialog.title')}</DialogTitle>
                <DialogDescription>
                  {t('preferences.restrictions.dialog.description')}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="template">{t('preferences.restrictions.dialog.type')}</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('preferences.restrictions.dialog.chooseType')} />
                    </SelectTrigger>
                    <SelectContent>
                      {RESTRICTION_TEMPLATES.map((template) => (
                        <SelectItem key={template.type} value={template.type}>
                          {template.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">{t('preferences.restrictions.dialog.custom')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedTemplate === 'custom' && (
                  <>
                    <div>
                      <Label htmlFor="custom-title">{t('preferences.restrictions.dialog.titleLabel')}</Label>
                      <Input
                        id="custom-title"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        placeholder={t('preferences.restrictions.dialog.titlePlaceholder')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="custom-description">{t('preferences.restrictions.dialog.descriptionLabel')}</Label>
                      <Textarea
                        id="custom-description"
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        placeholder={t('preferences.restrictions.dialog.descriptionPlaceholder')}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {selectedTemplateData && selectedTemplateData.valueType === 'number' && (
                  <div>
                    <Label htmlFor="value">{t('preferences.restrictions.dialog.value')}</Label>
                    <Input
                      id="value"
                      type="number"
                      value={restrictionValue}
                      onChange={(e) => setRestrictionValue(e.target.value)}
                      placeholder={selectedTemplateData.placeholder}
                      min="0"
                    />
                  </div>
                )}

                {selectedTemplateData && (
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      {selectedTemplateData.description}
                    </p>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  {t('preferences.restrictions.dialog.cancel')}
                </Button>
                <Button 
                  onClick={handleAddRestriction}
                  disabled={
                    !selectedTemplate || 
                    (selectedTemplate === 'custom' && (!customTitle.trim() || !customDescription.trim())) ||
                    (selectedTemplateData?.valueType === 'number' && !restrictionValue.trim())
                  }
                >
                  {t('preferences.restrictions.dialog.confirm')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {restrictions.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">{t('preferences.restrictions.empty.title')}</h3>
            <p className="text-muted-foreground">{t('preferences.restrictions.empty.subtitle')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {restrictions.map((restriction) => (
              <div key={restriction.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-start gap-3 flex-1">
                  <Switch
                    checked={restriction.isActive}
                    onCheckedChange={(checked) => toggleRestriction(restriction.id, checked)}
                    aria-label={t('preferences.restrictions.aria.toggle', { title: restriction.title })}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${restriction.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {restriction.title}
                      </span>
                      {restriction.type === 'custom' && (
                        <span className="text-xs bg-muted px-2 py-1 rounded">{t('preferences.restrictions.badges.custom')}</span>
                      )}
                    </div>
                    <p className={`text-sm ${restriction.isActive ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                      {restriction.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRestriction(restriction.id)}
                  aria-label={t('preferences.restrictions.aria.remove')}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}