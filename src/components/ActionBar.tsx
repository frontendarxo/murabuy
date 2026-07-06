import { useState } from 'react';
import type { CalculationResult } from '../types/calculator';
import { canUseNativeShare, shareCalculation } from '../utils/share';
import { PrintModal } from './PrintModal';

interface ActionBarProps {
  result: CalculationResult;
  onSave: () => void;
}

export function ActionBar({ result, onSave }: ActionBarProps) {
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const shareLabel = canUseNativeShare(result) ? 'Поделиться' : 'Отправить расчёт в WhatsApp';

  const handleShare = async () => {
    onSave();

    try {
      await shareCalculation(result);
    } catch {
      // shareCalculation уже открывает WhatsApp как запасной вариант
    }
  };

  const handleOpenPrintModal = () => {
    setPdfError(null);
    setIsPrintModalOpen(true);
  };

  const handleClosePrintModal = () => {
    if (isPdfLoading) return;
    setIsPrintModalOpen(false);
    setPdfError(null);
  };

  const handlePrintSubmit = async (buyerName: string, guarantorName: string) => {
    setIsPdfLoading(true);
    setPdfError(null);

    try {
      const { generateMurabuyPdf, buildPdfFilename, downloadPdf, printPdf } = await import(
        '../pdf/generatePdf'
      );

      const blob = await generateMurabuyPdf(result, { buyerName, guarantorName });
      const filename = buildPdfFilename(buyerName);

      downloadPdf(blob, filename);
      await printPdf(blob);
      onSave();
      setIsPrintModalOpen(false);
    } catch {
      setPdfError('Не удалось сформировать PDF. Попробуйте ещё раз.');
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <>
      <section className="action-bar">
        <button type="button" className="btn btn--primary" onClick={handleShare}>
          {shareLabel}
        </button>
        <button type="button" className="btn btn--secondary" onClick={handleOpenPrintModal}>
          Печать результата
        </button>

        <div className="action-bar__note">
          <strong>Для оформления потребуются:</strong>
          <span>паспорт покупателя, паспорт поручителя и номер телефона</span>
        </div>
      </section>

      <PrintModal
        isOpen={isPrintModalOpen}
        isLoading={isPdfLoading}
        error={pdfError}
        onClose={handleClosePrintModal}
        onSubmit={handlePrintSubmit}
      />
    </>
  );
}
