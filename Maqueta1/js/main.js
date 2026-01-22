


// ===================================================== T E M A  1 ===================================================== 

document.addEventListener("DOMContentLoaded", () => {
  /* ===== MODAL GUION DE VIDEO ===== */
  const btnGuion = document.getElementById("btnGuionVideo");
  const modalGuion = document.getElementById("modal-guion");
  const overlayGuion = document.getElementById("overlay-guion");
  const cerrarX = modalGuion?.querySelector(".modal-cerrar");

  let lastFocus = null;

  function openGuion() {
    if (!btnGuion || !modalGuion || !overlayGuion) return;
    lastFocus = document.activeElement;

    overlayGuion.hidden = false;
    modalGuion.hidden = false;
    btnGuion.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    cerrarX?.focus();
  }

  function closeGuion() {
    if (!btnGuion || !modalGuion || !overlayGuion) return;
    overlayGuion.hidden = true;
    modalGuion.hidden = true;
    btnGuion.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    lastFocus?.focus?.();
  }

  if (btnGuion && modalGuion && overlayGuion && cerrarX) {
    btnGuion.addEventListener("click", openGuion);
    cerrarX.addEventListener("click", closeGuion);
    overlayGuion.addEventListener("click", closeGuion);

    document.addEventListener("keydown", (e) => {
      if (modalGuion.hidden) return;
      if (e.key === "Escape") {
        e.preventDefault();
        closeGuion();
      }
    });
  }

  function renderAntecedentesMovil() {
  const contenedor = document.getElementById("antecedentes-plain");
  if (!contenedor) return;

  contenedor.innerHTML = "";

  antecedentes.forEach((item, index) => {
    const bloque = document.createElement("div");

    bloque.innerHTML = `
      <h3>Antecedente ${index + 1}</h3>
      <p>${item.texto}</p>
    `;

    contenedor.appendChild(bloque);
  });
}

});

// ===================================================== GUION DEL VIDEO  =====================================================
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-guion-video");
  const contenido = document.getElementById("guion-contenido");

  if (!btn || !contenido) return;

  btn.addEventListener("click", () => {
    const expanded = btn.getAttribute("aria-expanded") === "true";

    btn.setAttribute("aria-expanded", String(!expanded));
    contenido.hidden = expanded;

    btn.textContent = expanded
      ? "Mostrar guion del video"
      : "Ocultar guion del video";
  });
});


// ===================================================== CARRUSEL ANTECEDENTES   =====================================================

