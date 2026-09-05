/**
 * Tus Desvaríos - Cliente de Autenticación, Perfil y Medallas con Supabase
 * Funciona de forma autónoma en todas las páginas HTML independientes y Next.js.
 */

const SUPABASE_URL = 'https://zqhuqqufvvftkfeoqfqs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpxaHVxcXVmdnZmdGtmZW9xZnFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDUzNDcsImV4cCI6MjEwNDEyMTM0N30.3xG3KAqZLFf66JeCbka4AXricitIMM-pLA2tKungEuA';

// Avatares temáticos oficiales
window.DESVARIOS_AVATARS = [
  { id: 'arcade-alien', name: 'Alien Arcade', icon: '👾', desc: 'Piloto retro de los 80s' },
  { id: 'arcane-book', name: 'Sabio Arcano', icon: '📜', desc: 'Devorador de códices' },
  { id: 'quantum-brain', name: 'Mente Cuántica', icon: '🧠', desc: 'Estratega de acertijos' },
  { id: 'chaos-jester', name: 'Bufón del Caos', icon: '🎭', desc: 'Maestro de la sátira' },
  { id: 'lighthouse-keeper', name: 'El Guardián', icon: '🕯️', desc: 'Vigilante del faro' },
  { id: 'cyber-cyborg', name: 'Cyborg 2084', icon: '🤖', desc: 'Hacker cyberpunk' },
  { id: 'cosmic-portal', name: 'Viajero Cósmico', icon: '🌌', desc: 'Explorador dimensional' },
  { id: 'mystic-cat', name: 'Gato Espectral', icon: '🐱', desc: 'Mascota mística' }
];

window.getAvatarMeta = function(avatarId) {
  return window.DESVARIOS_AVATARS.find(a => a.id === avatarId) || window.DESVARIOS_AVATARS[0];
};

