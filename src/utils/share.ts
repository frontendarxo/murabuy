import type { CalculationResult } from '../types/calculator';
import { buildCalculationMessage, buildWhatsAppUrl } from './whatsapp';

const SHARE_TITLE = 'Условия покупки в рассрочку';

function buildShareData(result: CalculationResult): ShareData {
  return {
    title: SHARE_TITLE,
    text: buildCalculationMessage(result),
  };
}

export function canUseNativeShare(result: CalculationResult): boolean {
  if (typeof navigator === 'undefined' || typeof navigator.share !== 'function') {
    return false;
  }

  const data = buildShareData(result);

  if (typeof navigator.canShare === 'function') {
    return navigator.canShare(data);
  }

  return true;
}

function openWhatsApp(result: CalculationResult): void {
  window.open(buildWhatsAppUrl(result), '_blank', 'noopener,noreferrer');
}

export async function shareCalculation(result: CalculationResult): Promise<void> {
  const data = buildShareData(result);

  if (canUseNativeShare(result)) {
    try {
      await navigator.share(data);
      return;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
    }
  }

  openWhatsApp(result);
}