document.addEventListener("DOMContentLoaded", () => {
  // ===== Contenido (3 páginas) =====
  const paginas = [
    {
      html: `
        <p>
          La evolución de la neurociencia se remonta a los antiguos griegos que estaban fascinados por el cerebro.
          En el siglo cinco a. C., Alcmeón de Crotona, pionero de la disección, propuso que el cerebro era el asiento
          del pensamiento y las sensaciones. Por otro lado, Aristóteles creía que el centro del intelecto era el corazón.
          Más adelante, Galeno propuso que el cerebro actuaba sobre los músculos, el receptor de las sensaciones y conservaba la memoria.
          También, relacionó los ventrículos cerebrales con las cavidades del corazón estableciendo que las sensaciones y movimientos
          dependían del flujo de los humores, hacia o desde los ventrículos cerebrales, a través de los nervios.
        </p>
      `
    },
    {
      html: `
        <p>
          Durante el siglo dieciocho se planteó que el tejido nervioso desempeñaba una función glandular.
          Con base en la teoría de Galeno se estableció que los nervios eran el conducto que transportaba los fluidos
          secretados por el cerebro y la médula espinal hacia la periferia del organismo humano.
          El surgimiento de las máquinas hidráulicas contribuye para reforzar la teoría ventricular cerebral.
          Esta teoría expone que: “los líquidos expulsados desde los ventrículos bombean al organismo, por eso los músculos aumentan de tamaño durante el movimiento”.
        </p>
      `
    },
    {
      html: `
        <p>
          René Descartes (1596-1650) defendió la teoría mecanicista de la función cerebral para explicar la conducta de los animales.
          Pero para él esta teoría no explicaría la complejidad de la conducta humana, pues el hombre, a contrario que los animales,
          posee un intelecto y un alma dada por Dios. Por eso, Descartes creía que el cerebro controlaba la conducta humana en lo que esta tiene
          de animal y que las capacidades especiales del hombre residen fuera, en la mente (“l’esprit”).
        </p>
        <p><strong>Fuente:</strong> Castro, A. (2022).</p>
      `
    }
  ];

  // ===== Elementos =====
  const plain = document.getElementById("antecedentes-plain");
  const carousel = document.getElementById("antecedentes-carousel");
  const controles = document.getElementById("controles-antecedentes");

  const texto = document.getElementById("textoAntecedente");
  const pagActual = document.getElementById("pagActual");
  const pagTotal = document.getElementById("pagTotal");
  const btnAnt = document.getElementById("btnAnterior");
  const btnSig = document.getElementById("btnSiguiente");

  // Si falta algo crítico del DOM, no rompas el resto del sitio
  if (!plain || !carousel || !controles || !texto || !pagActual || !pagTotal || !btnAnt || !btnSig) return;

  let idx = 0;
  pagTotal.textContent = String(paginas.length);

  // ===== Render ESCRITORIO (carrusel) =====
  function renderCarousel() {
    texto.innerHTML = paginas[idx].html;
    pagActual.textContent = String(idx + 1);

    btnAnt.disabled = idx === 0;
    btnSig.disabled = idx === paginas.length - 1;

    btnAnt.setAttribute("aria-label", `Anterior. Página ${idx + 1} de ${paginas.length}`);
    btnSig.setAttribute("aria-label", `Siguiente. Página ${idx + 1} de ${paginas.length}`);
  }

  // ===== Render MÓVIL (texto plano completo) =====
  function renderPlain() {
    plain.innerHTML = paginas
      .map(
        (p, i) => `
        <article class="antecedente-item">
          <h3>Antecedente ${i + 1}</h3>
          ${p.html}
        </article>
      `
      )
      .join("");
  }

  // ===== Cambiar modo según ancho =====
  const mq = window.matchMedia("(max-width: 768px)");

  function applyMode() {
    if (mq.matches) {
      // Móvil: mostrar texto plano, ocultar carrusel + controles
      plain.hidden = false;
      carousel.hidden = true;
      controles.hidden = true;

      renderPlain();
    } else {
      // Escritorio: mostrar carrusel + controles, ocultar texto plano
      plain.hidden = true;
      carousel.hidden = false;
      controles.hidden = false;

      renderCarousel();
    }
  }

  // ===== Eventos del carrusel (solo afectan escritorio) =====
  btnAnt.addEventListener("click", () => {
    if (idx > 0) {
      idx--;
      renderCarousel();
    }
  });

  btnSig.addEventListener("click", () => {
    if (idx < paginas.length - 1) {
      idx++;
      renderCarousel();
    }
  });

  // Inicial + cambios de breakpoint
  applyMode();

  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", applyMode);
  } else {
    // Safari viejo
    mq.addListener(applyMode);
  }
});



// ===================================================== TEORIA NEURONAL  =====================================================

