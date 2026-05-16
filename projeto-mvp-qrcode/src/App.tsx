import React, { useEffect, useRef, useMemo, useState } from 'react';
import QRCodeStyling, { DrawType } from 'qr-code-styling';
import { LayoutDashboard, History, LogOut, Wand2, Shield, Download, Expand, Sparkles, Image as ImageIcon, QrCode, Accessibility, LogIn, X, Video, VideoOff, Mic, Calendar, Trash2, ArrowUpRight, Clock, FileText, UploadCloud, Loader2, Send, Users, Sun, Moon } from 'lucide-react';
import { useAppStore, HistoryItem } from './store/useAppStore';
import { generateQrWithAi, AIQRResponse } from './services/geminiService';
import { auth, db, storage, loginWithGoogle, switchAccountWithGoogle, logout } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage';
import { collection, query, orderBy, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const T = {
  en: {
    gen: 'Generator', hist: 'History', priv: 'Privacy Mode',
    acc: 'Accessibility', daltonism: 'Color Blindness', lang: 'Language',
    create: 'Create QR Code', ai: 'AI Generate', login: 'Login with Google',
    contentType: 'Content Type', pattern: 'Pattern Style', branding: 'Brand Colors',
    live: 'Live Preview', downPNG: 'Download PNG', downSVG: 'Download SVG', downJPEG: 'Download JPEG', downPDF: 'Download PDF',
    standard: 'Standard', prota: 'Protanopia', deute: 'Deuteranopia', trita: 'Tritanopia', gray: 'Grayscale',
    waitingAuth: 'Module is waiting for Authentication.',
    typeText: 'Text', typeURL: 'URL', typeWiFi: 'Wi-Fi', typeEmail: 'Email', typeImage: 'Image',
    uploadImage: 'Upload Image', dropImage: 'Drop image here or click', uploading: 'Uploading...', uploadError: 'Error uploading image',
    dotPattern: 'Dot Pattern', cornerStyle: 'Corner Style', qrColor: 'QR Color', bgColor: 'Background Color',
    ssid: 'Network SSID', pass: 'Password', enc: 'Encryption',
    dest: 'Recipient Email', subj: 'Subject', body: 'Message Body',
    placeholderText: 'Type anything here...', placeholderURL: 'https://QReatestudio.ai', placeholderImage: 'https://QReatestudio.ai/image.png',
    h24: 'Last 24h', h7d: '7 Days', h15d: '15 Days', h30d: '30 Days', hAll: 'All Period',
    noHistory: 'No QR codes found in this period.', deleteConfirm: 'Are you sure?',
    apply: 'Use as Template', delete: 'Delete', saveHist: 'Save', confirmYes: 'YES',
    privTitle: 'Privacy Mode', privDesc: 'When active, your generated QR codes are not saved to history. Data is only handled locally and wiped when you leave.',
    privStatusActive: 'Private Mode is ACTIVE', privStatusInactive: 'Private Mode is INACTIVE',
    privToggle: 'Toggle Privacy Mode',
    stRounded: 'Rounded', stDots: 'Dots', stSquare: 'Square', stClassy: 'Classy',
    crExtraRounded: 'Extra Rounded', crDot: 'Dot', crSquare: 'Square',
    wifiNone: 'None',
    aiTitle: 'Smart Generator', aiDesc: 'Describe the theme or purpose of your QR Code.',
    aiPlaceholder: 'Ex: "An elegant QR Code for a premium coffee shop in earthy tones" or "Link for a futuristic tech event Wi-Fi"',
    aiButton: 'Generate Now', aiGenerating: 'Generating...', aiConsulting: 'Consulting AI...',
    aiFooter: 'AI will automatically configure the data type, colors, and visual style based on your description.',
    cancel: 'Cancel',
    logoutConfirm: 'Do you really want to logout?',
    logoutTitle: 'Leaving?',
    logoutAction: 'Logout',
    credits: 'Created by: Felipe André and Felipe Henrique',
    est: 'since 2026',
    switchAcc: 'Switch Account',
    appTheme: 'Appearance',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode (Default)'
  },
  pt: {
    gen: 'Gerador', hist: 'Histórico', priv: 'Modo Privado',
    acc: 'Acessibilidade', daltonism: 'Daltonismo', lang: 'Idioma',
    create: 'Criar QR Code', ai: 'Gerar com IA', login: 'Entrar com Google',
    contentType: 'Tipo de Conteúdo', pattern: 'Estilo do Padrão', branding: 'Cores da Marca',
    live: 'Visualização', downPNG: 'Baixar PNG', downSVG: 'Baixar SVG', downJPEG: 'Baixar JPEG', downPDF: 'Baixar PDF',
    standard: 'Padrão', prota: 'Protanopia', deute: 'Deuteranopia', trita: 'Tritanopia', gray: 'Escala de Cinza',
    waitingAuth: 'O módulo aguarda a autenticação.',
    typeText: 'Texto', typeURL: 'URL', typeWiFi: 'Wi-Fi', typeEmail: 'E-mail', typeImage: 'Imagem',
    uploadImage: 'Upload de Imagem', dropImage: 'Arraste a imagem aqui ou clique', uploading: 'Enviando...', uploadError: 'Erro ao enviar imagem',
    dotPattern: 'Padrão de Pontos', cornerStyle: 'Estilo dos Cantos', qrColor: 'Cor do QR', bgColor: 'Cor de Fundo',
    ssid: 'SSID da Rede', pass: 'Senha', enc: 'Criptografia',
    dest: 'E-mail do Destinatário', subj: 'Assunto', body: 'Corpo da Mensagem',
    placeholderText: 'Digite qualquer coisa aqui...', placeholderURL: 'https://QReatestudio.ai', placeholderImage: 'https://QReatestudio.ai/logo.png',
    h24: 'Últimas 24h', h7d: '7 Dias', h15d: '15 Dias', h30d: '30 Dias', hAll: 'Todo Período',
    noHistory: 'Nenhum QR code encontrado neste período.', deleteConfirm: 'Tem certeza?',
    apply: 'Usar como Modelo', delete: 'Excluir', saveHist: 'Salvar', confirmYes: 'SIM',
    privTitle: 'Modo Privado', privDesc: 'Quando ativo, seus QR codes gerados não são salvos no histórico. Os dados são processados apenas localmente e limpos ao sair.',
    privStatusActive: 'Modo Privado está ATIVADO', privStatusInactive: 'Modo Privado está DESATIVADO',
    privToggle: 'Alternar Modo Privado',
    stRounded: 'Arredondado', stDots: 'Pontos', stSquare: 'Quadrado', stClassy: 'Elegante',
    crExtraRounded: 'Extra Arredondado', crDot: 'Ponto', crSquare: 'Quadrado',
    wifiNone: 'Nenhum',
    aiTitle: 'Gerador Inteligente', aiDesc: 'Descreva o tema ou propósito do seu QR Code.',
    aiPlaceholder: 'Ex: "Um QR Code elegante para uma cafeteria premium em tons terrosos" ou "Link para rede Wi-Fi de um evento tech futurista"',
    aiButton: 'Gerar agora', aiGenerating: 'Gerando...', aiConsulting: 'Consulting AI...',
    aiFooter: 'A IA irá configurar automaticamente o tipo de dados, cores e estilo visual com base na sua descrição.',
    cancel: 'Cancelar',
    logoutConfirm: 'Você realmente deseja se desconectar da sua conta?',
    logoutTitle: 'Saindo?',
    logoutAction: 'Desconectar',
    credits: 'Criado por: Felipe André e Felipe Henrique',
    est: 'desde 2026',
    switchAcc: 'Trocar Conta',
    appTheme: 'Aparência',
    lightMode: 'Modo Luz',
    darkMode: 'Modo Escuro (Padrão)'
  },
  es: {
    gen: 'Generador', hist: 'Historial', priv: 'Modo Privacidad',
    acc: 'Accesibilidad', daltonism: 'Daltonismo', lang: 'Idioma',
    create: 'Crear Código QR', ai: 'Gerar con IA', login: 'Iniciar con Google',
    contentType: 'Tipo de Contenido', pattern: 'Estilo de Patrón', branding: 'Colores de Marca',
    live: 'Vista Previa', downPNG: 'Descargar PNG', downSVG: 'Descargar SVG', downJPEG: 'Descargar JPEG', downPDF: 'Descargar PDF',
    standard: 'Estándar', prota: 'Protanopia', deute: 'Deuteranopia', trita: 'Tritanopia', gray: 'Escala de grises',
    waitingAuth: 'El módulo espera la autenticación.',
    typeText: 'Texto', typeURL: 'URL', typeWiFi: 'Wi-Fi', typeEmail: 'Correo electrónico', typeImage: 'Imagen',
    uploadImage: 'Subir Imagen', dropImage: 'Arrastra la imagen aquí o haz clic', uploading: 'Subiendo...', uploadError: 'Error al subir imagen',
    dotPattern: 'Patrón de Puntos', cornerStyle: 'Estilo de Esquinas', qrColor: 'Color del QR', bgColor: 'Color de Fondo',
    ssid: 'SSID de Red', pass: 'Contraseña', enc: 'Cifrado',
    dest: 'Correo del Destinatario', subj: 'Asunto', body: 'Cuerpo del Mensaje',
    placeholderText: 'Escribe cualquier cosa aquí...', placeholderURL: 'https://QReatestudio.ai', placeholderImage: 'https://QReatestudio.ai/image.png',
    h24: 'Últimas 24h', h7d: '7 Días', h15d: '15 Días', h30d: '30 Días', hAll: 'Todo Periodo',
    noHistory: 'No se encontraron códigos QR en este período.', deleteConfirm: '¿Estás seguro?',
    apply: 'Usar como Plantilla', delete: 'Eliminar', saveHist: 'Guardar', confirmYes: 'SÍ',
    privTitle: 'Modo Privacidad', privDesc: 'Cuando está activo, sus códigos QR generados no se guardan en el historial. Los datos se manejan solo localmente y se borran al salir.',
    privStatusActive: 'El modo privado está ACTIVO', privStatusInactive: 'El modo privado está INACTIVO',
    privToggle: 'Alternar modo privado',
    stRounded: 'Redondeado', stDots: 'Puntos', stSquare: 'Cuadrado', stClassy: 'Elegante',
    crExtraRounded: 'Extra Redondeado', crDot: 'Punto', crSquare: 'Cuadrado',
    wifiNone: 'Ninguno',
    aiTitle: 'Generador Inteligente', aiDesc: 'Describe el tema o propósito de tu código QR.',
    aiPlaceholder: 'Ej: "Un código QR elegante para una cafetería premium en tonos tierra" o "Enlace para el Wi-Fi de un evento tecnológico futurista"',
    aiButton: 'Generar ahora', aiGenerating: 'Generando...', aiConsulting: 'Consultando IA...',
    aiFooter: 'La IA configurará automáticamente o tipo de datos, colores y estilo visual baseada en tu descripción.',
    cancel: 'Cancelar',
    logoutConfirm: '¿Realmente deseas cerrar sesión?',
    logoutTitle: '¿Saliendo?',
    logoutAction: 'Cerrar sesión',
    credits: 'Creado por: Felipe André y Felipe Henrique',
    est: 'desde 2026',
    switchAcc: 'Cambiar Cuenta',
    appTheme: 'Apariencia',
    lightMode: 'Modo Luz',
    darkMode: 'Modo Oscuro (Predeterminado)'
  },
  fr: {
    gen: 'Générateur', hist: 'Historique', priv: 'Confidentialité',
    acc: 'Accessibilidade', daltonism: 'Daltonisme', lang: 'Langue',
    create: 'Criar um QR Code', ai: 'Générer avec IA', login: 'Se connecter via Google',
    contentType: 'Type de Contenu', pattern: 'Style de Motif', branding: 'Couleurs de Marque',
    live: 'Aperçu en Direct', downPNG: 'Télécharger PNG', downSVG: 'Télécharger SVG', downJPEG: 'Télécharger JPEG', downPDF: 'Télécharger PDF',
    standard: 'Standard', prota: 'Protanopie', deute: 'Deutéranopie', trita: 'Tritanopie', gray: 'Niveaux de gris',
    waitingAuth: 'Le module attend l\'authentification.',
    typeText: 'Texte', typeURL: 'URL', typeWiFi: 'Wi-Fi', typeEmail: 'E-mail', typeImage: 'Image',
    uploadImage: 'Télécharger Image', dropImage: 'Déposez l\'image ici ou cliquez', uploading: 'Téléchargement...', uploadError: 'Erreur de téléchargement',
    dotPattern: 'Modèle de Points', cornerStyle: 'Style de Coins', qrColor: 'Couleur du QR', bgColor: 'Couleur de Fond',
    ssid: 'SSID du Réseau', pass: 'Mot de Passe', enc: 'Chiffrement',
    dest: 'E-mail du Destinataire', subj: 'Objet', body: 'Corps du Message',
    placeholderText: 'Tapez n\'importe quoi aqui...', placeholderURL: 'https://QReatestudio.ai', placeholderImage: 'https://QReatestudio.ai/image.png',
    h24: 'Dernières 24h', h7d: '7 Jours', h15d: '15 Jours', h30d: '30 Jours', hAll: 'Tout',
    noHistory: 'Aucun code QR trouvé dans cette période.', deleteConfirm: 'Êtes-vous sûr?',
    apply: 'Utiliser como Modèle', delete: 'Supprimer', saveHist: 'Sauvegarder', confirmYes: 'OUI',
    privTitle: 'Mode Confidentialité', privDesc: 'Lorsqu\'il est actif, vos codes QR générés ne sont pas enregistrés dans l\'historique. Les données sont traitées uniquement localement.',
    privStatusActive: 'Le mode privé est ACTIVÉ', privStatusInactive: 'Le mode privé est DÉSACTIVÉ',
    privToggle: 'Basculer le mode privé',
    stRounded: 'Arrondi', stDots: 'Points', stSquare: 'Carré', stClassy: 'Élégant',
    crExtraRounded: 'Extra Arrondi', crDot: 'Point', crSquare: 'Carré',
    wifiNone: 'Aucun',
    aiTitle: 'Générateur Intelligent', aiDesc: 'Décrivez le thème ou l\'objectif de votre code QR.',
    aiPlaceholder: 'Ex : "Un code QR élégant pour un café haut de gamme aux tons terreux" ou "Lien pour le Wi-Fi d\'un événement technologique futuriste"',
    aiButton: 'Générer maintenant', aiGenerating: 'Génération...', aiConsulting: 'Consultation IA...',
    aiFooter: 'L\'IA configurera automatiquement le type de données, les couleurs et le style visuel en fonction de votre description.',
    cancel: 'Annuler',
    logoutConfirm: 'Voulez-vous vraiment vous déconnecter ?',
    logoutTitle: 'Déconnexion ?',
    logoutAction: 'Déconnexion',
    credits: 'Créé par : Felipe André et Felipe Henrique',
    est: 'depuis 2026',
    switchAcc: 'Changer de Compte',
    appTheme: 'Apparence',
    lightMode: 'Mode Clair',
    darkMode: 'Mode Sombre (Par défaut)'
  },
  de: {
    gen: 'Generator', hist: 'Verlauf', priv: 'Datenschutz',
    acc: 'Barrierefreiheit', daltonism: 'Farbenblindheit', lang: 'Sprache',
    create: 'QR-Code Erstellen', ai: 'Mit KI Generieren', login: 'Mit Google Anmelden',
    contentType: 'Inhaltstyp', pattern: 'Musterstil', branding: 'Markenfarben',
    live: 'Live-Vorschau', downPNG: 'PNG Herunterladen', downSVG: 'SVG Herunterladen', downJPEG: 'JPEG Herunterladen', downPDF: 'PDF Herunterladen',
    standard: 'Standard', prota: 'Protanopie', deute: 'Deuteranopie', trita: 'Tritanopie', gray: 'Graustufen',
    waitingAuth: 'Das Modul wartet auf Authentifizierung.',
    typeText: 'Text', typeURL: 'URL', typeWiFi: 'Wi-Fi', typeEmail: 'E-Mail', typeImage: 'Bild',
    uploadImage: 'Bild hochladen', dropImage: 'Bild hierher ziehen oder klicken', uploading: 'Hochladen...', uploadError: 'Fehler beim Hochladen',
    dotPattern: 'Punktmuster', cornerStyle: 'Eckenstil', qrColor: 'QR-Farbe', bgColor: 'Hintergrundfarbe',
    ssid: 'Netzwerk-SSID', pass: 'Passwort', enc: 'Verschlüsselung',
    dest: 'Empfänger-E-Mail', subj: 'Betreff', body: 'Nachrichtentext',
    placeholderText: 'Geben Sie hier etwas ein...', placeholderURL: 'https://QReatestudio.ai', placeholderImage: 'https://QReatestudio.ai/image.png',
    h24: 'Letzte 24h', h7d: '7 Tage', h15d: '15 Tage', h30d: '30 Tage', hAll: 'Gesamter Zeitraum',
    noHistory: 'Keine QR-Codes in diesem Zeitraum gefunden.', deleteConfirm: 'Sind Sie sicher?',
    apply: 'Als Vorlage verwenden', delete: 'Löschen', saveHist: 'Speichern', confirmYes: 'JA',
    privTitle: 'Privatmodus', privDesc: 'Wenn aktiv, werden Ihre generierten QR-Codes nicht im Verlauf gespeichert. Daten werden nur lokal verarbeitet.',
    privStatusActive: 'Privatmodus ist AKTIVIERT', privStatusInactive: 'Privatmodus ist DEAKTIVIERT',
    privToggle: 'Privatmodus umschalten',
    stRounded: 'Abgerundet', stDots: 'Punkte', stSquare: 'Quadrat', stClassy: 'Elegant',
    crExtraRounded: 'Extra Abgerundet', crDot: 'Punkt', crSquare: 'Quadrat',
    wifiNone: 'Keine',
    aiTitle: 'Intelligenter Generator', aiDesc: 'Beschreiben Sie das Thema oder den Zweck Ihres QR-Codes.',
    aiPlaceholder: 'Z. B.: "Ein eleganter QR-Code für ein Premium-Café in Erdtönen" oder "Link für das WLAN eines futuristischen Tech-Events"',
    aiButton: 'Jetzt generieren', aiGenerating: 'Generierung...', aiConsulting: 'KI wird befragt...',
    aiFooter: 'Die KI konfiguriert Datentyp, Farben und visuellen Stil automatisch basierend auf Ihrer Beschreibung.',
    cancel: 'Abbrechen',
    logoutConfirm: 'Möchten Sie sich wirklich abmelden?',
    logoutTitle: 'Abmelden?',
    logoutAction: 'Abmelden',
    credits: 'Erstellt von: Felipe André und Felipe Henrique',
    est: 'seit 2026',
    switchAcc: 'Konto wechseln',
    appTheme: 'Erscheinungsbild',
    lightMode: 'Heller Modus',
    darkMode: 'Dunkler Modus (Standard)'
  }
};

const DaltonismFilters = () => (
  <svg aria-hidden="true" style={{ width: 0, height: 0, position: 'absolute' }}>
    <defs>
      <filter id="protanopia">
        <feColorMatrix type="matrix" values="0.567, 0.433, 0, 0, 0  0.558, 0.442, 0, 0, 0  0, 0.242, 0.758, 0, 0  0, 0, 0, 1, 0" />
      </filter>
      <filter id="deuteranopia">
        <feColorMatrix type="matrix" values="0.625, 0.375, 0, 0, 0  0.7, 0.3, 0, 0, 0  0, 0.3, 0.7, 0, 0  0, 0, 0, 1, 0" />
      </filter>
      <filter id="tritanopia">
        <feColorMatrix type="matrix" values="0.95, 0.05, 0, 0, 0  0, 0.433, 0.567, 0, 0  0, 0.475, 0.525, 0, 0  0, 0, 0, 1, 0" />
      </filter>
      <filter id="grayscale">
        <feColorMatrix type="matrix" values="0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0" />
      </filter>
    </defs>
  </svg>
);

export default function App() {
  const store = useAppStore();
  const t = T[store.language as keyof typeof T] || T.pt;
  const isDark = store.theme === 'dark';
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  // Firebase Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      store.setUser(user);
      if (!user) {
        // Clear history when user logs out
        store.setHistory([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firebase Firestore Sync (History)
  useEffect(() => {
    if (!store.user) return;

    const q = query(
      collection(db, 'users', store.user.uid, 'history'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as HistoryItem);
      store.setHistory(items);
    });

    return () => unsubscribe();
  }, [store.user]);

  return (
    <>
      <DaltonismFilters />
      <div 
        className={`flex h-screen w-full font-sans overflow-hidden transition-all duration-500 ${store.theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}
        style={{ filter: store.daltonismFilter !== 'none' ? `url(#${store.daltonismFilter})` : 'none' }}
      >
        {/* BACKGROUND ELEMENTS FOR ATMOSPHERE */}
        <div className={`absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-all duration-700 ${store.theme === 'dark' ? 'bg-indigo-600/20' : 'bg-indigo-500/10'}`} />
        <div className={`absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none transition-all duration-700 ${store.theme === 'dark' ? 'bg-green-500/10' : 'bg-green-500/5'}`} />

        {/* SIDEBAR */}
        <aside className={`w-20 md:w-80 border-r flex flex-col justify-between py-6 z-10 transition-all duration-500 ${
          store.theme === 'dark' 
            ? (store.glassEnabled ? 'bg-slate-950/40 backdrop-blur-md border-white/5' : 'bg-slate-950 border-white/5') 
            : 'bg-white border-slate-200 shadow-xl'
        }`}>
          <div className="px-4 md:px-4">
            <div className={`flex items-center gap-3 mb-12 transition-colors ${store.theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
              <div className={`p-2 rounded-xl border transition-all duration-500 ${
                store.theme === 'dark' 
                  ? 'bg-indigo-500/20 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                  : 'bg-indigo-50 border-indigo-100 shadow-sm'
              }`}>
                <QrCode className="w-6 h-6" />
              </div>
              <span className={`hidden md:block text-xl font-bold tracking-tight md:truncate transition-colors ${store.theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>QReate Studio</span>
            </div>

            <nav className="space-y-2">
              <NavItem icon={<LayoutDashboard />} label={t.gen} active={store.activeTab === 'generator'} onClick={() => store.setActiveTab('generator')} />
              <NavItem icon={<History />} label={t.hist} active={store.activeTab === 'history'} onClick={() => store.setActiveTab('history')} />
              <NavItem icon={<Shield />} label={t.priv} active={store.activeTab === 'privacy'} onClick={() => store.setActiveTab('privacy')} />
              
              <div className="pt-4 md:hidden">
                 <button 
                  onClick={() => store.setTheme(store.theme === 'dark' ? 'light' : 'dark')}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all ${
                    store.theme === 'dark' ? 'bg-slate-900 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  {store.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>
            </nav>
          </div>

          <div className="px-4 md:px-4">
            <div className={`mb-4 pt-4 border-t space-y-4 transition-colors ${store.theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
              
              <div className="hidden md:block">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">{t.appTheme}</label>
                <div className={`p-1.5 rounded-xl flex items-center gap-2 transition-colors ${store.theme === 'dark' ? 'bg-slate-900' : 'bg-slate-200/50'}`}>
                  <button 
                    onClick={() => store.setTheme('light')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                      store.theme === 'light' 
                        ? 'bg-white text-indigo-600 shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Sun className="w-4 h-4 shrink-0" /> {t.lightMode}
                  </button>
                  <button 
                    onClick={() => store.setTheme('dark')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${
                      store.theme === 'dark' 
                        ? (isDark ? 'bg-slate-800 text-white shadow-sm' : 'bg-slate-700 text-white shadow-sm') 
                        : (isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
                    }`}
                  >
                    <Moon className="w-4 h-4 shrink-0" /> {t.darkMode}
                  </button>
                </div>
              </div>

              <label className="hidden md:block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t.acc}</label>
              
              <div>
                <label className="hidden md:block text-[10px] text-slate-500 mb-1 uppercase tracking-widest">{t.lang}</label>
                <select 
                  value={store.language} 
                  onChange={(e) => store.setLanguage(e.target.value)}
                  className={`w-full border text-sm rounded-lg px-2 py-2 outline-none transition-colors ${
                    store.theme === 'dark' 
                      ? 'bg-slate-900 border-white/10 text-slate-300 focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                  }`}
                >
                  <option value="pt">Português</option>
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="hidden md:block text-[10px] text-slate-500 mb-1 uppercase tracking-widest">{t.daltonism}</label>
                <select 
                  value={store.daltonismFilter} 
                  onChange={(e) => store.setDaltonismFilter(e.target.value as any)}
                  className={`w-full border text-sm rounded-lg px-2 py-2 outline-none transition-colors ${
                    store.theme === 'dark' 
                      ? 'bg-slate-900 border-white/10 text-slate-300 focus:border-indigo-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700 focus:border-indigo-500'
                  }`}
                >
                  <option value="none">{t.standard}</option>
                  <option value="protanopia">{t.prota}</option>
                  <option value="deuteranopia">{t.deute}</option>
                  <option value="tritanopia">{t.trita}</option>
                  <option value="grayscale">{t.gray}</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN LAYOUT */}
        <main className="flex-1 flex flex-col h-full bg-transparent z-10 relative">
          {/* HEADER */}
          <header className={`h-20 border-b flex items-center justify-between px-8 z-20 transition-all duration-500 ${
            store.theme === 'dark' 
              ? (store.glassEnabled ? 'bg-slate-900/20 backdrop-blur-md border-white/5' : 'bg-slate-900 border-white/5') 
              : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              <h1 className={`text-2xl font-semibold transition-colors ${store.theme === 'dark' ? 'text-white/90' : 'text-slate-800'}`}>
                {store.activeTab === 'generator' && t.create}
                {store.activeTab === 'history' && t.hist}
                {store.activeTab === 'privacy' && t.priv}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <button 
                onClick={() => store.setIsAiDialogOpen(true)}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all ${
                  store.theme === 'dark' 
                    ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' 
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 shadow-sm'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">{t.ai}</span>
              </button>
              
              <div className={`hidden md:block h-6 w-px mx-2 transition-colors ${store.theme === 'dark' ? 'bg-white/10' : 'bg-slate-200'}`}></div>
              
              {store.user ? (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end">
                    <span className={`text-sm font-medium transition-colors ${store.theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{store.user.displayName}</span>
                    <span className="text-[10px] text-slate-500">{store.user.email}</span>
                  </div>
                  {store.user.photoURL && (
                    <img 
                      src={store.user.photoURL} 
                      alt="" 
                      className={`w-10 h-10 rounded-xl border transition-colors ${store.theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div className={`flex items-center gap-1 border-l ml-2 pl-2 transition-colors ${store.theme === 'dark' ? 'border-white/10' : 'border-slate-200'}`}>
                    <button 
                      onClick={() => switchAccountWithGoogle()}
                      className={`p-2 rounded-lg transition-all ${
                        store.theme === 'dark' ? 'hover:bg-indigo-500/10 text-indigo-400/70 hover:text-indigo-400' : 'hover:bg-slate-100 text-indigo-600'
                      }`}
                      title={t.switchAcc}
                    >
                      <Users className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setIsLogoutDialogOpen(true)}
                      className={`p-2 rounded-lg transition-all ${
                        store.theme === 'dark' ? 'hover:bg-rose-500/10 text-slate-400 hover:text-rose-400' : 'hover:bg-slate-100 text-slate-500'
                      }`}
                      title={t.logoutAction}
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={() => loginWithGoogle()}
                  className={`flex items-center gap-2 border px-3 md:px-4 py-2 rounded-lg text-sm md:text-base font-medium transition-all ${
                    store.theme === 'dark' 
                      ? 'bg-white/5 hover:bg-white/10 text-white border-white/10' 
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-sm'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.login}</span>
                </button>
              )}
            </div>
          </header>

          {/* WORKSPACE */}
          <div className="flex-1 overflow-auto p-4 md:p-8">
            {store.activeTab === 'generator' && <GeneratorWorkspace t={t} />}
            {store.activeTab === 'history' && <HistoryWorkspace t={t} />}
            {store.activeTab === 'privacy' && <PrivacyWorkspace t={t} />}
          </div>

          <footer className={`mt-auto py-10 px-6 border-t transition-all duration-500 ${store.theme === 'dark' ? 'border-white/5 bg-slate-900/40' : 'border-slate-100 bg-white'}`}>
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-px w-12 bg-gradient-to-r from-transparent via-current to-transparent transition-colors ${store.theme === 'dark' ? 'text-white/10' : 'text-slate-200'}`} />
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                  store.theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 shadow-sm'
                }`}>
                   <span className={`text-[10px] font-black uppercase tracking-tighter transition-colors ${store.theme === 'dark' ? 'text-indigo-300' : 'text-indigo-600'}`}>{t.est}</span>
                </div>
                <div className={`h-px w-12 bg-gradient-to-r from-transparent via-current to-transparent transition-colors ${store.theme === 'dark' ? 'text-white/10' : 'text-slate-200'}`} />
              </div>
              <p className={`text-[12px] font-medium tracking-normal text-center max-w-xs leading-relaxed italic transition-colors ${store.theme === 'dark' ? 'text-slate-400/80' : 'text-slate-500'}`}>
                {t.credits}
              </p>
            </div>
          </footer>
        </main>
      </div>

      <Dialog open={store.isExpanded} onOpenChange={store.setIsExpanded}>
        <DialogContent className="sm:max-w-xl bg-slate-900 border-white/10 text-white p-0 overflow-hidden">
          <div className="p-8 flex flex-col items-center gap-6">
            <div className="w-full flex justify-between items-center mb-2">
              <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-100 bg-clip-text text-transparent italic tracking-tight">QReate Preview</h3>
              <button 
                onClick={() => store.setIsExpanded(false)}
                className="p-2 hover:bg-white/5 rounded-full text-slate-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-white/20">
              <ExpandedQR />
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm">Escaneie o QR Code diretamente da tela para testes rápidos.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AiGeneratorDialog />

      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-white/10 text-white p-8">
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <LogOut className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold mb-2">{t.logoutTitle}</DialogTitle>
              <DialogDescription className="text-slate-400">
                {t.logoutConfirm}
              </DialogDescription>
            </div>
            <div className="flex w-full gap-3 mt-2">
              <button 
                onClick={() => setIsLogoutDialogOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-400 font-medium hover:bg-white/5 transition-all"
              >
                {t.cancel}
              </button>
              <button 
                onClick={() => {
                  logout();
                  setIsLogoutDialogOpen(false);
                }}
                className="flex-[1.5] py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-[0_4px_20px_rgba(220,38,38,0.2)]"
              >
                {t.logoutAction}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AiGeneratorDialog() {
  const store = useAppStore();
  const t = T[store.language as keyof typeof T] || T.en;
  const [prompt, setPrompt] = useState('');

  const handleAiGenerate = async () => {
    if (!prompt.trim()) return;
    
    store.setIsAiLoading(true);
    try {
      const result: AIQRResponse = await generateQrWithAi(prompt);
      
      // Apply the AI result to the store
      store.setQrType(result.qrType);
      
      if (result.qrType === 'URL' && result.data.url) store.setQrDataURL(result.data.url);
      else if (result.qrType === 'Text' && result.data.text) store.setQrDataText(result.data.text);
      else if (result.qrType === 'Email' && result.data.email) store.setEmailTo(result.data.email);
      else if (result.qrType === 'Wi-Fi') {
        if (result.data.wifiSsid) store.setWifiSsid(result.data.wifiSsid);
        if (result.data.wifiPass) store.setWifiPass(result.data.wifiPass);
        if (result.data.wifiEncryption) store.setWifiEncryption(result.data.wifiEncryption);
      }
      
      store.setDotType(result.dotType);
      store.setCornerType(result.cornerType);
      store.setQrColor(result.qrColor);
      store.setQrBgColor(result.qrBgColor);
      
      store.setIsAiDialogOpen(false);
      setPrompt('');
    } catch (error) {
      console.error('AI Generation failed:', error);
    } finally {
      store.setIsAiLoading(false);
    }
  };

  return (
    <Dialog open={store.isAiDialogOpen} onOpenChange={store.setIsAiDialogOpen}>
      <DialogContent className="sm:max-w-lg bg-slate-900 border-white/10 text-white p-0 overflow-hidden">
        <div className="p-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x"></div>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{t.aiTitle}</h2>
              <p className="text-slate-400 text-sm">{t.aiDesc}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t.aiPlaceholder}
                className="w-full h-32 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder:text-slate-600 focus:border-indigo-500 outline-none resize-none transition-all"
                disabled={store.isAiLoading}
              />
              {store.isAiLoading && (
                <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    <span className="text-sm font-medium text-indigo-300 animate-pulse">{t.aiConsulting}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => store.setIsAiDialogOpen(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-slate-400 font-medium hover:bg-white/5 transition-all"
                disabled={store.isAiLoading}
              >
                {t.cancel}
              </button>
              <button 
                onClick={handleAiGenerate}
                disabled={!prompt.trim() || store.isAiLoading}
                className="flex-[2] py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(79,70,229,0.3)]"
              >
                {store.isAiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.aiGenerating}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    {t.aiButton}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
            <p className="text-[11px] text-slate-500 leading-relaxed italic">
              {t.aiFooter}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ExpandedQR() {
  const store = useAppStore();
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  const finalPayloadData = useMemo(() => {
    switch (store.qrType) {
      case 'URL': return store.qrDataURL || ' ';
      case 'Text': return store.qrDataText || ' ';
      case 'Email': return `mailto:${store.emailTo}?subject=${encodeURIComponent(store.emailSubject)}&body=${encodeURIComponent(store.emailBody)}`;
      case 'Wi-Fi': return `WIFI:T:${store.wifiEncryption};S:${store.wifiSsid};P:${store.wifiPass};;`;
      case 'Image': return store.qrDataImage || ' ';
      default: return store.qrDataURL;
    }
  }, [store.qrType, store.qrDataURL, store.qrDataText, store.emailTo, store.emailSubject, store.emailBody, store.wifiSsid, store.wifiPass, store.wifiEncryption, store.qrDataImage]);

  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width: 450,
        height: 450,
        type: 'svg' as DrawType,
      });
    }
    
    if (ref.current) {
      ref.current.innerHTML = '';
      qrCode.current.append(ref.current);
      qrCode.current.update({ 
        data: finalPayloadData,
        dotsOptions: { color: store.qrColor, type: store.dotType },
        backgroundOptions: { color: store.qrBgColor },
        cornersSquareOptions: { color: store.qrColor, type: store.cornerType },
        cornersDotOptions: { color: store.qrColor, type: "dot" }
      });
    }
  }, [finalPayloadData, store.qrColor, store.qrBgColor, store.dotType, store.cornerType]);

  return <div ref={ref} className="w-[450px] h-[450px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-full" />;
}

function NavItem({ icon, label, active = false, onClick = () => {}, className = '' }: any) {
  const store = useAppStore();
  const isDark = store.theme === 'dark';
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-center md:justify-start gap-3 px-3 py-3 md:py-2.5 rounded-xl transition-all duration-300 outline-none border
        ${active 
          ? (isDark ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/20 shadow-inner' : 'bg-indigo-50 text-indigo-700 border-indigo-100 shadow-sm') 
          : (isDark ? 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border-transparent' : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600 border-transparent')}
        ${className}
      `}
      title={label}
    >
      <span className="text-current shrink-0">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </span>
      <span className="hidden md:block font-medium text-sm truncate">{label}</span>
      {active && <div className={`hidden md:block ml-auto w-1.5 h-1.5 rounded-full shrink-0 ${isDark ? 'bg-indigo-400 shadow-[0_0_5px_rgba(129,140,248,0.8)]' : 'bg-indigo-600'}`} />}
    </button>
  );
}

function PrivacyWorkspace({ t }: { t: any }) {
  const store = useAppStore();
  const isDark = store.theme === 'dark';

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center">
      <div className={`p-8 rounded-[3rem] border-2 transition-all duration-700 shadow-2xl relative overflow-hidden group
        ${store.privacyMode ? (isDark ? 'border-indigo-500/50 shadow-indigo-500/10' : 'border-indigo-400 shadow-indigo-500/20') : (isDark ? 'border-white/5 shadow-white/5' : 'border-slate-100 shadow-slate-200/50')}
        ${isDark ? (store.glassEnabled ? 'bg-slate-800/20 backdrop-blur-3xl' : 'bg-slate-800') : 'bg-white'}`}>
        
        {/* ATMOSPHERIC GLOW */}
        <div className={`absolute -top-24 -left-24 w-64 h-64 rounded-full blur-[100px] transition-all duration-700
          ${store.privacyMode ? 'bg-indigo-500/30' : (isDark ? 'bg-slate-500/10' : 'bg-slate-200/50')}`} />

        <div className="relative z-10 flex flex-col items-center">
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center mb-8 border-2 transition-all duration-500 
            ${store.privacyMode 
              ? (isDark ? 'bg-indigo-500/20 border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]' : 'bg-indigo-50 border-indigo-200 shadow-sm') 
              : (isDark ? 'bg-slate-900 border-white/10' : 'bg-slate-50 border-slate-200')}`}>
            <Shield className={`w-12 h-12 transition-all duration-500 ${store.privacyMode ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : 'text-slate-500'}`} />
          </div>

          <h2 className={`text-3xl font-bold mb-4 italic tracking-tight transition-colors ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.privTitle}</h2>
          <p className={`leading-relaxed mb-10 px-6 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.privDesc}</p>

          <div className={`text-sm font-black uppercase tracking-[0.2em] mb-8 transition-all duration-500
            ${store.privacyMode ? (isDark ? 'text-indigo-400' : 'text-indigo-600') : 'text-slate-600'}`}>
            {store.privacyMode ? t.privStatusActive : t.privStatusInactive}
          </div>

          <button
            onClick={() => store.setPrivacyMode(!store.privacyMode)}
            className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 border shadow-2xl
              ${store.privacyMode 
                ? 'bg-indigo-600 text-white border-indigo-400 hover:bg-indigo-500 hover:shadow-indigo-500/40 shadow-indigo-500/20' 
                : (isDark ? 'bg-white text-slate-900 border-white hover:bg-slate-200 shadow-white/10' : 'bg-slate-900 text-white border-slate-800 hover:bg-slate-800 shadow-slate-400/20')}`}
          >
            {t.privToggle}
          </button>
        </div>
      </div>
    </div>
  );
}

function HistoryWorkspace({ t }: { t: any }) {
  const store = useAppStore();
  const isDark = store.theme === 'dark';
  const [filter, setFilter] = useState<'24h' | '7d' | '15d' | '30d' | 'all'>('all');

  const filteredHistory = useMemo(() => {
    const now = Date.now();
    return store.history.filter(item => {
      if (filter === 'all') return true;
      const diff = (now - item.timestamp) / (1000 * 60 * 60);
      
      switch (filter) {
        case '24h': return diff <= 24;
        case '7d': return diff > 24 && diff <= 7 * 24;
        case '15d': return diff > 7 * 24 && diff <= 15 * 24;
        case '30d': return diff > 15 * 24 && diff <= 30 * 24;
        default: return true;
      }
    });
  }, [store.history, filter]);

  const handleApply = (item: any) => {
    store.setQrType(item.type);
    store.setDotType(item.options.dotType);
    store.setCornerType(item.options.cornerType);
    store.setQrColor(item.options.qrColor);
    store.setQrBgColor(item.options.qrBgColor);
    
    if (item.type === 'URL') store.setQrDataURL(item.data);
    if (item.type === 'Text') store.setQrDataText(item.data);
    if (item.type === 'Wi-Fi') {
      store.setWifiSsid(item.data.ssid);
      store.setWifiPass(item.data.pass);
      store.setWifiEncryption(item.data.enc);
    }
      if (item.type === 'Email') {
        store.setEmailTo(item.data.to);
        store.setEmailSubject(item.data.subject);
        store.setEmailBody(item.data.body);
      }
      if (item.type === 'Image') {
        store.setQrDataImage(item.data);
      }
    
    store.setActiveTab('generator');
  };

  return (
    <div className="flex flex-col h-full gap-8">
      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap gap-4">
        {[
          { id: '24h', label: t.h24 },
          { id: '7d', label: t.h7d },
          { id: '15d', label: t.h15d },
          { id: '30d', label: t.h30d },
          { id: 'all', label: t.hAll }
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id as any)}
            className={`min-w-[120px] px-6 py-4 rounded-2xl border transition-all flex flex-col items-start gap-1 group
              ${filter === btn.id 
                ? (isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-100') 
                : (isDark ? 'bg-slate-800/20 text-slate-400 border-white/5 hover:bg-white/5 hover:text-slate-300' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm')}`}
          >
            <span className="text-xs font-semibold uppercase tracking-widest opacity-60 group-hover:opacity-100">{btn.id === 'all' ? <Calendar className="w-3 h-3" /> : <Clock className="w-3 h-3" />}</span>
            <span className="text-sm font-bold">{btn.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1">
        {filteredHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-40 py-20">
            <History className="w-16 h-16 mb-4" />
            <p className="text-sm uppercase tracking-widest font-bold font-mono">{t.noHistory}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
            {filteredHistory.map((item) => (
              <HistoryCard 
                key={item.id} 
                item={item} 
                t={t} 
                onApply={() => handleApply(item)} 
                onDelete={async () => {
                  if (store.user) {
                    try {
                      await deleteDoc(doc(db, 'users', store.user.uid, 'history', item.id));
                    } catch (error) {
                      console.error("Error deleting from Firestore:", error);
                    }
                  } else {
                    store.deleteFromHistory(item.id);
                  }
                }} 
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HistoryCard({ item, t, onApply, onDelete }: { item: HistoryItem, t: any, onApply: () => void, onDelete: () => void, key?: any }) {
  const store = useAppStore();
  const isDark = store.theme === 'dark';
  const [showConfirm, setShowConfirm] = useState(false);
  
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(item.timestamp);

  const displayLabel = useMemo(() => {
    if (item.type === 'URL') return item.data;
    if (item.type === 'Text') return item.data.substring(0, 30) + (item.data.length > 30 ? '...' : '');
    if (item.type === 'Wi-Fi') return `Wi-Fi: ${item.data.ssid}`;
    if (item.type === 'Email') return `Email: ${item.data.to}`;
    return item.type;
  }, [item]);

  return (
    <div className={`group border rounded-3xl p-5 transition-all duration-300 shadow-lg flex items-start gap-4 ${
      isDark ? 'bg-slate-800/30 backdrop-blur-md border-white/5 hover:border-indigo-500/30' : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-indigo-100'
    }`}>
      {/* TINY QR PREVIEW */}
      <div 
        className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border transition-colors ${isDark ? 'border-white/10' : 'border-slate-100'}`}
        style={{ backgroundColor: item.options.qrBgColor }}
      >
        <QrCode className="w-10 h-10" style={{ color: item.options.qrColor }} />
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border transition-colors ${
            isDark ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
          }`}>
            {item.type}
          </span>
          <span className="text-[10px] text-slate-500 font-mono italic">{formattedDate}</span>
        </div>
        <p className={`font-medium text-sm truncate mb-3 transition-colors ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{displayLabel}</p>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onApply}
            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all ${
              isDark ? 'text-indigo-400 bg-indigo-500/5 border-indigo-500/10 hover:bg-indigo-500/15' : 'text-indigo-600 bg-indigo-50 border-indigo-100 hover:bg-indigo-100'
            }`}
            title={t.apply}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          
          <button 
            onClick={() => setShowConfirm(!showConfirm)}
            className={`ml-auto flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg border transition-all
              ${showConfirm 
                ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                : (isDark ? 'text-slate-500 bg-white/5 border-white/5 hover:text-red-400 hover:bg-red-500/5' : 'text-slate-400 bg-slate-50 border-slate-200 hover:text-red-600 hover:bg-red-50')}`}
          >
            {showConfirm ? t.deleteConfirm : <Trash2 className="w-3.5 h-3.5" />}
              {showConfirm && (
                <span onClick={(e) => { e.stopPropagation(); onDelete(); }} className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded text-[10px]">{t.confirmYes}</span>
              )}
          </button>
        </div>
      </div>
    </div>
  );
}

function GeneratorWorkspace({ t }: { t: any }) {
  const store = useAppStore();
  const qrRef = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadTaskRef = useRef<UploadTask | null>(null);

  const finalPayloadData = useMemo(() => {
    switch (store.qrType) {
      case 'URL': return store.qrDataURL || ' ';
      case 'Text': return store.qrDataText || ' ';
      case 'Email': return `mailto:${store.emailTo}?subject=${encodeURIComponent(store.emailSubject)}&body=${encodeURIComponent(store.emailBody)}`;
      case 'Wi-Fi': return `WIFI:T:${store.wifiEncryption};S:${store.wifiSsid};P:${store.wifiPass};;`;
      case 'Image': return store.qrDataImage || ' ';
      default: return store.qrDataURL;
    }
  }, [store.qrType, store.qrDataURL, store.qrDataText, store.emailTo, store.emailSubject, store.emailBody, store.wifiSsid, store.wifiPass, store.wifiEncryption, store.qrDataImage]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | undefined;
    
    if ('files' in e.target && e.target.files) {
      file = e.target.files[0];
    } else if ('dataTransfer' in e) {
      e.preventDefault();
      file = e.dataTransfer.files[0];
    }

    if (!file) return;
    if (!file.type.startsWith('image/')) return;

    // Check size - local processing is fine up to 10MB with Blob URLs
    if (file.size > 10 * 1024 * 1024) {
      alert(store.language === 'pt' ? "Arquivo muito grande. Use imagens menores que 10MB." : "File too large. Use images smaller than 10MB.");
      return;
    }

    // Revoke previous blob if any to save memory
    if (store.qrDataImage && store.qrDataImage.startsWith('blob:')) {
      URL.revokeObjectURL(store.qrDataImage);
    }

    // 1. Create local URL immediately so the user sees the image and the QR works right away
    const localUrl = URL.createObjectURL(file);
    store.setQrDataImage(localUrl);

    // 2. Start the background upload to Firebase for a permanent link
    store.setIsUploading(true);
    store.setUploadProgress(0);

    const uploadTimeout = setTimeout(() => {
      if (store.uploadProgress === 0 && store.isUploading) {
        console.warn("Upload stuck at 0%. Falling back to session-only mode.");
        store.setIsUploading(false);
        // We don't clear the image, it stays as the local blob so the user can still use it
      }
    }, 8000); // 8 seconds timeout for the first chunk

    try {
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTaskRef.current = uploadTask;

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          store.setUploadProgress(progress);
        },
        (error) => {
          clearTimeout(uploadTimeout);
          if (error.code === 'storage/canceled') {
            console.log("Upload canceled by user");
            store.setQrDataImage(''); 
          } else {
            console.error("Upload failed:", error);
            // Help the user understand if it's a permission issue or bucket not enabled
            if (error.code === 'storage/unauthorized' || error.code === 'storage/unknown') {
              console.warn("Permission denied or bucket not enabled. Using local session mode.");
            }
          }
          store.setIsUploading(false);
          uploadTaskRef.current = null;
        },
        async () => {
          clearTimeout(uploadTimeout);
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            store.setQrDataImage(downloadURL);
            if (localUrl.startsWith('blob:')) {
              URL.revokeObjectURL(localUrl);
            }
          } catch (err) {
            console.error("Error getting download URL:", err);
          } finally {
            store.setIsUploading(false);
            store.setUploadProgress(0);
            uploadTaskRef.current = null;
          }
        }
      );
    } catch (err) {
      clearTimeout(uploadTimeout);
      console.error("Firebase Storage error:", err);
      store.setIsUploading(false);
      uploadTaskRef.current = null;
    }
  };

  // Initialize QR Code Styling instance
  useEffect(() => {
    if (!qrCode.current) {
      qrCode.current = new QRCodeStyling({
        width: 300,
        height: 300,
        type: 'svg' as DrawType,
        margin: 5,
      });
    }
    
    if (qrRef.current) {
      qrRef.current.innerHTML = '';
      qrCode.current.append(qrRef.current);
    }
  }, []);

  const cancelUpload = () => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
      uploadTaskRef.current = null;
    }
    // Revoke if it's a blob to free memory
    if (store.qrDataImage && store.qrDataImage.startsWith('blob:')) {
      URL.revokeObjectURL(store.qrDataImage);
    }
    // Fully reset to return to the initial upload state
    store.setIsUploading(false);
    store.setUploadProgress(0);
    store.setQrDataImage('');
  };

  const updateQrCode = useMemo(() => {
    return (qr: QRCodeStyling | null, data: string) => {
      if (!qr) return;
      try {
        qr.update({ 
          data: data || ' ',
          image: store.qrType === 'Image' ? store.qrDataImage : undefined,
          dotsOptions: { color: store.qrColor, type: store.dotType },
          backgroundOptions: { color: store.qrBgColor },
          cornersSquareOptions: { color: store.qrColor, type: store.cornerType },
          cornersDotOptions: { color: store.qrColor, type: "dot" }
        });
      } catch (err) {
        console.error("QR Update failed", err);
      }
    };
  }, [store.qrColor, store.dotType, store.qrBgColor, store.cornerType, store.qrType, store.qrDataImage]);

  // Update on options change
  useEffect(() => {
    updateQrCode(qrCode.current, finalPayloadData);
  }, [finalPayloadData, updateQrCode]);

  const handleDownload = (ext: 'png' | 'svg' | 'jpeg') => {
    if (qrCode.current) {
      qrCode.current.download({ extension: ext, name: `QReate-QR` });
      handleSaveHistory(); // Auto-save on download
    }
  };

  const handleDownloadPDF = async () => {
    if (qrCode.current) {
      const blob = await qrCode.current.getRawData('png');
      if (blob) {
        const reader = new FileReader();
        reader.onload = () => {
          const imgData = reader.result as string;
          const pdf = new jsPDF();
          pdf.setFontSize(20);
          pdf.text("QReate Studio QR Code", 20, 20);
          pdf.addImage(imgData, 'PNG', 40, 40, 130, 130);
          pdf.setFontSize(10);
          pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 180);
          pdf.save("QReate-QR.pdf");
          handleSaveHistory();
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleSaveHistory = async () => {
    if (store.privacyMode) return; // Prevent saving in Privacy Mode
    
    let rawData: any;
    if (store.qrType === 'URL') rawData = store.qrDataURL;
    if (store.qrType === 'Text') rawData = store.qrDataText;
    if (store.qrType === 'Wi-Fi') rawData = { ssid: store.wifiSsid, pass: store.wifiPass, enc: store.wifiEncryption };
    if (store.qrType === 'Email') rawData = { to: store.emailTo, subject: store.emailSubject, body: store.emailBody };
    if (store.qrType === 'Image') rawData = store.qrDataImage;

    const historyId = Math.random().toString(36).substring(2, 9);
    const historyItem: HistoryItem = {
      id: historyId,
      type: store.qrType,
      data: rawData,
      timestamp: Date.now(),
      options: {
        dotType: store.dotType,
        cornerType: store.cornerType,
        qrColor: store.qrColor,
        qrBgColor: store.qrBgColor
      }
    };

    if (store.user) {
      try {
        await setDoc(doc(db, 'users', store.user.uid, 'history', historyId), historyItem);
      } catch (error) {
        console.error("Error saving to Firestore:", error);
      }
    } else {
      store.addToHistory(historyItem);
    }
  };

  const isDark = store.theme === 'dark';

  return (
    <div className="h-full grid grid-cols-1 xl:grid-cols-12 gap-8">
       {/* LEFT: Config Panel */}
       <div className="xl:col-span-7 2xl:col-span-8 flex flex-col gap-6">
         <div className={`border rounded-2xl p-6 shadow-lg transition-all duration-500 ${
           isDark 
             ? (store.glassEnabled ? 'bg-slate-800/30 backdrop-blur-xl border-white/5' : 'bg-slate-800 border-white/5') 
             : 'bg-white border-slate-200 shadow-md'
         }`}>
           <h2 className={`text-lg font-semibold mb-4 transition-colors ${isDark ? 'text-white' : 'text-slate-800'}`}>{t.contentType}</h2>
           <div className="flex flex-wrap gap-4 mb-6">
             {[
               { id: 'URL', label: t.typeURL }, 
               { id: 'Text', label: t.typeText }, 
               { id: 'Email', label: t.typeEmail }, 
               { id: 'Wi-Fi', label: t.typeWiFi },
               { id: 'Image', label: t.typeImage }
             ].map((type) => (
               <button 
                  key={type.id} 
                  onClick={() => store.setQrType(type.id as any)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    store.qrType === type.id 
                      ? (isDark ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-600 text-white shadow-md border border-indigo-700') 
                      : (isDark ? 'bg-slate-900/50 text-slate-400 border border-white/5 hover:bg-white/10' : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100')
                  }`}
                >
                 {type.label}
               </button>
             ))}
           </div>
           
           <div className="space-y-4">
             {store.qrType === 'URL' && (
                <input
                  type="text"
                  value={store.qrDataURL}
                  onChange={(e) => store.setQrDataURL(e.target.value)}
                  placeholder={t.placeholderURL}
                  className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono ${
                    isDark ? 'bg-slate-950/50 border-white/10 text-slate-200 placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                  }`}
                />
             )}
             
             {store.qrType === 'Text' && (
                <textarea
                  value={store.qrDataText}
                  onChange={(e) => store.setQrDataText(e.target.value)}
                  placeholder={t.placeholderText}
                  rows={4}
                  className={`w-full border rounded-xl px-4 py-3 outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono resize-none ${
                    isDark ? 'bg-slate-950/50 border-white/10 text-slate-200 placeholder:text-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400'
                  }`}
                />
             )}
             
             {store.qrType === 'Email' && (
                <div className="space-y-3">
                  <input type="email" placeholder={t.dest} value={store.emailTo} onChange={(e) => store.setEmailTo(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500/50 ${isDark ? 'bg-slate-950/50 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                  <input type="text" placeholder={t.subj} value={store.emailSubject} onChange={(e) => store.setEmailSubject(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500/50 ${isDark ? 'bg-slate-950/50 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                  <textarea placeholder={t.body} value={store.emailBody} onChange={(e) => store.setEmailBody(e.target.value)} rows={3} className={`w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none ${isDark ? 'bg-slate-950/50 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                </div>
             )}

             {store.qrType === 'Wi-Fi' && (
                <div className="space-y-3">
                  <input type="text" placeholder={t.ssid} value={store.wifiSsid} onChange={(e) => store.setWifiSsid(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500/50 ${isDark ? 'bg-slate-950/50 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                  <input type="password" placeholder={t.pass} value={store.wifiPass} onChange={(e) => store.setWifiPass(e.target.value)} className={`w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500/50 ${isDark ? 'bg-slate-950/50 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`} />
                  <select value={store.wifiEncryption} onChange={(e) => store.setWifiEncryption(e.target.value as any)} className={`w-full border rounded-xl px-4 py-2.5 outline-none focus:ring-1 focus:ring-indigo-500/50 ${isDark ? 'bg-slate-950/50 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">{t.wifiNone}</option>
                  </select>
                </div>
             )}

             {store.qrType === 'Image' && (
               <div className="space-y-4">
                 <div 
                   onDragOver={(e) => e.preventDefault()}
                   onDrop={handleImageUpload as any}
                   onClick={() => fileInputRef.current?.click()}
                   className={`group relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-4 transition-all cursor-pointer overflow-hidden ${
                     isDark ? 'border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5' : 'border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50'
                   }`}
                 >
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleImageUpload as any}
                     accept="image/*" 
                     className="hidden" 
                   />
                   
                   {store.qrDataImage ? (
                     <div className={`relative w-full aspect-video rounded-xl overflow-hidden border transition-colors ${isDark ? 'border-white/10 bg-black/40' : 'border-slate-200 bg-slate-100'}`}>
                        <img 
                          src={store.qrDataImage} 
                          alt="Preview" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                        {store.isUploading && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                            <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest">
                              {t.uploading} {store.uploadProgress}%
                            </div>
                          </div>
                        )}
                        {!store.isUploading && (
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white">
                            <UploadCloud className="w-8 h-8" />
                          </div>
                        )}
                     </div>
                   ) : store.isUploading ? (
                     <div className="flex flex-col items-center gap-3">
                       <Loader2 className={`w-10 h-10 animate-spin transition-colors ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                       <div className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.uploading} {store.uploadProgress}%</div>
                       <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           cancelUpload();
                         }}
                         className="mt-2 text-xs text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1.5 mx-auto px-3 py-1 bg-rose-500/10 border border-rose-500/20 rounded-full"
                       >
                         <X className="w-3 h-3" /> {t.cancel}
                       </button>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center gap-3 py-4">
                       <div className={`p-4 rounded-full border group-hover:scale-110 transition-all ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100 shadow-sm'}`}>
                         <UploadCloud className={`w-8 h-8 transition-colors ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                       </div>
                       <div className="text-center">
                         <p className={`text-sm font-medium transition-colors ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t.uploadImage}</p>
                         <p className="text-xs text-slate-500 mt-1">{t.dropImage}</p>
                       </div>
                     </div>
                   )}
                 </div>

                 {store.qrDataImage && (
                   <div className="space-y-3">
                     {store.isUploading ? (
                       <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-center justify-between">
                         <div className="flex gap-2 items-center">
                           <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
                           <p className={`text-xs font-medium transition-colors ${isDark ? 'text-indigo-100/70' : 'text-indigo-900/70'}`}>
                             {store.language === 'pt' ? 'Gerando link permanente...' : 'Generating permanent link...'} {store.uploadProgress}%
                           </p>
                         </div>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             cancelUpload();
                           }}
                           className="text-xs text-rose-400 hover:text-rose-300 transition-colors bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20"
                         >
                           {t.cancel}
                         </button>
                       </div>
                     ) : (
                       <div className={`border rounded-xl p-3 flex items-center justify-between gap-3 transition-colors ${isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-100'}`}>
                         <div className="flex gap-2 items-center">
                           <Sparkles className="w-4 h-4 text-emerald-400" />
                           <p className={`text-xs font-medium transition-colors ${isDark ? 'text-emerald-100/70' : 'text-emerald-900/70'}`}>
                             {store.language === 'pt' ? 'Imagem carregada com sucesso!' : 'Image loaded successfully!'}
                           </p>
                         </div>
                         <button 
                           onClick={(e) => {
                             e.stopPropagation();
                             store.setQrDataImage('');
                           }}
                           className={`text-xs underline transition-colors ${isDark ? 'text-slate-400 hover:text-white decoration-slate-400/30' : 'text-slate-500 hover:text-slate-800 decoration-slate-500/30'}`}
                         >
                           {store.language === 'pt' ? 'Remover' : 'Remove'}
                         </button>
                       </div>
                     )}
                   </div>
                 )}
               </div>
             )}
           </div>
         </div>

         {/* STYLING CARDS */}
         <div className="grid sm:grid-cols-2 gap-6">
            <div className={`border rounded-2xl p-6 shadow-lg transition-all duration-500 ${
              isDark 
                ? (store.glassEnabled ? 'bg-slate-800/30 backdrop-blur-xl border-white/5' : 'bg-slate-800 border-white/5') 
                : 'bg-white border-slate-200 shadow-md'
            }`}>
               <h3 className={`font-medium mb-4 flex items-center gap-2 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                 <Wand2 className="w-4 h-4 text-indigo-400" /> {t.pattern}
               </h3>
               <div className="space-y-4">
                 <div>
                   <label className="text-xs text-slate-500 mb-1.5 block uppercase tracking-wider">{t.dotPattern}</label>
                   <select value={store.dotType} onChange={(e) => store.setDotType(e.target.value as any)} className={`w-full border text-sm rounded-lg px-3 py-2 outline-none flex transition-colors ${isDark ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                     <option value="rounded">{t.stRounded}</option>
                     <option value="dots">{t.stDots}</option>
                     <option value="square">{t.stSquare}</option>
                     <option value="classy">{t.stClassy}</option>
                   </select>
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 mb-1.5 block uppercase tracking-wider">{t.cornerStyle}</label>
                   <select value={store.cornerType} onChange={(e) => store.setCornerType(e.target.value as any)} className={`w-full border text-sm rounded-lg px-3 py-2 outline-none transition-colors ${isDark ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                     <option value="extra-rounded">{t.crExtraRounded}</option>
                     <option value="dot">{t.crDot}</option>
                     <option value="square">{t.crSquare}</option>
                   </select>
                 </div>
               </div>
            </div>
            
            <div className={`border rounded-2xl p-6 shadow-lg transition-all duration-500 ${
              isDark 
                ? (store.glassEnabled ? 'bg-slate-800/30 backdrop-blur-xl border-white/5' : 'bg-slate-800 border-white/5') 
                : 'bg-white border-slate-200 shadow-md'
            }`}>
               <h3 className={`font-medium mb-4 flex items-center gap-2 transition-colors ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                 <ImageIcon className="w-4 h-4 text-indigo-400" /> {t.branding}
               </h3>
               <div className="space-y-4">
                 <div>
                   <label className="text-xs text-slate-500 mb-1.5 block uppercase tracking-wider">{t.qrColor}</label>
                   <div className="flex gap-2">
                     <input type="color" value={store.qrColor} onChange={(e) => store.setQrColor(e.target.value)} className={`w-10 h-10 rounded border bg-transparent cursor-pointer transition-colors ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                     <input type="text" value={store.qrColor} onChange={(e) => store.setQrColor(e.target.value)} className={`flex-1 border text-sm rounded-lg px-3 py-2 outline-none font-mono transition-colors ${isDark ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`} />
                   </div>
                 </div>
                 <div>
                   <label className="text-xs text-slate-500 mb-1.5 block uppercase tracking-wider">{t.bgColor}</label>
                   <div className="flex gap-2">
                     <input type="color" value={store.qrBgColor} onChange={(e) => store.setQrBgColor(e.target.value)} className={`w-10 h-10 rounded border bg-transparent cursor-pointer transition-colors ${isDark ? 'border-white/10' : 'border-slate-200'}`} />
                     <input type="text" value={store.qrBgColor} onChange={(e) => store.setQrBgColor(e.target.value)} className={`flex-1 border text-sm rounded-lg px-3 py-2 outline-none font-mono transition-colors ${isDark ? 'bg-slate-900 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`} />
                   </div>
                 </div>
               </div>
            </div>
         </div>
       </div>

       {/* RIGHT: Preview Panel */}
       <div className="xl:col-span-5 2xl:col-span-4 relative">
         <div className={`sticky top-0 border rounded-3xl p-6 flex flex-col items-center min-h-[500px] transition-all duration-500 shadow-2xl ${
           isDark 
            ? (store.glassEnabled ? 'bg-slate-800/30 backdrop-blur-xl border-white/5' : 'bg-slate-800 border-white/5') 
            : 'bg-white border-slate-200'
         }`}>
           <div className="w-full flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.live}</span>
               {store.privacyMode && (
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[9px] font-black uppercase tracking-tighter animate-pulse">
                    <Shield className="w-2.5 h-2.5" /> {t.privTitle}
                 </div>
               )}
               <button 
                  onClick={handleSaveHistory}
                  disabled={store.privacyMode}
                  className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded border transition-all
                    ${store.privacyMode 
                      ? 'opacity-30 cursor-not-allowed bg-slate-500/5 text-slate-500 border-white/5' 
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20'}`}
                >
                 <History className="w-3 h-3" /> {t.saveHist}
               </button>
             </div>
             <button 
                onClick={() => store.setIsExpanded(true)}
                className="text-slate-400 hover:text-white transition-colors"
                title="Expand Preview"
              >
               <Expand className="w-4 h-4" />
             </button>
           </div>
           
           <div className={`relative w-[300px] h-[300px] rounded-[2rem] border transition-all duration-300 p-6 flex items-center justify-center overflow-hidden ${
             isDark 
               ? 'bg-white shadow-[0_0_50px_rgba(255,255,255,0.03)] border-white/20' 
               : 'bg-white shadow-xl border-slate-200'
           }`}>
              <div 
                ref={qrRef} 
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full transition-all duration-300" 
              />
           </div>

           <div className={`mt-8 w-full space-y-3 transition-colors ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
             <button 
                onClick={() => handleDownload('png')}
                className={`w-full py-3.5 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                  isDark 
                   ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                   : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100'
                }`}
              >
               <Download className="w-5 h-5" /> {t.downPNG}
             </button>
             <div className="flex justify-center gap-2 pt-2">
               {['SVG', 'JPEG'].map((fmt) => (
                 <button 
                  key={fmt} 
                  onClick={() => handleDownload(fmt.toLowerCase() as any)}
                  className={`text-xs font-medium px-4 py-2 rounded-lg transition-all uppercase border ${
                    isDark 
                     ? 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 hover:border-white/20' 
                     : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                  }`}
                 >
                   {fmt === 'SVG' ? t.downSVG : t.downJPEG}
                 </button>
               ))}
               <button 
                 onClick={handleDownloadPDF}
                 className={`text-xs font-medium px-4 py-2 rounded-lg transition-all uppercase border ${
                   isDark 
                    ? 'bg-slate-950/50 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10 hover:border-white/20' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 shadow-sm'
                 }`}
               >
                 {t.downPDF}
               </button>
             </div>
           </div>
         </div>
       </div>
    </div>
  );
}

