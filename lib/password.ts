// Regra de password forte (igual à do backend): mín. 8, maiúscula, minúscula, número, símbolo.
export const STRONG_PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

export function isStrongPassword(pw: string): boolean {
  return STRONG_PW_REGEX.test(pw);
}

export interface PwStrength {
  score: number; // 0..4
  label: string;
  checks: { len: boolean; lower: boolean; upper: boolean; digit: boolean; symbol: boolean };
}

export function passwordStrength(pw: string): PwStrength {
  const checks = {
    len: pw.length >= 8,
    lower: /[a-z]/.test(pw),
    upper: /[A-Z]/.test(pw),
    digit: /\d/.test(pw),
    symbol: /[\W_]/.test(pw),
  };
  const passed = Object.values(checks).filter(Boolean).length;
  const score = Math.max(0, passed - 1); // 0..4
  const label = ["Muito fraca", "Fraca", "Razoável", "Forte", "Muito forte"][score] ?? "Fraca";
  return { score, label, checks };
}

/** Gera uma password forte aleatória que cumpre a regra. */
export function generateStrongPassword(length = 14): string {
  const lower = "abcdefghijkmnpqrstuvwxyz";
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const symbols = "!@#$%&*?-_+=";
  const all = lower + upper + digits + symbols;
  const rand = (set: string) => set[Math.floor(Math.random() * set.length)];
  let pw = [rand(lower), rand(upper), rand(digits), rand(symbols)];
  for (let i = pw.length; i < length; i++) pw.push(rand(all));
  // baralhar
  for (let i = pw.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pw[i], pw[j]] = [pw[j], pw[i]];
  }
  return pw.join("");
}
