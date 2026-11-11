/**
 * Protección de páginas privadas + datos del usuario + logout.
 * Incluir en cualquier página del "dashboard".
 */
(function () {
  const $ = (sel) => document.querySelector(sel);

  function fillUser(user) {
    const email = user.email || "—";
    const name = user.user_metadata?.full_name || "Usuario";
    const id = user.id || "—";

    document.querySelectorAll("[data-user-email]").forEach((el) => {
      el.textContent = email;
    });
    document.querySelectorAll("[data-user-name]").forEach((el) => {
      el.textContent = name;
    });
    document.querySelectorAll("[data-user-id]").forEach((el) => {
      el.textContent = id;
    });

    const avatar = $("#user-avatar");
    if (avatar) {
      avatar.textContent = (name || email).charAt(0).toUpperCase();
    }
  }

  async function requireSession() {
    if (window.__AUTH_CONFIG_MISSING__ || !window.supabaseClient) {
      window.location.href = "index.html";
      return null;
    }

    const { data, error } = await window.supabaseClient.auth.getSession();
    if (error || !data?.session) {
      window.location.href = "index.html";
      return null;
    }
    return data.session;
  }

  async function init() {
    const session = await requireSession();
    if (!session) return;

    fillUser(session.user);

    $("#btn-logout")?.addEventListener("click", async () => {
      await window.supabaseClient.auth.signOut();
      window.location.href = "index.html";
    });

    window.supabaseClient.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        window.location.href = "index.html";
      }
    });
  }

  init();
})();
