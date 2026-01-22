/* Autoevaluación (solo esta página)
   - Un intento: revisa, marca, desactiva.
   - Modal accesible con resumen.
   - Descarga PDF con respuestas seleccionadas.
   - Menú flotante bajo el botón Menú.
*/

(function () {
  "use strict";

  const ANSWERS = {
    q1: "b",
    q2: "c",
    q3: "b",
    q4: "b",
    q5: "c",
  };

  const QUESTIONS = [
    {
      id: "q1",
      text: "1. ¿Qué se entiende por plasticidad cerebral?",
    },
    {
      id: "q2",
      text: "2. ¿Cuál es el papel principal de la plasticidad cerebral en el aprendizaje?",
    },
    {
      id: "q3",
      text: "3. Desde la perspectiva de las neurociencias, ¿qué factor favorece más el aprendizaje significativo?",
    },
    {
      id: "q4",
      text: "4. En niños y jóvenes, la plasticidad cerebral se caracteriza principalmente por:",
    },
    {
      id: "q5",
      text: "5. ¿Cómo puede la educación aprovechar los aportes de las neurociencias?",
    },
  ];

  function qs(sel, root = document) {
    return root.querySelector(sel);
  }

  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel));
  }

  function normalizeOptionText(optionEl) {
    return optionEl ? optionEl.textContent.trim() : "";
  }


  function setupAutoeval() {
    const form = qs("#formAutoeval");
    const btnRevisar = qs("#btnRevisar");
    const btnPDF = qs("#btnPDF");

    const overlay = qs("#overlay-revision");
    const modal = qs("#modal-revision");
    const modalBody = qs("#modal-revision-body");
    const modalCloseX = qs("#modal-revision .modal-cerrar");
    const modalCloseBtn = qs("#modal-revision .btn-cerrar");

   if (!form || !btnRevisar || !btnPDF || !overlay || !modal || !modalBody) {
  console.error("Autoevaluación: faltan elementos del DOM", {
    form, btnRevisar, btnPDF, overlay, modal, modalBody
  });
  return;
}
    let reviewed = false;
    let lastFocus = null;

    const selects = qsa("select", form);

    function allAnswered() {
      return selects.every((s) => s.value && s.value !== "");
    }

    function updateRevisarState() {
      if (reviewed) return;
      btnRevisar.disabled = !allAnswered();
    }

    selects.forEach((s) => {
  s.addEventListener("change", updateRevisarState);
  s.addEventListener("input", updateRevisarState); // extra: más robusto
});


    function openModal() {
      lastFocus = document.activeElement;
      overlay.hidden = false;
      modal.hidden = false;

      // foco inicial en cerrar
      (modalCloseX || modal).focus();
      document.body.style.overflow = "hidden";
    }

    function closeModal() {
      overlay.hidden = true;
      modal.hidden = true;
      document.body.style.overflow = "";
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    function trapFocus(e) {
      if (modal.hidden) return;
      if (e.key !== "Tab") return;
      const focusables = qsa(
        "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        modal
      ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);

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

    function renderModalSummary(results) {
      // results: [{q, options:[...], selectedValue, correctValue}]
      const wrap = document.createElement("div");
      wrap.className = "revision-list";

      results.forEach((r) => {
        const item = document.createElement("div");
        item.className = "revision-item";

        const title = document.createElement("p");
        title.className = "revision-q";
        title.textContent = r.q;
        item.appendChild(title);

        const ul = document.createElement("ul");
        ul.className = "revision-options";

        r.options.forEach((opt) => {
          const li = document.createElement("li");
          li.textContent = opt.text;

          if (opt.value === r.correctValue) {
            li.classList.add("opt-correcta");
          }
          if (opt.value === r.selectedValue && r.selectedValue !== r.correctValue) {
            li.classList.add("opt-seleccion-incorrecta");
          }
          if (opt.value === r.selectedValue && r.selectedValue === r.correctValue) {
            li.classList.add("opt-seleccion-correcta");
          }

          ul.appendChild(li);
        });

        item.appendChild(ul);
        wrap.appendChild(item);
      });

      modalBody.innerHTML = "";
      modalBody.appendChild(wrap);
    }

    function grade() {
      const results = [];
      let correctCount = 0;

      QUESTIONS.forEach((q) => {
        const sel = qs(`#${q.id}`, form);
        const fs = sel ? sel.closest("fieldset") : null;
        const fb = fs ? qs(".feedback", fs) : null;

        const selectedValue = sel ? sel.value : "";
        const correctValue = ANSWERS[q.id];
        const isCorrect = selectedValue === correctValue;

        if (isCorrect) correctCount += 1;

        // marca visual
        if (fs) {
          fs.classList.remove("is-correct", "is-incorrect");
          fs.classList.add(isCorrect ? "is-correct" : "is-incorrect");
        }
        if (fb) {
          fb.textContent = isCorrect ? "Correcta" : "Incorrecta";
        }

        // arma resumen para modal
        const options = sel
          ? qsa("option", sel)
              .filter((o) => o.value) // sin placeholder
              .map((o) => ({ value: o.value, text: normalizeOptionText(o) }))
          : [];

        results.push({
          q: q.text,
          options,
          selectedValue,
          correctValue,
        });
      });

      return { results, correctCount };
    }

    function lockAttempt() {
      reviewed = true;
      btnRevisar.disabled = true;
      selects.forEach((s) => {
        s.disabled = true;
      });
      btnPDF.disabled = false;
    }

    function generatePDF(filename, results, correctCount) {
      const jspdf = window.jspdf;
      if (!jspdf || !jspdf.jsPDF) {
        alert("No se pudo generar el PDF porque jsPDF no está cargado.");
        return;
      }

      const doc = new jspdf.jsPDF({ unit: "pt", format: "a4" });
      const margin = 48;
      let y = margin;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(
            "Autoevaluación\nNeurociencia Aplicada a la Educación de Personas con Discapacidad\n",
            margin,
            y
            );
        y += 22;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`\nResultados: ${correctCount} / ${results.length} correctas \n`, margin, y);
      y += 18;

      results.forEach((r, idx) => {
        const chosen = r.options.find((o) => o.value === r.selectedValue);
        const correct = r.options.find((o) => o.value === r.correctValue);
        const isCorrect = r.selectedValue === r.correctValue;

        const qLine = `\n${idx + 1}. ${r.q.replace(/^\d+\.\s*/, "")}`;
        const ansLine = `Tu respuesta: ${chosen ? chosen.text : "(sin respuesta)"}`;
        const corLine = `Correcta: ${correct ? correct.text : ""}`;

        const block = [qLine, ansLine, corLine, `Resultado: ${isCorrect ? "Correcta" : "Incorrecta"}`];
        block.forEach((line) => {
          const lines = doc.splitTextToSize(line, 510);
          lines.forEach((l) => {
            if (y > 760) {
              doc.addPage();
              y = margin;
            }
            doc.text(l, margin, y);
            y += 14;
          });
        });
        y += 10;
      });

      doc.save(filename);
    }

    btnRevisar.addEventListener("click", () => {
      if (reviewed) return;
      if (!allAnswered()) {
        btnRevisar.disabled = true;
        return;
      }

      const { results, correctCount } = grade();
      renderModalSummary(results);
      lockAttempt();
      openModal();

      // guarda en dataset para PDF
      form.dataset.correctCount = String(correctCount);
      form.dataset.results = JSON.stringify(results);
    });

    btnPDF.addEventListener("click", () => {
      if (!reviewed) return;
      const results = JSON.parse(form.dataset.results || "[]");
      const correctCount = parseInt(form.dataset.correctCount || "0", 10);

      // Nombre sugerido (
      generatePDF("Autoevaluacion1.pdf", results, correctCount);
    });

    // Modal handlers
    overlay.addEventListener("click", closeModal);
    if (modalCloseX) modalCloseX.addEventListener("click", closeModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
    document.addEventListener("keydown", trapFocus);

    // Estado inicial
    updateRevisarState();
  }

  document.addEventListener("DOMContentLoaded", () => {
   // setupMenu();
    setupAutoeval();
  });
})();


