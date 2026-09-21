/**************************************************************
 * VEXORA INTERNATIONAL — Frontend Config
 * ------------------------------------------------------------
 * YAHAN APNI DO CHEEZEIN DAALEIN:
 *
 * 1) API_URL:https://script.google.com/macros/s/AKfycbyLtlTV4OeUm7uHdNmv_7ZIzVjh4eFT9epyGXrrtlMcBtD-VCPOAegLZLqLqY-2YBMn0A/exec
 *    Apps Script "Deploy > New deployment > Web app" karne ke baad
 *    jo URL milta hai (.../exec se khatam hota hai), wo yahan paste karein.
 *
 * 2) GOOGLE_CLIENT_ID:
 *    https://console.cloud.google.com/ par jaake
 *    "APIs & Services > Credentials > Create Credentials > OAuth Client ID"
 *    (type: Web application) banayein, phir wahan se Client ID copy karein.
 *    Authorized JavaScript origins mein apni website ka domain add karna
 *    na bhoolein (jaise https://vexora-international.com)
 **************************************************************/

const CONFIG = {
  API_URL: "https://script.google.com/macros/s/AKfycbyLtlTV4OeUm7uHdNmv_7ZIzVjh4eFT9epyGXrrtlMcBtD-VCPOAegLZLqLqY-2YBMn0A/exec",
  GOOGLE_CLIENT_ID: "28032329800-cbomi45s0ioea9mfoqsq6rlk802gqg59.apps.googleusercontent.com",
  HCAPTCHA_SITE_KEY: "PASTE_YOUR_HCAPTCHA_SITE_KEY_HERE",
  SITE_NAME: "Vexora International",
  CURRENCY_SYMBOL: "",
  CURRENCY_NAME: "Token",
  TOKENS_PER_USDT: 100000 // 1,00,000 token = 1 USDT
};

// ---- Helper: token ko formatted string mein dikhana, jaise "1,250 Token" ----
function formatTokens(amount) {
  const n = Math.round(Number(amount) || 0);
  return n.toLocaleString('en-US') + ' ' + CONFIG.CURRENCY_NAME;
}

// ---- Helper: token ko USDT mein convert karna (withdrawal ke liye) ----
function tokensToUSDT(tokens) {
  return Number(tokens) / CONFIG.TOKENS_PER_USDT;
}

// ---- Helper: current user ki IP address maloom karna (public API) ----
async function getUserIP() {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch (e) {
    return 'unknown';
  }
}

// ---- Helper: Apps Script backend ko GET request bhejna ----
async function apiGet(action, params = {}) {
  const url = new URL(CONFIG.API_URL);
  url.searchParams.append('action', action);
  Object.keys(params).forEach(k => url.searchParams.append(k, params[k]));
  const res = await fetch(url);
  return res.json();
}

// ---- Helper: Apps Script backend ko POST request bhejna ----
async function apiPost(action, payload = {}) {
  const ip = await getUserIP();
  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Apps Script CORS-friendly
    body: JSON.stringify({ action, ip, ...payload })
  });
  return res.json();
}

// ---- Helper: logged-in user session (localStorage use nahi kar sakte artifacts mein,
// lekin ye asal website file hai isliye localStorage yahan chalega) ----
function saveSession(user) {
  localStorage.setItem('vexora_user', JSON.stringify(user));
}
function getSession() {
  const raw = localStorage.getItem('vexora_user');
  return raw ? JSON.parse(raw) : null;
}
function clearSession() {
  localStorage.removeItem('vexora_user');
}
function requireLogin() {
  const user = getSession();
  if (!user) window.location.href = 'index.html';
  return user;
}
