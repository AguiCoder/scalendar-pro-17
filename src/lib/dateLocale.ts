import { ptBR } from 'date-fns/locale';
import i18n from '@/lib/i18n';

export function getDateFnsLocale() {
  const lng = i18n.language?.split('-')[0];
  switch (lng) {
    case 'pt':
      return ptBR;
    default:
      return undefined;
  }
}


