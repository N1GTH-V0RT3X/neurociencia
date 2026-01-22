/* =====================================================
   VARIABLES GENERALES
===================================================== */
const btnAcc = document.getElementById('btnAccesibilidad');
const menuAcc = document.getElementById('menuAccesibilidad');
 
const btnMenu = document.getElementById('btn-menu');
const menuLateral = document.getElementById('menu-lateral');

let fontSize = 1;


/* =====================================================
   ANUNCIOS PARA LECTORES DE PANTALLA (JAWS)
===================================================== */
function announce(msg){
  const sr = document.getElementById("sr-status");
  if (!sr) return;
  sr.textContent = "";
  setTimeout(() => {
    sr.textContent = msg;
  }, 30);
}


function speakQueue(messages, stepMs = 850) {
  messages.forEach((m, i) => {
    setTimeout(() => announce(m), i * stepMs);
  });
}

/* Anuncio inicial al cargar la página */

document.addEventListener("DOMContentLoaded", () => {
  const titulo = "Neurociencia Aplicada a la Educación de Personas con Discapacidad";

  const secciones = Array.from(document.querySelectorAll("main h2"))
    .map(h => h.textContent.trim())
    .filter(Boolean);

  const mensajes = [
    titulo, titulo, titulo,
    `Secciones: ${secciones.join(", ")}.`,
    "Información de Inicio lectores: Para abrir ayuda en Windows presiona Alt más i. En MacOS presiona Control más Option más i. Para cerrar la ayuda en Windows presiona Alt más X. En MacOS presiona Escape.",
    "Información de Lector inmersivo: Windows: Abrir menú principal Alt más M. Cerrar menú principal Alt más C. Archivo de lectura fácil Alt más L. MacOS: Abrir menú principal Control más Option más M. Cerrar Control más Option más C. Archivo de lectura fácil Control más Option más L.",
    "Menú: Alt más M. Cerrar menú: Alt más C.",
    "Comenzando lectura del contenido."
  ];

  speakQueue(mensajes, 900);

  // Mover foco al contenido para que JAWS inicie en el main
  setTimeout(() => {
    const firstSection = document.querySelector("main section[tabindex='0']") || document.getElementById("contenido");
    firstSection?.focus?.();
  }, mensajes.length * 900 + 200);
});

/* =====================================================
   MODAL DE AYUDA (Atajos de teclado)
===================================================== */

(function () {
  const overlay = document.getElementById("overlay-ayuda");
  const modal   = document.getElementById("modal-ayuda");
  if (!overlay || !modal) return;

  const btnX = modal.querySelector(".modal-cerrar");
  const btnClose = modal.querySelector(".btn-cerrar");
  if (!btnX || !btnClose) return;

  let lastFocus = null;

  function openAyuda() {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    btnX.focus();
  }

  function closeAyuda() {
    overlay.hidden = true;
    modal.hidden = true;
    document.body.style.overflow = "";
    lastFocus?.focus?.();
  }

  btnX.addEventListener("click", closeAyuda);
  btnClose.addEventListener("click", closeAyuda);
  overlay.addEventListener("click", closeAyuda);

  document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();
    const mac = e.ctrlKey && e.altKey;   // ctrl+option
    const win = e.altKey && !e.ctrlKey;  // alt

    // Abrir: Alt+I (Win) / Ctrl+Alt+I (Mac)
    if ((win || mac) && key === "i") {
      e.preventDefault();
      openAyuda();
    }

    // Cerrar: Alt+X (Win)
    if (win && key === "x" && !modal.hidden) {
      e.preventDefault();
      closeAyuda();
    }

    // Cerrar: Esc (Mac / general)
    if (e.key === "Escape" && !modal.hidden) {
      e.preventDefault();
      closeAyuda();
    }
  });
})();



/* =====================================================
   MENÚ LATERAL (Alt + M / Alt + C)
===================================================== */

if (btnMenu && menuLateral) {
  btnMenu.addEventListener('click', toggleMenu);

  document.addEventListener('keydown', (e) => {
    if (e.altKey && e.key.toLowerCase() === 'm') {
      e.preventDefault();
      openMenu();
    }

    if (e.altKey && e.key.toLowerCase() === 'c') {
      e.preventDefault();
      closeMenu();
    }
  });
}

function toggleMenu() {
  const expanded = btnMenu.getAttribute('aria-expanded') === 'true';
  expanded ? closeMenu() : openMenu();
}

function openMenu() {
  btnMenu.setAttribute('aria-expanded', 'true');
  menuLateral.hidden = false;
  menuLateral.querySelector('a')?.focus();

  announce("Menú principal abierto");
}

function closeMenu() {
  btnMenu.setAttribute('aria-expanded', 'false');
  menuLateral.hidden = true;
  btnMenu.focus();

  announce("Menú principal cerrado");
}

