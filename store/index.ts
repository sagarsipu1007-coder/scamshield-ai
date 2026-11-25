import { configureStore, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '@/theme/tokens';
import type { AuthUser, AuthSession, MFAStatus } from '@/services/types';

/* ----------------------------- Preferences ----------------------------- */

interface PreferencesState {
  themeMode: ThemeMode;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  scanAlertsEnabled: boolean;
  securityAlertsEnabled: boolean;
  productUpdatesEnabled: boolean;
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  language: string;
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState: {
    themeMode: 'system',
    biometricEnabled: false,
    notificationsEnabled: true,
    scanAlertsEnabled: true,
    securityAlertsEnabled: true,
    productUpdatesEnabled: false,
    reduceMotion: false,
    highContrast: false,
    largeText: false,
    language: 'en',
  } as PreferencesState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    setBiometricEnabled(state, action: PayloadAction<boolean>) {
      state.biometricEnabled = action.payload;
    },
    setNotificationsEnabled(state, action: PayloadAction<boolean>) {
      state.notificationsEnabled = action.payload;
    },
    setScanAlertsEnabled(state, action: PayloadAction<boolean>) {
      state.scanAlertsEnabled = action.payload;
    },
    setSecurityAlertsEnabled(state, action: PayloadAction<boolean>) {
      state.securityAlertsEnabled = action.payload;
    },
    setProductUpdatesEnabled(state, action: PayloadAction<boolean>) {
      state.productUpdatesEnabled = action.payload;
    },
    setReduceMotion(state, action: PayloadAction<boolean>) {
      state.reduceMotion = action.payload;
    },
    setHighContrast(state, action: PayloadAction<boolean>) {
      state.highContrast = action.payload;
    },
    setLargeText(state, action: PayloadAction<boolean>) {
      state.largeText = action.payload;
    },
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
  },
});

/* -------------------------------- Auth --------------------------------- */

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  session: AuthSession | null;
  mfa: MFAStatus;
  recoveryCodesViewed: boolean;
  error: string | null;
}

const initialAuth: AuthState = {
  status: 'idle',
  user: null,
  session: null,
  mfa: {
    enrolled: false,
    method: null,
    authenticatorSecret: null,
    authenticatorQrUri: null,
    backupCodes: [],
  },
  recoveryCodesViewed: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuth,
  reducers: {
    setStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.status = action.payload ? 'loading' : state.status === 'loading' ? 'idle' : state.status;
    },
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
    },
    setSession(state, action: PayloadAction<AuthSession | null>) {
      state.session = action.payload;
    },
    setMfa(state, action: PayloadAction<Partial<MFAStatus>>) {
      state.mfa = { ...state.mfa, ...action.payload };
    },
    setRecoveryCodesViewed(state, action: PayloadAction<boolean>) {
      state.recoveryCodesViewed = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetAuth(state) {
      return { ...initialAuth, status: 'unauthenticated' as const };
    },
  },
});

/* ------------------------------- Chat ---------------------------------- */

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
  suggestions?: string[];
}

interface ChatState {
  messages: ChatMessage[];
  typing: boolean;
  conversations: { id: string; title: string; updatedAt: number; messages: ChatMessage[] }[];
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: [],
    typing: false,
    conversations: [],
  } as ChatState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setTyping(state, action: PayloadAction<boolean>) {
      state.typing = action.payload;
    },
    clearMessages(state) {
      state.messages = [];
    },
    saveConversation(state, action: PayloadAction<{ id: string; title: string }>) {
      state.conversations.unshift({
        id: action.payload.id,
        title: action.payload.title,
        updatedAt: Date.now(),
        messages: state.messages,
      });
      state.messages = [];
    },
    loadConversation(state, action: PayloadAction<string>) {
      const convo = state.conversations.find((c) => c.id === action.payload);
      if (convo) state.messages = convo.messages;
    },
  },
});

export const {
  setThemeMode,
  setBiometricEnabled,
  setNotificationsEnabled,
  setScanAlertsEnabled,
  setSecurityAlertsEnabled,
  setProductUpdatesEnabled,
  setReduceMotion,
  setHighContrast,
  setLargeText,
  setLanguage,
} = preferencesSlice.actions;

export const {
  setStatus,
  setLoading,
  setUser,
  setSession,
  setMfa,
  setRecoveryCodesViewed,
  setAuthError,
  resetAuth,
} = authSlice.actions;

export const { addMessage, setTyping, clearMessages, saveConversation, loadConversation } =
  chatSlice.actions;

export const preferencesReducer = preferencesSlice.reducer;
export const authReducer = authSlice.reducer;
export const chatReducer = chatSlice.reducer;

export const store = configureStore({
  reducer: {
    preferences: preferencesReducer,
    auth: authReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