// Catálogo Oficial de Medallas y Logros (20 Medallas Temáticas)
window.DESVARIOS_MEDALS = [
  // --- COMUNIDAD & PERFIL ---
  {
    id: 'primer-paso',
    title: 'Iniciado del Desvarío',
    desc: 'Registra tu cuenta y forma parte oficial de la comunidad de Tus Desvaríos.',
    icon: '🌟',
    points: 20,
    category: 'Comunidad'
  },
  {
    id: 'comunidad-voz',
    title: 'Voz del Desvarío',
    desc: 'Participa en el foro de la comunidad creando un tema o respondiendo a otros desvariados.',
    icon: '📢',
    points: 30,
    category: 'Comunidad'
  },
  {
    id: 'avatar-coleccionista',
    title: 'Camaleón Digital',
    desc: 'Personaliza tu ficha de perfil eligiendo un nuevo avatar temático oficial.',
    icon: '🎭',
    points: 20,
    category: 'Perfil'
  },
  {
    id: 'perfil-bio',
    title: 'Escriba del Alma',
    desc: 'Redacta y guarda tu biografía personal en tu ficha de desvariado.',
    icon: '✍️',
    points: 20,
    category: 'Perfil'
  },

  // --- HISTORIAS INTERACTIVAS ---
  {
    id: 'faro-guardian',
    title: 'El Guardián del Faro',
    desc: 'Descubre el enigma de la última guardia en la niebla marina de San Telmo.',
    icon: '🕯️',
    points: 50,
    category: 'Historias'
  },
  {
    id: 'abadia-codice',
    title: 'Códice de la Abadía',
    desc: 'Sobrevive a las intrigas del scriptorium medieval en Santa Eulalia.',
    icon: '📜',
    points: 50,
    category: 'Historias'
  },
  {
    id: 'historias-multiverso',
    title: 'Viajero de Mil Destinos',
    desc: 'Explora las ramas del destino y descubre al menos 3 finales diferentes en las historias.',
    icon: '🌀',
    points: 40,
    category: 'Historias'
  },

  // --- RELATOS LITERARIOS ---
  {
    id: 'literarios-lector',
    title: 'Primer Lector',
    desc: 'Lee y completa tu primer relato literario de la colección.',
    icon: '📖',
    points: 20,
    category: 'Relatos'
  },
  {
    id: 'literarios-devorador',
    title: 'Devorador de Ficción',
    desc: 'Lee y completa la colección completa de relatos literarios de la web.',
    icon: '📚',
    points: 50,
    category: 'Relatos'
  },

  // --- ARCADE & RETRO ---
  {
    id: 'invasores-defensor',
    title: 'Defensor Cósmico',
    desc: 'Repele oleadas alienígenas y supera 500 puntos en Invasores del Espacio.',
    icon: '👾',
    points: 40,
    category: 'Arcade'
  },
  {
    id: 'snake-ninja',
    title: 'Cyber Ninja 2084',
    desc: 'Conquista el ciberespacio y supera 60 puntos en Snake Cyberpunk.',
    icon: '🐍',
    points: 40,
    category: 'Arcade'
  },
  {
    id: 'ahorcado-sabio',
    title: 'Maestro del Patíbulo',
    desc: 'Descifra la palabra oculta en El Ahorcado y burla a tu destino.',
    icon: '🪢',
    points: 30,
    category: 'Arcade'
  },
  {
    id: 'buscaminas-mente',
    title: 'Mente Imperturbable',
    desc: 'Deduce todas las minas y despeja el tablero sin un solo fallo de lógica.',
    icon: '💣',
    points: 30,
    category: 'Arcade'
  },
  {
    id: 'rompebloques-as',
    title: 'Demoledor Cuántico',
    desc: 'Rompe los ladrillos de neón y supera el nivel en Rompebloques Neón.',
    icon: '🧱',
    points: 30,
    category: 'Arcade'
  },
  {
    id: 'tresenraya-estratega',
    title: 'Mente de Silicio',
    desc: 'Empata o vence a la IA Minimax invencible en el Tres en Raya Imposible.',
    icon: '🤖',
    points: 35,
    category: 'Arcade'
  },

  // --- DESVARÍOS MENTALES & TESTS ---
  {
    id: 'mental-arquetipo',
    title: 'Espejo del Alma',
    desc: 'Completa un test de personalidad profunda y revela tu arquetipo interior.',
    icon: '🪞',
    points: 30,
    category: 'Mente'
  },
  {
    id: 'mental-logica',
    title: 'Cerebro de Acero',
    desc: 'Resuelve los acertijos y enigmas de deducción lógica en la Cámara de los Sabios.',
    icon: '🧠',
    points: 40,
    category: 'Mente'
  },
  {
    id: 'mental-filosofo',
    title: 'Dilema Resuelto',
    desc: 'Afronta los dilemas éticos y decisiones extremas de la filosofía oscura.',
    icon: '⚖️',
    points: 30,
    category: 'Mente'
  },

  // --- HUMOR & CAOS / POR LA RED ---
  {
    id: 'humor-maestro',
    title: 'Maestro del Caos',
    desc: 'Construye al menos 5 pretextos infalibles y coartadas en Humor & Caos.',
    icon: '🃏',
    points: 25,
    category: 'Humor'
  },
  {
    id: 'red-explorador',
    title: 'Navegante del Éter',
    desc: 'Explora y descubre los artefactos insólitos del Bazar por la Red.',
    icon: '🌐',
    points: 20,
    category: 'Red'
  }
];

window.getMedalMeta = function(medalId) {
  return window.DESVARIOS_MEDALS.find(m => m.id === medalId) || null;
};

// Rangos de nivel según puntos
window.getRankInfo = function(points = 0) {
  const p = Number(points) || 0;
  if (p >= 500) return { nivel: 5, rank: 'Soberano Cósmico', icon: '🌌' };
  if (p >= 350) return { nivel: 4, rank: 'Maestro de Enigmas', icon: '🔮' };
  if (p >= 200) return { nivel: 3, rank: 'Alquimista del Caos', icon: '⚡' };
  if (p >= 100) return { nivel: 2, rank: 'Explorador de Sombras', icon: '🕯️' };
  return { nivel: 1, rank: 'Desvariado Novato', icon: '✨' };
};

