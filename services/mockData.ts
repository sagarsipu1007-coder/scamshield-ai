/**
 * Mock shared data store for ScamShield AI demo.
 * In-memory state used by mock services so flows feel coherent.
 */

import type { AuthUser } from './types';

export const mockScamShieldUser: { user: AuthUser | null } = { user: null };

const palettes = ['#0E7C66', '#1F6FEB', '#7C4D0E', '#5B2A86'];

export function pickAvatarColor(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
}
