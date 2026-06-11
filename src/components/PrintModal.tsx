import { useEffect, useId, useState, type FormEvent } from 'react';

interface PrintModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (buyerName: string, guarantorName: string) => void;
}

const MIN_NAME_LENGTH = 2;

function validateName(value: string, label: string): string | null {
  const trimmed = value.trim();

  if (trimmed.length < MIN_NAME_LENGTH) {
    return `Укажите ${label} (минимум ${MIN_NAME_LENGTH} символа)`;
  }

  return null;
}

export function PrintModal({ isOpen, isLoading, error, onClose, onSubmit }: PrintModalProps) {
  const titleId = useId();
  const [buyerName, setBuyerName] = useState('');
  const [guarantorName, setGuarantorName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, isLoading, onClose]);

  useEffect(() => {
    if (!isOpen) {
      setBuyerName('');
      setGuarantorName('');
      setValidationError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const buyerError = validateName(buyerName, 'ФИО покупателя');
    if (buyerError) {
      setValidationError(buyerError);
      return;
    }

    const guarantorError = validateName(guarantorName, 'ФИО поручителя');
    if (guarantorError) {
      setValidationError(guarantorError);
      return;
    }

    setValidationError(null);
    onSubmit(buyerName.trim(), guarantorName.trim());
  };

  const displayError = validationError ?? error;

  return (
    <div className="modal-overlay" onClick={isLoading ? undefined : onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__head">
          <h2 id={titleId}>Печать результата</h2>
          <p>Укажите ФИО покупателя и поручителя для формирования PDF-документа</p>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field__label">ФИО покупателя</span>
            <div className="field__control">
              <input
                type="text"
                value={buyerName}
                onChange={(event) => setBuyerName(event.target.value)}
                placeholder="Иванов Иван Иванович"
                autoComplete="name"
                disabled={isLoading}
              />
            </div>
          </label>

          <label className="field">
            <span className="field__label">ФИО поручителя</span>
            <div className="field__control">
              <input
                type="text"
                value={guarantorName}
                onChange={(event) => setGuarantorName(event.target.value)}
                placeholder="Петров Пётр Петрович"
                autoComplete="name"
                disabled={isLoading}
              />
            </div>
          </label>

          {displayError && <p className="modal__error">{displayError}</p>}

          <div className="modal__actions">
            <button type="button" className="btn btn--ghost modal__btn" onClick={onClose} disabled={isLoading}>
              Отмена
            </button>
            <button type="submit" className="btn btn--secondary modal__btn" disabled={isLoading}>
              {isLoading ? 'Формирование…' : 'Скачать и распечатать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