// Inicialización del cliente Supabase
let supabaseClient = null;
function getSupabase() {
  if (!supabaseClient && window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

window.DesvariosAuth = {
  getClient: getSupabase,

  // Comprobar si un username está disponible
  async isUsernameAvailable(username) {
    const sb = getSupabase();
    if (!sb) return { error: 'Supabase no inicializado' };

    const clean = username.trim().toLowerCase();
    if (clean.length < 3 || clean.length > 20) {
      return { available: false, error: 'El nombre debe tener entre 3 y 20 caracteres' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(clean)) {
      return { available: false, error: 'Solo se permiten letras, números y guiones bajos' };
    }

    try {
      const { data, error } = await sb
        .from('perfiles')
        .select('username')
        .ilike('username', clean)
        .maybeSingle();

      if (error) throw error;
      return { available: !data };
    } catch (e) {
      console.error('Error comprobando username:', e);
      return { available: false, error: e.message };
    }
  },

  // Registrar usuario
  async register({ email, password, username, avatarId = 'arcade-alien' }) {
    const sb = getSupabase();
    if (!sb) throw new Error('Cliente Supabase no disponible');

    const check = await this.isUsernameAvailable(username);
    if (!check.available) {
      throw new Error(check.error || 'El nombre de usuario ya está ocupado');
    }

    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username.trim(),
          avatar_id: avatarId
        },
        emailRedirectTo: window.location.origin + '/perfil.html'
      }
    });

    if (error) throw error;
    return data;
  },

  // Iniciar sesión
  async login({ email, password }) {
    const sb = getSupabase();
    if (!sb) throw new Error('Cliente Supabase no disponible');

    const { data, error } = await sb.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    try {
      await this.getCurrentProfile();
      await this.syncGuestMedals();
      await this.unlockMedal('primer-paso');
      this.syncHeader();
    } catch(e) {
      console.warn('Post login err:', e);
    }

    return data;
  },

  // Cerrar sesión
  async logout() {
    try {
      localStorage.removeItem('desvarios_user_cache');
      localStorage.removeItem('desvarios_unlocked_medals');
    } catch(e){}
    const sb = getSupabase();
    if (sb) {
      try { await sb.auth.signOut(); } catch(e){}
    }
    window.location.href = 'index.html';
  },

  // Enviar correo de recuperación
  async resetPassword(email) {
    const sb = getSupabase();
    if (!sb) throw new Error('Cliente Supabase no disponible');
    const { data, error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/perfil.html'
    });
    if (error) throw error;
    return data;
  },

  // Obtener sesión actual
  async getSession() {
    const sb = getSupabase();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    return data.session;
  },

  // Obtener perfil completo del usuario actual
  async getCurrentProfile() {
    const sb = getSupabase();
    if (!sb) return null;

    const { data: sessionData } = await sb.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) {
      try { localStorage.removeItem('desvarios_user_cache'); } catch(e){}
      return null;
    }

    const { data: profile, error } = await sb
      .from('perfiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Error obteniendo perfil:', error);
      return null;
    }

    const res = {
      user,
      profile: profile || {
        id: user.id,
        username: user.user_metadata?.username || 'desvariado',
        avatar_id: user.user_metadata?.avatar_id || 'arcade-alien',
        bio: 'Buscador de desvaríos cósmicos.',
        puntos: 0,
        nivel: 1
      }
    };

    try {
      localStorage.setItem('desvarios_user_cache', JSON.stringify({
        username: res.profile.username,
        avatar_id: res.profile.avatar_id,
        puntos: res.profile.puntos || 0,
        nivel: res.profile.nivel || 1
      }));
    } catch(e){}

    return res;
  },

  // Actualizar perfil (avatar o bio)
  async updateProfile({ avatarId, bio }) {
    const sb = getSupabase();
    if (!sb) throw new Error('Cliente Supabase no disponible');

    const { data: sessionData } = await sb.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) throw new Error('No hay sesión iniciada');

    const updates = {
      updated_at: new Date().toISOString()
    };
    if (avatarId !== undefined) updates.avatar_id = avatarId;
    if (bio !== undefined) updates.bio = bio.trim();

    const { data, error } = await sb
      .from('perfiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;

    try {
      const cached = JSON.parse(localStorage.getItem('desvarios_user_cache') || '{}');
      if (avatarId) cached.avatar_id = avatarId;
      localStorage.setItem('desvarios_user_cache', JSON.stringify(cached));
      this.syncHeader();
    } catch(e){}

    return data;
  },

  // DESBLOQUEAR MEDALLA / LOGRO
  async unlockMedal(medalId) {
    const medal = window.getMedalMeta(medalId);
    if (!medal) return { error: 'Medalla no encontrada' };

    let unlockedCache = [];
    try {
      unlockedCache = JSON.parse(localStorage.getItem('desvarios_unlocked_medals') || '[]');
    } catch(e){}

    if (unlockedCache.includes(medalId)) {
      return { ok: true, yaDesbloqueado: true };
    }

    const sb = getSupabase();
    let res = null;
    let isNew = true;

    if (sb) {
      try {
        const { data: sessionData } = await sb.auth.getSession();
        if (sessionData?.session?.user) {
          const { data, error } = await sb.rpc('desbloquear_logro', {
            p_logro_id: medalId,
            p_puntos: medal.points
          });
          if (error) throw error;
          res = data;
          if (res && res.nuevo === false) {
            isNew = false;
          }
        }
      } catch (err) {
        console.warn('Error llamando rpc desbloquear_logro:', err);
      }
    }

    // Registrar en cache local
    if (!unlockedCache.includes(medalId)) {
      unlockedCache.push(medalId);
      try { localStorage.setItem('desvarios_unlocked_medals', JSON.stringify(unlockedCache)); } catch(e){}
    }

    // Si no hay sesión o falló la nube, guardar en guest_medals para sincronizar después
    try {
      const session = await this.getSession();
      if (!session) {
        const guestMedals = JSON.parse(localStorage.getItem('desvarios_guest_medals') || '[]');
        if (!guestMedals.includes(medalId)) {
          guestMedals.push(medalId);
          localStorage.setItem('desvarios_guest_medals', JSON.stringify(guestMedals));
        }
      }
    } catch(e){}

    // Actualizar puntos y nivel en desvarios_user_cache
    if (res && res.ok && res.nuevo) {
      try {
        const userCache = JSON.parse(localStorage.getItem('desvarios_user_cache') || '{}');
        userCache.puntos = res.puntos_totales;
        userCache.nivel = res.nivel;
        localStorage.setItem('desvarios_user_cache', JSON.stringify(userCache));
      } catch(e) {}
    }

    // Mostrar notificación visual solo si es nueva
    if (isNew) {
      this.showMedalToast(medal);
    }

    return res || { ok: true, nuevo: isNew, logro_id: medalId };
  },

  // Obtener la lista de logros conseguidos por el usuario
  async getUserMedals() {
    const sb = getSupabase();
    if (!sb) {
      return this._getLocalMedals();
    }

    try {
      const { data: sessionData } = await sb.auth.getSession();
      const user = sessionData?.session?.user;
      if (!user) {
        return this._getLocalMedals();
      }

      const { data, error } = await sb
        .from('logros_usuario')
        .select('logro_id, puntos, desbloqueado_en')
        .eq('user_id', user.id);

      if (error) throw error;

      const ids = (data || []).map(r => r.logro_id);
      try { localStorage.setItem('desvarios_unlocked_medals', JSON.stringify(ids)); } catch(e){}
      return data || [];
    } catch (e) {
      console.warn('Error obteniendo logros de usuario:', e);
      return this._getLocalMedals();
    }
  },

  _getLocalMedals() {
    try {
      const ids = JSON.parse(localStorage.getItem('desvarios_unlocked_medals') || '[]');
      return ids.map(id => {
        const m = window.getMedalMeta(id);
        return {
          logro_id: id,
          puntos: m ? m.points : 0,
          desbloqueado_en: new Date().toISOString()
        };
      });
    } catch(e) {
      return [];
    }
  },

  // Sincronizar logros conseguidos como invitado al iniciar sesión
  async syncGuestMedals() {
    try {
      const raw = localStorage.getItem('desvarios_guest_medals');
      if (!raw) return;
      const guest = JSON.parse(raw);
      if (!Array.isArray(guest) || guest.length === 0) return;

      const sb = getSupabase();
      if (!sb) return;

      const { data: sessionData } = await sb.auth.getSession();
      if (!sessionData?.session?.user) return;

      for (const medalId of guest) {
        const medal = window.getMedalMeta(medalId);
        if (medal) {
          try {
            await sb.rpc('desbloquear_logro', {
              p_logro_id: medalId,
              p_puntos: medal.points
            });
          } catch(e){}
        }
      }

      localStorage.removeItem('desvarios_guest_medals');
      await this.getCurrentProfile();
      this.syncHeader();
    } catch(e) {
      console.warn('Error sincronizando logros de invitado:', e);
    }
  },

  // -------------------------------------------------------------
  // MÉTODOS DEL FORO DE LA COMUNIDAD
  // -------------------------------------------------------------

  // Obtener todas las categorías del foro
  async getForumCategories() {
    const sb = getSupabase();
    if (!sb) return [];

    try {
      const { data, error } = await sb
        .from('foro_categorias')
        .select('*')
        .order('orden', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch(e) {
      console.error('Error obteniendo categorías:', e);
      return [];
    }
  },

  // Obtener lista de hilos/temas (filtrado opcional por categoría)
  async getForumThreads(categoriaId = null) {
    const sb = getSupabase();
    if (!sb) return [];

    try {
      let query = sb
        .from('foro_temas')
        .select(`
          id,
          categoria_id,
          titulo,
          contenido,
          fijado,
          created_at,
          user_id,
          autor:perfiles (
            username,
            avatar_id,
            nivel,
            puntos
          ),
          respuestas:foro_mensajes(count)
        `)
        .order('fijado', { ascending: false })
        .order('created_at', { ascending: false });

      if (categoriaId && categoriaId !== 'all') {
        query = query.eq('categoria_id', categoriaId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } catch(e) {
      console.error('Error obteniendo temas del foro:', e);
      return [];
    }
  },

  // Obtener un tema específico con todas sus respuestas y autores
  async getForumThread(threadId) {
    const sb = getSupabase();
    if (!sb) return null;

    try {
      const { data: tema, error: errorTema } = await sb
        .from('foro_temas')
        .select(`
          id,
          categoria_id,
          titulo,
          contenido,
          fijado,
          created_at,
          user_id,
          categoria:foro_categorias(id, nombre, icono),
          autor:perfiles(username, avatar_id, nivel, puntos)
        `)
        .eq('id', threadId)
        .single();

      if (errorTema) throw errorTema;

      const { data: mensajes, error: errorMsg } = await sb
        .from('foro_mensajes')
        .select(`
          id,
          contenido,
          created_at,
          user_id,
          autor:perfiles(username, avatar_id, nivel, puntos)
        `)
        .eq('tema_id', threadId)
        .order('created_at', { ascending: true });

      if (errorMsg) throw errorMsg;

      return { tema, mensajes: mensajes || [] };
    } catch(e) {
      console.error('Error obteniendo detalle de tema:', e);
      return null;
    }
  },

  // Crear un nuevo tema (requiere autenticación)
  async createForumThread({ categoriaId, titulo, contenido }) {
    const sb = getSupabase();
    if (!sb) throw new Error('Cliente Supabase no disponible');

    const { data: sessionData } = await sb.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) throw new Error('Debes iniciar sesión para crear un tema');

    const cleanTitulo = (titulo || '').trim();
    const cleanContenido = (contenido || '').trim();

    if (cleanTitulo.length < 5 || cleanTitulo.length > 120) {
      throw new Error('El título debe tener entre 5 y 120 caracteres');
    }
    if (cleanContenido.length < 10) {
      throw new Error('El contenido debe tener al menos 10 caracteres');
    }

    const { data, error } = await sb
      .from('foro_temas')
      .insert({
        categoria_id: categoriaId,
        user_id: user.id,
        titulo: cleanTitulo,
        contenido: cleanContenido
      })
      .select()
      .single();

    if (error) throw error;

    // Desbloquear medalla de comunidad
    try {
      await this.unlockMedal('comunidad-voz');
    } catch(e){}

    return data;
  },

  // Publicar una respuesta en un tema (requiere autenticación)
  async createForumReply({ temaId, contenido }) {
    const sb = getSupabase();
    if (!sb) throw new Error('Cliente Supabase no disponible');

    const { data: sessionData } = await sb.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user) throw new Error('Debes iniciar sesión para responder');

    const cleanContenido = (contenido || '').trim();
    if (cleanContenido.length < 2) {
      throw new Error('El mensaje es demasiado corto');
    }

    const { data, error } = await sb
      .from('foro_mensajes')
      .insert({
        tema_id: temaId,
        user_id: user.id,
        contenido: cleanContenido
      })
      .select()
      .single();

    if (error) throw error;

    // Desbloquear medalla de comunidad
    try {
      await this.unlockMedal('comunidad-voz');
    } catch(e){}

    return data;
  },

  // Eliminar un tema (para autor o moderadores)
  async deleteForumThread(threadId) {
    const sb = getSupabase();
    if (!sb) throw new Error('Cliente Supabase no disponible');

    const { error } = await sb
      .from('foro_temas')
      .delete()
      .eq('id', threadId);

    if (error) throw error;
    return true;
  },

  // Fijar o desfijar un tema (moderadores/admin)
  async togglePinForumThread(threadId, fijado) {
    const sb = getSupabase();
    if (!sb) throw new Error('Cliente Supabase no disponible');

    const { error } = await sb
      .from('foro_temas')
      .update({ fijado })
      .eq('id', threadId);

    if (error) throw error;
    return true;
  },

  // Eliminar una respuesta (para autor o moderadores)
  async deleteForumReply(replyId) {
    const sb = getSupabase();
    if (!sb) throw new Error('Cliente Supabase no disponible');

    const { error } = await sb
      .from('foro_mensajes')
      .delete()
      .eq('id', replyId);

    if (error) throw error;
    return true;
  },

  // Notificación flotante (Toast)
  showMedalToast(medal) {
    if (typeof document === 'undefined' || !medal) return;

    let container = document.getElementById('desvarios-medal-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'desvarios-medal-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.style.cssText = `
      pointer-events: auto;
      background: linear-gradient(135deg, rgba(26, 16, 44, 0.96) 0%, rgba(15, 23, 42, 0.96) 100%);
      border: 2px solid #a855f7;
      box-shadow: 0 0 25px rgba(168, 85, 247, 0.5), 0 8px 32px rgba(0, 0, 0, 0.8);
      border-radius: 16px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      color: #fff;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      max-width: 380px;
      transform: translateY(100px) scale(0.9);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    toast.innerHTML = `
      <div style="
        font-size: 2.2rem;
        background: rgba(168, 85, 247, 0.2);
        width: 52px;
        height: 52px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        border: 1px solid rgba(168, 85, 247, 0.4);
        flex-shrink: 0;
      ">${medal.icon}</div>
      <div style="flex: 1; min-width: 0;">
        <div style="font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #c4b5fd;">
          🎉 ¡Logro Desbloqueado!
        </div>
        <div style="font-size: 1.05rem; font-weight: 700; color: #fff; margin: 2px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${medal.title}
        </div>
        <div style="font-size: 0.8rem; color: #94a3b8; line-height: 1.2;">
          +${medal.points} Pts de Desvarío
        </div>
      </div>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0) scale(1)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateY(30px) scale(0.95)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 400);
    }, 4500);
  },

  // Sincronizar el botón de usuario en la cabecera
  syncHeader() {
    try {
      const raw = localStorage.getItem('desvarios_user_cache');
      const btn = document.getElementById('header-user-btn');
      const nameEl = document.getElementById('header-user-name');
      const iconEl = document.getElementById('header-user-icon');
      if (!btn || !nameEl) return;

      if (raw) {
        const u = JSON.parse(raw);
        btn.href = 'perfil.html';
        btn.title = 'Ficha de ' + u.username;
        btn.classList.add('logged-in');
        nameEl.textContent = '@' + u.username;
        if (iconEl && u.avatar_id) {
          iconEl.innerHTML = '<img src="images/avatars/' + u.avatar_id + '.svg" alt="' + u.username + '" style="width:18px;height:18px;border-radius:50%;object-fit:cover;vertical-align:middle;display:inline-block;border:1px solid rgba(255,255,255,0.4);">';
        }
      } else {
        btn.href = 'login.html';
        btn.title = 'Acceso / Mi Perfil';
        btn.classList.remove('logged-in');
        nameEl.textContent = 'Acceder';
        if (iconEl) iconEl.textContent = '👤';
      }
    } catch(e){}
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    if (window.DesvariosAuth) {
      window.DesvariosAuth.syncHeader();
      if (window.supabase) {
        const sb = window.DesvariosAuth.getClient();
        if (sb) {
          sb.auth.getSession().then(({ data }) => {
            if (data && data.session) {
              window.DesvariosAuth.getCurrentProfile().then(() => {
                window.DesvariosAuth.syncHeader();
                window.DesvariosAuth.syncGuestMedals();
              });
            } else {
              try { localStorage.removeItem('desvarios_user_cache'); } catch(e){}
              window.DesvariosAuth.syncHeader();
            }
          }).catch(() => {});
        }
      }
    }
  });
}
