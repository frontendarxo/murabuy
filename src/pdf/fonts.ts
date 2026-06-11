import { Font } from '@react-pdf/renderer';

let fontsRegistered = false;

export function registerPdfFonts(): void {
  if (fontsRegistered) return;

  Font.register({
    family: 'Manrope',
    fonts: [
      { src: '/fonts/Manrope-Regular.woff', fontWeight: 400 },
      { src: '/fonts/Manrope-Bold.woff', fontWeight: 700 },
    ],
  });

  fontsRegistered = true;
}
