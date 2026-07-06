export interface ClientConfig {
  brand: {
    name: string;
  };
  business: {
    locale: string;
  };
  documents: {
    title: string;
    heading: string;
    subtitle: string;
    disclaimer: string;
  };
  features: {
    paymentSchedule: boolean;
  };
  theme: {
    pdf: {
      text: string;
      surface: string;
      mutedText: string;
      primary: string;
      border: string;
      background: string;
      primaryLight: string;
      white: string;
    };
  };
}
