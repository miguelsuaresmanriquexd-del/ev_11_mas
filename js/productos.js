/**
 * Lista de productos desde la tabla "producto" de Supabase.
 * Requiere: config.js + supabase-client.js (y guard.js para proteger la página).
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  const tbody = $("#productos-body");
  const buscador = $("#buscador");
  const msgEl = $("#productos-message");

  const numero = new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  let productos = [];

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text ?? "";
    return div.innerHTML;
  }

  function showMessage(text) {
    msgEl.textContent = text;
    msgEl.hidden = !text;
  }

  function render() {
    const texto = buscador.value.trim().toLowerCase();
    const lista = productos.filter((p) =>
      p.nombreprod.toLowerCase().includes(texto)
    );

    if (!lista.length) {
      tbody.innerHTML =
        '<tr><td colspan="4" class="empty">No hay productos que coincidan.</td></tr>';
      return;
    }

    tbody.innerHTML = lista
      .map(
        (p) => `
        <tr>
          <td>${p.idproducto}</td>
          <td><strong>${escapeHtml(p.nombreprod)}</strong></td>
          <td class="num">${numero.format(p.precioproduc)}</td>
          <td class="num">
            ${numero.format(p.stock)}
            ${p.stock <= 5 ? '<span class="badge badge--alto">Poco stock</span>' : ""}
          </td>
        </tr>`
      )
      .join("");
  }

  async function cargar() {
    if (window.__AUTH_CONFIG_MISSING__ || !window.supabaseClient) return;

    const { data, error } = await window.supabaseClient
      .from("producto")
      .select("idproducto, nombreprod, precioproduc, stock")
      .order("idproducto");

    if (error) {
      tbody.innerHTML = "";
      showMessage("No se pudieron cargar los productos: " + error.message);
      return;
    }

    productos = data || [];
    render();
  }

  buscador.addEventListener("input", render);

  cargar();
})();