// Thin fetch wrapper. Protected calls send the JWT (issued from the BetterAuth session).
const KEY = "agro_jwt";
let memoryToken = null;

const decode = (t) => {
  try { return JSON.parse(atob(t.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))); } catch { return null; }
};
const isFresh = (t) => { const p = t && decode(t); return !!p && p.exp * 1000 > Date.now() + 30000; };

export function clearToken() {
  memoryToken = null;
  try { localStorage.removeItem(KEY); } catch {}
}

export async function getToken(force = false) {
  if (!force) {
    try { memoryToken ??= localStorage.getItem(KEY); } catch {}
    if (isFresh(memoryToken)) return memoryToken;
  }
  const res = await fetch("/api/jwt", { method: "POST", credentials: "include" });
  if (!res.ok) { clearToken(); return null; }
  memoryToken = (await res.json()).token;
  try { localStorage.setItem(KEY, memoryToken); } catch {}
  return memoryToken;
}

export async function api(path, { method = "GET", body, auth = false } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const send = () => fetch(`/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });

  if (auth) {
    const t = await getToken();
    if (!t) throw new Error("Please sign in again");
    headers.Authorization = `Bearer ${t}`;
  }
  let res = await send();
  if (res.status === 401 && auth) {
    const t = await getToken(true);
    if (t) { headers.Authorization = `Bearer ${t}`; res = await send(); }
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
}
