const CHAT_ENDPOINT = "https://ai-zntk.onrender.com/api/chat";
const wrap = document.getElementById("bechatWrap");
const panel = document.getElementById("bechatPanel");
const body = document.getElementById("bechatBody");
const form = document.getElementById("bechatForm");
const input = document.getElementById("bechatInput");
const btnFab = document.getElementById("bechatFab");
const btnClose = document.getElementById("bechatClose");
const btnClear = document.getElementById("bechatClear");
const LS_OPEN = "bechat_open";
const LS_HISTORY = "bechat_history";
const LS_LANG = "bechat_lang";
const navEntry = performance.getEntriesByType("navigation")[0];
const isReload = navEntry && navEntry.type === "reload";
if (isReload) {
  localStorage.removeItem(LS_HISTORY);
  localStorage.removeItem(LS_LANG);
}
let history = loadHistory();
function escapeText(s){
  const div = document.createElement("div");
  div.textContent = (s ?? "").toString();
  return div.innerHTML;
}
function linkify(text) {
  // mailto: varsa temizle (double-link bug'onu onler)
  text = (text || "").replace(/\bmailto:/gi, "");
  // 1) URL linkle
  const urlPattern = /(\b(https?|ftp):\/\/[\-\w+&@#\/%?=~|!:,.]*[\-\w+&@#\/%=~|])/gi;
  text = text.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
  // 2) E-posta linkle (duz email)
  const emailPattern = /\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b/gi;
  text = text.replace(emailPattern, (mail) => `<a href="mailto:${mail}">${mail}</a>`);
  return text;
}
function addMsg(role, text, meta = ""){
  const div = document.createElement("div");
  div.className = "bechat-msg " + role;
  div.innerHTML = linkify(escapeText(text));
  if (meta){
    const m = document.createElement("div");
    m.className = "bechat-meta";
    m.textContent = meta;
    div.appendChild(m);
  }
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return div;
}
function addTyping(){
  const div = document.createElement("div");
  div.className = "bechat-msg bot";
  const t = document.createElement("div");
  t.className = "bechat-typing";
  t.innerHTML = `<span class="bechat-dot"></span><span class="bechat-dot"></span><span class="bechat-dot"></span>`;
  div.appendChild(t);
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return div;
}
function setOpen(isOpen){
  wrap.classList.toggle("is-open", isOpen);
  localStorage.setItem(LS_OPEN, isOpen ? "1" : "0");
  if (isOpen) input?.focus();
}
function getIsEn(){
  const path = window.location.pathname || "";
  return path === "/en" || path.startsWith("/en/");
}
function currentLang(){
  return getIsEn() ? "en" : "tr";
}
function loadHistory(){
  try{
    const lang = currentLang();
    const savedLang = localStorage.getItem(LS_LANG);
    if (savedLang && savedLang !== lang){
      localStorage.removeItem(LS_HISTORY);
    }
    const raw = localStorage.getItem(LS_HISTORY);
    const arr = raw ? JSON.parse(raw) : [];
    localStorage.setItem(LS_LANG, lang);
    return Array.isArray(arr) ? arr.slice(0, 20) : [];
  }catch{
    return [];
  }
}
function saveHistory(){
  try{
    localStorage.setItem(LS_LANG, currentLang());
    localStorage.setItem(LS_HISTORY, JSON.stringify(history.slice(-20)));
  }catch{}
}
function renderHistory(){
  body.innerHTML = "";
  if (!history.length){
    addMsg("bot", getIsEn()
      ? "Hi I'm BerayEfe Bot. What can I help you with?"
      : "Selam ben BerayEfe Bot. Yaz bakalim ne lazim?"
    );
    return;
  }
  for (const h of history){
    addMsg(h.role, h.text);
  }
}
async function askBot(userText){
  if (!CHAT_ENDPOINT){
    return "Su an servis kapali.";
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000); // 12 sn timeout
  try {
    const payload = {
      message: userText,
      page: window.location.pathname,
      title: document.title,
      lang: currentLang(),
      history: history.slice(-10)
    };

    const r = await fetch(CHAT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!r.ok) {
      if (r.status === 429) return "2-3 saniye bekleyip tekrar dene.";
      if (r.status === 502) return "AI servisi patladi, birazdan tekrar dene.";
      throw new Error("HTTP " + r.status);
    }
    const data = await r.json();
    return data?.reply || "Cevap gelmedi.";
  } catch (err) {
    console.error("Chat error:", err);
    return "Cevap gelmedi, tekrar dener misin? ";
  } finally {
    clearTimeout(timeout);
  }
}
renderHistory();
const wasOpen = localStorage.getItem(LS_OPEN) === "1";
setOpen(wasOpen);
btnFab?.addEventListener("click", () => {
  setOpen(!wrap.classList.contains("is-open"));
});
btnClose?.addEventListener("click", () => setOpen(false));
btnClear?.addEventListener("click", () => {
  history = [];
  saveHistory();
  renderHistory();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && wrap.classList.contains("is-open")) setOpen(false);
});
form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  // UI kilitle
  input.value = "";
  input.disabled = true;
  const sendBtn = form.querySelector(".bechat-send");
  if (sendBtn) sendBtn.disabled = true;
  addMsg("user", text);
  history.push({ role: "user", text });
  saveHistory();
  const typing = addTyping();
  try{
    const reply = await askBot(text);
    typing.remove();
    addMsg("bot", reply);
    history.push({ role: "assistant", text: reply });
    saveHistory();
  }catch(err){
    typing.remove();
    addMsg("bot", "Baglanti/servis hatasi oldu. (Endpoint yoksa normal)");
  }finally{
    input.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    input.focus();
  }
});