/* =====================================================
   BOTÓN DE ACCESIBILIDAD
===================================================== */

if (btnAcc && menuAcc) {

 btnAcc.addEventListener("click", (e) => {
  e.preventDefault();
  const expanded = btnAcc.getAttribute("aria-expanded") === "true";
  btnAcc.setAttribute("aria-expanded", String(!expanded));
  menuAcc.hidden = expanded;
  if (!expanded) menuAcc.querySelector("button")?.focus();
});
}
/* =====================================================
   MODAL LECTOR INMERSIVO
===================================================== */  
function openLectorModal(){
  
  const overlay = document.getElementById("overlay-lector");
  const modal   = document.getElementById("modal-lector");
  if(!overlay || !modal) return;

  overlay.hidden = false;
  modal.hidden = false;

  // foco accesible
  const closeBtn = modal.querySelector(".modal-cerrar") || modal.querySelector(".btn-cerrar");
  closeBtn && closeBtn.focus();

  function close(){
    overlay.hidden = true;
    modal.hidden = true;
    document.removeEventListener("keydown", onKey);
    btnAcc?.focus();
    announce("Lector inmersivo cerrado");
  }

  function onKey(e){
    if(e.key === "Escape") close();
  }

  overlay.addEventListener("click", close, { once:true });
  modal.querySelector(".modal-cerrar")?.addEventListener("click", close, { once:true });
  modal.querySelector(".btn-cerrar")?.addEventListener("click", close, { once:true });
  document.addEventListener("keydown", onKey);
  announce("Lector inmersivo abierto");
}

/* =====================================================
   ATAJOS DE TECLADO (Windows / macOS)
   Win: Alt+M, Alt+C, Alt+L
   mac: Ctrl+Option+M/C/L  (equivale a Ctrl+Alt en navegador)
===================================================== */

function isTypingContext(el) {
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    tag === "select" ||
    el.isContentEditable
  );
}

function handleShortcut(e) {
  // No disparar atajos si el usuario está escribiendo
  if (isTypingContext(document.activeElement)) return;

  const key = e.key.toLowerCase();

  // macOS: Control + Option suele llegar como ctrlKey + altKey en el navegador
  const isMacCombo = e.ctrlKey && e.altKey;
  // Windows: Alt + tecla (sin Ctrl)
  const isWinCombo = e.altKey && !e.ctrlKey;

  // Solo escuchamos si está en una de las combinaciones esperadas
  if (!isMacCombo && !isWinCombo) return;

  // Normaliza: queremos M, C o L
  if (!["m", "c", "l"].includes(key)) return;

  e.preventDefault();

  // ===== ACCIONES =====
  if (key === "m") {
    // Abrir menú principal
    openMenu();
    return;
  }

  if (key === "c") {
    // Cerrar menú principal
    closeMenu();
    return;
  }

  if (key === "l") {
    // Lectura fácil / Lector inmersivo
    // Opción A: abrir tu modal existente
    openLectorModal();

    // Opción B (si quieres descargar un PDF de lectura fácil):
    // descargarLecturaFacil();
    return;
  }
}

// Importante: usar keydown a nivel documento
document.addEventListener("keydown", handleShortcut);



/* =====================================================
   FUNCIONES DE ACCESIBILIDAD
===================================================== */

function ajustarFuente(valor) {
  fontSize = Math.min(Math.max(fontSize + valor, 0.8), 1.5);
  document.documentElement.style.fontSize = fontSize + 'em';
}

/* Cerrar menú de accesibilidad */
function closeAccMenu() {
  btnAcc.setAttribute("aria-expanded", "false");
  menuAcc.hidden = true;
}
/* Acciones del menú de accesibilidad */
menuAcc.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;

  const action = btn.dataset.action;

  switch (action) {
    case "lector":
      openLectorModal();
      announce("Lectura en voz alta iniciada");
     if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
    detenerLectura();
  } else {
    leerContenido();
  }
 
      break;

case "pausar":
    pausarLectura();
    break;

  case "reanudar":
    reanudarLectura();
    break;

  case "detener":
    detenerLectura();
    break;

    case "linea":
      document.body.classList.toggle("linea-lectura");
      break;
    case "fuente-mas":
      ajustarFuente(0.1);
      break;
    case "fuente-menos":
      ajustarFuente(-0.1);
      break;
    case "resaltar":
      const activo2 = document.body.classList.toggle("resaltar-enlaces");

  // Actualiza estado accesible
  btn.setAttribute("aria-pressed", String(activo2));

  announce(activo2
    ? "Resaltado de enlaces activado"
    : "Resaltado de enlaces desactivado"
  );
  break;
    case "tabulador":
       const activo = document.body.classList.toggle("resaltar-tab");
  // Actualiza el estado accesible
  btn.setAttribute("aria-pressed", String(activo));

      announce(activo
    ? "Resaltado de tabulación activado"
    : "Resaltado de tabulación desactivado"
  );
      break;

      case "cursor-toggle": {
       // console.log("CLICK ACC:", btn, btn.dataset.action);
        toggleCursorGrande(btn);
        break;
}

  }

  // ✅ Cierra menú después de ejecutar
  closeAccMenu();

  // ✅ Devuelve foco al botón (mejor para teclado/JAWS)
  btnAcc.focus();
});

