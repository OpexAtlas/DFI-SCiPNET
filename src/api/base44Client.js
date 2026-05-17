import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

// read API key from environment (optional)
const API_KEY = import.meta.env.VITE_BASE44_API_KEY;

//Create a client with authentication required
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: import.meta.env.VITE_BASE44_SERVER_URL || undefined,
  requiresAuth: false,
  appBaseUrl: appBaseUrl || "https://base44.app",
  headers: API_KEY ? { api_key: API_KEY } : undefined,
});
