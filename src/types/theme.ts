export interface WebinarTheme {
  primaryColor: string;
  backgroundColor: string;
  headerColor: string;
  chatBackgroundColor: string;
  chatTextColor: string;
  fontFamily: string;
  timer?: {
    textColor: string;
    backgroundColor: string;
    opacity: string;
    position: 'above' | 'below' | 'left' | 'right';
    showAt?: {
      minutes: number;
      seconds: number;
    };
    duration: {
      minutes: number;
      seconds: number;
    };
  };
}