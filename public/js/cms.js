// Carga los bloques de texto editables (tabla contenido_sitio en Supabase)
// y los aplica a cualquier elemento marcado con data-cms="clave" en la página.
// Si Supabase no responde, la página se queda con el texto que ya tiene
// escrito en el HTML (nunca se rompe por falta de conexión).

const SUPABASE_URL = "https://wvckbobdqnmeazupbnmy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4SJlfq5wUs6j8FNBb0Dxkg_tVPrTbHp";

async function aplicarContenidoEditable() {
  const elementos = document.querySelectorAll("[data-cms]");
  if (!elementos.length) return;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contenido_sitio?select=clave,valor`, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    if (!res.ok) return;
    const filas = await res.json();
    const mapa = Object.fromEntries(filas.map((f) => [f.clave, f.valor]));

    elementos.forEach((el) => {
      const clave = el.getAttribute("data-cms");
      if (mapa[clave]) el.textContent = mapa[clave];
    });
  } catch (e) {
    // Silencioso a propósito: el sitio sigue funcionando con el texto por defecto.
    console.warn("No se pudo cargar el contenido editable:", e);
  }
}

document.addEventListener("DOMContentLoaded", aplicarContenidoEditable);
