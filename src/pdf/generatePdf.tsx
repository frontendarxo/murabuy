import { pdf } from '@react-pdf/renderer';
import type { CalculationResult } from '../types/calculator';
import { MurabuyPdfDocument } from './MurabuyPdfDocument';
import { registerPdfFonts } from './fonts';

export interface PdfParties {
  buyerName: string;
  guarantorName: string;
}

export async function generateMurabuyPdf(
  result: CalculationResult,
  parties: PdfParties,
): Promise<Blob> {
  registerPdfFonts();

  return pdf(
    <MurabuyPdfDocument
      result={result}
      buyerName={parties.buyerName}
      guarantorName={parties.guarantorName}
      generatedAt={new Date()}
    />,
  ).toBlob();
}

export function buildPdfFilename(buyerName: string): string {
  const sanitized = buyerName
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^\w\u0400-\u04FF_-]/g, '');

  return `MURABUY_${sanitized || 'расчет'}.pdf`;
}

export function downloadPdf(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function printPdf(blob: Blob): Promise<void> {
  const url = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = url;

    const cleanup = () => {
      URL.revokeObjectURL(url);
      iframe.remove();
    };

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        resolve();
        window.setTimeout(cleanup, 1000);
      } catch (error) {
        cleanup();
        reject(error);
      }
    };

    iframe.onerror = () => {
      cleanup();
      reject(new Error('Не удалось открыть PDF для печати'));
    };

    document.body.appendChild(iframe);
  });
}
