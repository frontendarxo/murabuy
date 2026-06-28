import { Header } from './components/Header';
import { CalculatorForm } from './components/CalculatorForm';
import { ResultsPanel } from './components/ResultsPanel';
import { PaymentSchedule } from './components/PaymentSchedule';
import { HistoryPanel } from './components/HistoryPanel';
import { ActionBar } from './components/ActionBar';
import { useCalculator } from './hooks/useCalculator';
import { useHistory } from './hooks/useHistory';
import type { HistoryEntry } from './types/calculator';

function App() {
  const { input, result, updateField, applyPreset } = useCalculator();
  const { history, addToHistory, resetHistory } = useHistory();

  const handleSave = () => {
    addToHistory(input, result);
  };

  const handleHistorySelect = (entry: HistoryEntry) => {
    applyPreset(entry.input);
  };

  return (
    <div className="app">
      <div className="app__shell">
        <Header />

        <main className="layout">
          <div className="layout__primary">
            <CalculatorForm
              input={input}
              onFieldChange={updateField}
              onApplyPreset={applyPreset}
            />
            <ResultsPanel result={result} />
            <PaymentSchedule schedule={result.schedule} />
            <ActionBar result={result} onSave={handleSave} />
          </div>

          <aside className="layout__aside">
            <section className="card card--info">
              <div className="card__head">
                <h2>О рассрочке MURABUY</h2>
              </div>
              <ul className="info-list">
                <li>Рассрочка оформляется по принципам исламского финансирования (мурабаха)</li>
                <li>Без процентной ставки — применяется фиксированная наценка на срок</li>
                <li>Срок рассрочки от 1 до 24 месяцев</li>
                <li>Первоначальный взнос от 0 ₽</li>
                <li>Равномерные ежемесячные платежи с прозрачным графиком</li>
              </ul>
            </section>

            <HistoryPanel
              history={history}
              onSelect={handleHistorySelect}
              onClear={resetHistory}
            />
          </aside>
        </main>

        <footer className="footer">
          <span>© {new Date().getFullYear()} MURABUY</span>
          <span>Исламская рассрочка для бизнеса</span>
        </footer>
      </div>
    </div>
  );
}

export default App;
