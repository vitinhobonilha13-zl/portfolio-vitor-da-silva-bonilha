import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DotType, CornerSquareType } from 'qr-code-styling';
import { User } from '../lib/firebase';

type QrType = 'URL' | 'Text' | 'Email' | 'Wi-Fi' | 'Image';
type DaltonismFilter = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'grayscale';

export interface HistoryItem {
  id: string;
  type: QrType;
  data: any; // Context specific data (URL, text, wifi details, etc.)
  timestamp: number;
  options: {
    dotType: DotType;
    cornerType: CornerSquareType;
    qrColor: string;
    qrBgColor: string;
  }
}

interface AppState {
  activeTab: string;
  setActiveTab: (tab: string) => void;

  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;

  qrType: QrType;
  setQrType: (type: QrType) => void;
  
  qrDataURL: string;
  setQrDataURL: (val: string) => void;
  qrDataText: string;
  setQrDataText: (val: string) => void;

  qrDataImage: string;
  setQrDataImage: (val: string) => void;
  isUploading: boolean;
  setIsUploading: (val: boolean) => void;
  uploadProgress: number;
  setUploadProgress: (val: number) => void;

  wifiSsid: string;
  setWifiSsid: (val: string) => void;
  wifiPass: string;
  setWifiPass: (val: string) => void;
  wifiEncryption: 'WPA' | 'WEP' | 'nopass';
  setWifiEncryption: (val: 'WPA' | 'WEP' | 'nopass') => void;

  emailTo: string;
  setEmailTo: (val: string) => void;
  emailSubject: string;
  setEmailSubject: (val: string) => void;
  emailBody: string;
  setEmailBody: (val: string) => void;

  dotType: DotType;
  setDotType: (val: DotType) => void;
  cornerType: CornerSquareType;
  setCornerType: (val: CornerSquareType) => void;
  
  qrColor: string;
  setQrColor: (val: string) => void;
  qrBgColor: string;
  setQrBgColor: (val: string) => void;

  daltonismFilter: DaltonismFilter;
  setDaltonismFilter: (val: DaltonismFilter) => void;
  
  language: string;
  setLanguage: (val: string) => void;
  
  isExpanded: boolean;
  setIsExpanded: (val: boolean) => void;
  
  privacyMode: boolean;
  setPrivacyMode: (val: boolean) => void;
  theme: 'light' | 'dark';
  setTheme: (val: 'light' | 'dark') => void;
  glassEnabled: boolean;
  setGlassEnabled: (val: boolean) => void;

  isAiDialogOpen: boolean;
  setIsAiDialogOpen: (val: boolean) => void;
  isAiLoading: boolean;
  setIsAiLoading: (val: boolean) => void;

  user: User | null;
  setUser: (user: User | null) => void;
  setHistory: (history: HistoryItem[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      activeTab: 'generator',
      setActiveTab: (tab) => set({ activeTab: tab }),

      history: [],
      addToHistory: (item) => set((state) => ({
        history: [
          {
            ...item,
            id: Math.random().toString(36).substring(2, 9),
            timestamp: Date.now(),
          },
          ...state.history,
        ].slice(0, 100), // Keep last 100 items
      })),
      deleteFromHistory: (id) => set((state) => ({
        history: state.history.filter((h) => h.id !== id),
      })),
      clearHistory: () => set({ history: [] }),

      qrType: 'URL',
      setQrType: (type) => set({ qrType: type }),

      qrDataURL: '',
      setQrDataURL: (val) => set({ qrDataURL: val }),

      qrDataText: '',
      setQrDataText: (val) => set({ qrDataText: val }),

      qrDataImage: '',
      setQrDataImage: (val) => set({ qrDataImage: val }),
      isUploading: false,
      setIsUploading: (val) => set({ isUploading: val }),
      uploadProgress: 0,
      setUploadProgress: (val) => set({ uploadProgress: val }),

      wifiSsid: '',
      setWifiSsid: (val) => set({ wifiSsid: val }),
      wifiPass: '',
      setWifiPass: (val) => set({ wifiPass: val }),
      wifiEncryption: 'WPA',
      setWifiEncryption: (val) => set({ wifiEncryption: val }),

      emailTo: '',
      setEmailTo: (val) => set({ emailTo: val }),
      emailSubject: '',
      setEmailSubject: (val) => set({ emailSubject: val }),
      emailBody: '',
      setEmailBody: (val) => set({ emailBody: val }),

      dotType: 'rounded',
      setDotType: (val) => set({ dotType: val }),
      
      cornerType: 'extra-rounded',
      setCornerType: (val) => set({ cornerType: val }),

      qrColor: '#4f46e5',
      setQrColor: (val) => set({ qrColor: val }),

      qrBgColor: '#ffffff',
      setQrBgColor: (val) => set({ qrBgColor: val }),

      daltonismFilter: 'none',
      setDaltonismFilter: (val) => set({ daltonismFilter: val }),
      
      language: 'pt',
      setLanguage: (val) => set({ language: val }),
      
      isExpanded: false,
      setIsExpanded: (val) => set({ isExpanded: val }),
      
      privacyMode: false,
      setPrivacyMode: (val) => set({ privacyMode: val }),
      theme: 'dark',
      setTheme: (val) => set({ theme: val }),
      glassEnabled: true,
      setGlassEnabled: (val) => set({ glassEnabled: val }),

      isAiDialogOpen: false,
      setIsAiDialogOpen: (val) => set({ isAiDialogOpen: val }),
      isAiLoading: false,
      setIsAiLoading: (val) => set({ isAiLoading: val }),

      user: null,
      setUser: (user) => set({ user }),
      setHistory: (history) => set({ history }),
    }), { 
      name: 'qreate-studio-v1',
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => !['user'].includes(key))
      ) as AppState,
    }));
