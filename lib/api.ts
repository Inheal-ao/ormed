/**
 * Cliente HTTP para a API do backend ORMED.
 * Gere tokens de acesso/refresh (em localStorage) e renova automaticamente
 * o acesso quando expira (401), reenviando o pedido original uma vez.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

const ACCESS_KEY = "ormed_access_token";
const REFRESH_KEY = "ormed_refresh_token";

export interface ApiError {
  statusCode: number;
  message: string | string[];
}

// ===== Gestão de tokens =====
export const tokenStore = {
  getAccess: () =>
    typeof window !== "undefined" ? localStorage.getItem(ACCESS_KEY) : null,
  getRefresh: () =>
    typeof window !== "undefined" ? localStorage.getItem(REFRESH_KEY) : null,
  set: (access: string, refresh?: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

async function tryRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    tokenStore.set(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
  isFormData?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false, isFormData = false } = options;

  const doFetch = async (): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (auth) {
      const token = tokenStore.getAccess();
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }
    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: isFormData
        ? (body as FormData)
        : body
          ? JSON.stringify(body)
          : undefined,
    });
  };

  let res = await doFetch();

  // Renovação automática do token numa falha de autenticação
  if (res.status === 401 && auth && (await tryRefresh())) {
    res = await doFetch();
  }

  if (!res.ok) {
    let message: string | string[] = `Erro ${res.status}`;
    try {
      const err = (await res.json()) as ApiError;
      message = err.message ?? message;
    } catch {
      /* resposta sem corpo JSON */
    }
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(path: string, auth = false) => request<T>(path, { auth }),
  post: <T>(path: string, body?: unknown, auth = false) =>
    request<T>(path, { method: "POST", body, auth }),
  patch: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "PATCH", body, auth }),
  put: <T>(path: string, body?: unknown, auth = true) =>
    request<T>(path, { method: "PUT", body, auth }),
  delete: <T>(path: string, auth = true) =>
    request<T>(path, { method: "DELETE", auth }),
  upload: <T>(path: string, file: File, kind: "image" | "pdf") => {
    const form = new FormData();
    form.append("file", file);
    return request<T>(`${path}/${kind}`, {
      method: "POST",
      body: form,
      auth: true,
      isFormData: true,
    });
  },
};

export { API_URL };