/* Cerrar menú al hacer clic fuera */
document.addEventListener("click", (e) => {
  const isClickInside = e.target.closest(".accesibilidad-wrapper");
  if (!isClickInside && !menuAcc.hidden) {
    btnAcc.setAttribute("aria-expanded", "false");
    menuAcc.hidden = true;
  }
});


/* =====================================================
   FIX: MODAL "+ Información" (experto)
   Pegar al final de accesibilidad.js
===================================================== */
(function () {
  const btnOpen  = document.getElementById("btnInfoExperto");
  const modal    = document.getElementById("modal-experto");
  const overlay  = document.getElementById("overlay-experto");

  if (!btnOpen || !modal || !overlay) return;

  const btnX     = modal.querySelector(".modal-cerrar");
  const btnClose = modal.querySelector(".btn-cerrar");
  if (!btnX || !btnClose) return;

  let lastFocus = null;

  function open() {
     detenerLectura(); // ✅ detiene lectura si estaba activa
    lastFocus = document.activeElement;

    overlay.hidden = false;
    modal.hidden = false;

    btnOpen.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    btnX.focus();
  }

  function close() {
    overlay.hidden = true;
    modal.hidden = true;

    btnOpen.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    lastFocus?.focus?.();
  }

  btnOpen.addEventListener("click", open);
  btnX.addEventListener("click", close);
  btnClose.addEventListener("click", close);
  overlay.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (modal.hidden) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  });
})();


let speechUtterance = null;

function leerContenido() {
  const main = document.querySelector("main");
  if (!main) return;

  // Detener lectura previa
  window.speechSynthesis.cancel();

  const texto = main.innerText.trim();
  if (!texto) return;

  speechUtterance = new SpeechSynthesisUtterance(texto);
  speechUtterance.lang = "es-MX";
  speechUtterance.rate = 0.95;
  speechUtterance.pitch = 1;

  window.speechSynthesis.speak(speechUtterance);
}

function detenerLectura() {
  window.speechSynthesis.cancel();
  speechUtterance = null;
}

function pausarLectura() {
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause();
  }
}

function reanudarLectura() {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}
/* =====================================================
   AUTO-ACTIVAR RESALTADO DE TAB AL USAR TECLADO
===================================================== */
(function () {
  let keyboardMode = false;

  function enableTabHighlight() {
    if (!document.body.classList.contains("resaltar-tab")) {
      document.body.classList.add("resaltar-tab");
      // opcional: announce("Resaltado de tabulación activado");
    }
  }

  function disableTabHighlight() {
    if (document.body.classList.contains("resaltar-tab")) {
      document.body.classList.remove("resaltar-tab");
      // opcional: announce("Resaltado de tabulación desactivado");
    }
  }

  // Si el usuario usa TAB, activamos resaltado automáticamente
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      keyboardMode = true;
      enableTabHighlight();
    }
  });

  // Si el usuario hace click con mouse, puedes decidir:
  // A) mantener el resaltado (recomendable en accesibilidad)
  // B) o apagarlo para que no “estorbe visualmente”
  document.addEventListener("mousedown", () => {
    keyboardMode = false;
    // Si quieres apagarlo con mouse, descomenta:
    // disableTabHighlight();
  });
})();

/* =====================================================
   ESTADO INICIAL BOTONES DE RESALTADO
===================================================== */  

(function () {
  const btnLinks = document.getElementById("btnResaltarEnlaces");
  if (!btnLinks) return;

  const activo = document.body.classList.contains("resaltar-enlaces");
  btnLinks.setAttribute("aria-pressed", String(activo));
})();


/* =====================================================
   CURSOR GRANDE (TOGGLE)
===================================================== */
function toggleCursorGrande(btn) {
  const activo = document.body.classList.toggle("cursor-grande");

  // Actualiza estado accesible
  btn.setAttribute("aria-pressed", String(activo));

  announce(activo ? "Cursor grande activado" : "Cursor normal restaurado");
}


(function () {
  const btn = document.getElementById("btnCursor");
  if (!btn) return;

  const activo = document.body.classList.contains("cursor-grande");
  btn.setAttribute("aria-pressed", String(activo));
})();