document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     MODALES (Siglo XIX / XX)
  ========================== */

  const overlay = document.getElementById("overlay-modal");
  let lastFocus = null;

  function getFocusable(container) {
    return container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }

  function openModal(modal, triggerBtn) {
    if (!modal) return;

    lastFocus = triggerBtn || document.activeElement;

    overlay.hidden = false;
    modal.hidden = false;

    // evita scroll del body
    document.body.style.overflow = "hidden";

    // focus al botón de cerrar
    const closeBtn = modal.querySelector(".modal-cerrar") || modal.querySelector(".btn-cerrar-modal");
    if (closeBtn) closeBtn.focus();

    // trap de foco simple
    modal.addEventListener("keydown", trapFocus);
    document.addEventListener("keydown", escClose);
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.hidden = true;
    overlay.hidden = true;

    document.body.style.overflow = "";

    modal.removeEventListener("keydown", trapFocus);
    document.removeEventListener("keydown", escClose);

    if (lastFocus) lastFocus.focus();
  }

  function escClose(e) {
    if (e.key !== "Escape") return;
    const openModalEl = document.querySelector(".modal:not([hidden])");
    if (openModalEl) closeModal(openModalEl);
  }

  function trapFocus(e) {
    if (e.key !== "Tab") return;

    const modal = e.currentTarget;
    const focusables = Array.from(getFocusable(modal));
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Abrir modal desde tarjetas
  document.querySelectorAll("[data-modal-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const selector = btn.getAttribute("data-modal-target");
      const modal = document.querySelector(selector);
      openModal(modal, btn);
    });
  });

  // Cerrar modal: overlay
  if (overlay) {
    overlay.addEventListener("click", () => {
      const openModalEl = document.querySelector(".modal:not([hidden])");
      if (openModalEl) closeModal(openModalEl);
    });
  }

  // Cerrar modal: botones internos
  document.querySelectorAll(".modal").forEach(modal => {
    const x = modal.querySelector(".modal-cerrar");
    const close = modal.querySelector(".btn-cerrar-modal");
    if (x) x.addEventListener("click", () => closeModal(modal));
    if (close) close.addEventListener("click", () => closeModal(modal));
  });


  /* =========================
     ACORDEÓN A/B/C/D
  ========================== */

  const accButtons = document.querySelectorAll(".acordeon-btn");

  accButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const panelId = btn.getAttribute("aria-controls");
      const panel = document.getElementById(panelId);
      const expanded = btn.getAttribute("aria-expanded") === "true";

      // (opcional) cerrar otros para que solo haya uno abierto
      accButtons.forEach(other => {
        if (other !== btn) {
          const otherPanel = document.getElementById(other.getAttribute("aria-controls"));
          other.setAttribute("aria-expanded", "false");
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const mq = window.matchMedia("(max-width: 768px)");
  const cont = document.getElementById("plasticidad-plain");
  if (!cont) return;

  // Extrae la info desde los botones del diagrama (fuente única de verdad)
  function getItemsFromButtons() {
    const buttons = document.querySelectorAll(".arbol-plasticidad button[data-modal-title]");
    return Array.from(buttons).map((btn) => {
      const title = (btn.getAttribute("data-modal-title") || "").trim();
      const html = (btn.getAttribute("data-modal-content") || "").trim();

      // Convertimos el HTML a texto limpio (sin tags)
      const tmp = document.createElement("div");
      tmp.innerHTML = html;

      const text = tmp.textContent
        .replace(/\s+/g, " ")
        .trim();

      // Intento de separar "título: descripción"
      // Normalmente el text queda como: "Plasticidad estructural Es la capacidad..."
      const desc = text.replace(title, "").trim();

      return { title, desc };
    }).filter(x => x.title && x.desc);
  }

  function renderMobilePlain() {
    const items = getItemsFromButtons();

    // Si por algo no encontró botones, no revientes la UI
    if (!items.length) {
      cont.innerHTML = `<p>No hay contenido disponible.</p>`;
      return;
    }

    cont.innerHTML = `
      <ul class="plasticidad-lista">
        ${items.map(i => `
          <li>
            <strong>${i.title}:</strong> ${i.desc}
          </li>
        `).join("")}
      </ul>
    `;
  }

  // Render inicial (solo si es móvil)
  if (mq.matches) renderMobilePlain();

  // Re-render si entra a modo móvil al redimensionar
  window.addEventListener("resize", () => {
    if (mq.matches && cont.innerHTML.trim() === "") {
      renderMobilePlain();
    }
  });
});


/* ===================================================== NEURO CIENCIA COGNITIVA 
===================================================== */

(function () {
  const modal = document.getElementById("modal-generico");
  const overlay = document.getElementById("overlay-generico");
  const btnCerrarX = modal?.querySelector(".modal-cerrar");
  const btnCerrar = modal?.querySelector(".btn-cerrar-modal");
  const titulo = document.getElementById("modalGenericoTitulo");
  const body = document.getElementById("modalGenericoBody");

  if (!modal || !overlay || !titulo || !body || !btnCerrarX || !btnCerrar) return;

  let lastFocus = null;

  function openModal(triggerBtn) {
    lastFocus = triggerBtn;

    const t = triggerBtn.getAttribute("data-modal-title") || "Información";
    const c = triggerBtn.getAttribute("data-modal-content") || "<p>Sin contenido.</p>";

    titulo.textContent = t;
    body.innerHTML = c;

    overlay.hidden = false;
    modal.hidden = false;

    // Mueve foco al botón cerrar
    btnCerrarX.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeModal() {
    modal.hidden = true;
    overlay.hidden = true;

    document.removeEventListener("keydown", onKeydown);

    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    lastFocus = null;
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeModal();
    }
  }

  // Delegación: cualquier botón con data-modal-title abre el modal
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-modal-title]");
    if (btn) openModal(btn);
  });

  btnCerrarX.addEventListener("click", closeModal);
  btnCerrar.addEventListener("click", closeModal);
  overlay.addEventListener("click", closeModal);
})();

// ===================================================== DESCARGA DE FUENTES  =====================================================

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btnFuentes");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const url = "../assets/docs/fuentes.pdf";

    // Descarga real usando un <a> creado por JS (pero sin meterlo en el HTML)
    const a = document.createElement("a");
    a.href = url;
    a.download = "fuentes.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });
});

// ===================================================== FIN DEL JS  =====================================================


// ===================================================== INFO EXPERTO  =====================================================

function isMobile() {
  return window.matchMedia("(max-width: 768px)").matches;
}

const btnOpen = document.getElementById("btnInfoExperto");
if (btnOpen) {
  btnOpen.addEventListener("click", (e) => {
    if (isMobile()) {
      e.preventDefault();
      return; // en móvil no abre modal
    }
  }, true);
}