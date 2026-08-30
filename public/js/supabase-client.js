// Cliente mínimo para hablar con Supabase desde el sitio estático,
// sin necesidad de instalar el SDK completo ni un paso de build.
//
// Estas dos constantes son públicas a propósito (la anon key no es secreta;
// la seguridad la da RLS, configurado ya en las tablas de Supabase).
const SUPABASE_URL = "https://wvckbobdqnmeazupbnmy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4SJlfq5wUs6j8FNBb0Dxkg_tVPrTbHp";

const REST_URL = `${SUPABASE_URL}/rest/v1`;

function headers() {
  return {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  };
}

/** Trae las noticias publicadas, más recientes primero. */
export async function obtenerNoticias(limite = 3) {
  const url = `${REST_URL}/noticias?select=*&publicado=eq.true&order=publicado_en.desc&limit=${limite}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error("No se pudieron cargar las noticias");
  return res.json();
}

/** Trae los próximos eventos del calendario escolar (desde hoy en adelante). */
export async function obtenerCalendario(limite = 5) {
  const hoy = new Date().toISOString().slice(0, 10);
  const url = `${REST_URL}/calendario_escolar?select=*&fecha_inicio=gte.${hoy}&order=fecha_inicio.asc&limit=${limite}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error("No se pudo cargar el calendario");
  return res.json();
}

/** Trae los documentos institucionales publicados (PEI, Manual de Convivencia, SIEE, etc). */
export async function obtenerDocumentos() {
  const url = `${REST_URL}/documentos_institucionales?select=*&publicado=eq.true&order=categoria.asc`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error("No se pudieron cargar los documentos");
  return res.json();
}

/** Trae el directorio visible (gobierno escolar, coordinaciones, etc). */
export async function obtenerDirectorio() {
  const url = `${REST_URL}/directorio?select=*&visible=eq.true&order=orden.asc`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new Error("No se pudo cargar el directorio");
  return res.json();
}

/**
 * Radica una solicitud de PQRSD. Devuelve el registro creado (incluye el
 * número de radicado generado automáticamente, ej. "ENS-2026-04821").
 */
export async function radicarPQRSD({ tipo, nombre_solicitante, correo, telefono, asunto, mensaje }) {
  const url = `${REST_URL}/pqrsd_solicitudes`;
  const res = await fetch(url, {
    method: "POST",
    headers: { ...headers(), Prefer: "return=representation" },
    body: JSON.stringify({ tipo, nombre_solicitante, correo, telefono, asunto, mensaje }),
  });
  if (!res.ok) throw new Error("No se pudo radicar la solicitud");
  const data = await res.json();
  return data[0];
}
