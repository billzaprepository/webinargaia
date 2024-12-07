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

export interface CTAButton {
  id: string;
  text: string;
  url: string;
  color: string;
  showAt: number;
  duration: number;
  position?: 'above' | 'below' | 'left' | 'right';
  backgroundColor?: string;
  opacity?: string;
}

export interface WebinarSchedule {
  startTime: Date;
  endTime: Date;
  title: string;
  description: string;
  status: 'scheduled' | 'live' | 'ended';
}

export interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  scheduledTime: number;
}

export interface Webinar {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
  schedule: WebinarSchedule;
  messages: ChatMessage[];
  video: File | null;
  createdBy: string;
  isActive: boolean;
  ctaButtons: CTAButton[];
  theme: WebinarTheme;
}

export interface WebinarState {
  webinars: Webinar[];
  currentWebinar: Webinar | null;
  addWebinar: (webinar: Omit<Webinar, 'id'>) => Webinar | null;
  updateWebinar: (id: string, webinar: Partial<Webinar>) => void;
  removeWebinar: (id: string) => void;
  setCurrentWebinar: (webinar: Webinar | null) => void;
  canManageWebinar: (webinarId: string) => boolean;
}