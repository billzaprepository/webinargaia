export interface Timer {
  id: string;
  showAt: {
    minutes: number;
    seconds: number;
  };
  duration: {
    minutes: number;
    seconds: number;
  };
  textColor: string;
  backgroundColor: string;
  opacity: string;
  position: 'above' | 'below' | 'left' | 'right';
}