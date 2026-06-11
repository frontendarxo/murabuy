import { Logo } from './Logo';

export function Header() {
  return (
    <header className="header">
      <div className="header__brand">
        <Logo />
        <span className="header__badge">Исламская рассрочка</span>
      </div>
      <p className="header__subtitle">
        Калькулятор рассрочки по принципам мурабаха — прозрачный расчёт без процентной ставки
      </p>
    </header>
  );
}
