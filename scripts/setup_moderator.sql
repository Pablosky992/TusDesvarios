-- ====================================================================
-- SISTEMA DE MODERADORES Y PERMISOS DE GESTIÓN DEL FORO
-- ====================================================================
-- Ejecuta este script en el SQL Editor de tu panel de Supabase.
-- 1. Añade la columna 'rol' en la tabla 'perfiles'.
-- 2. Asigna a tu cuenta 'Pablosky92' el rol de Administrador ('admin').
-- 3. Habilita a administradores y moderadores para fijar temas,
--    eliminar debates inapropiados y borrar respuestas ofensivas.
-- ====================================================================

-- 1. Añadir la columna 'rol' a los perfiles de usuario
ALTER TABLE public.perfiles 
ADD COLUMN IF NOT EXISTS rol text NOT NULL DEFAULT 'usuario';

-- 2. Asignar el rol 'admin' a Pablosky92
UPDATE public.perfiles 
SET rol = 'admin' 
WHERE username = 'Pablosky92';

-- 3. Función auxiliar de seguridad (SECURITY DEFINER) para comprobar rol
CREATE OR REPLACE FUNCTION public.is_admin_or_mod(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.perfiles
    WHERE id = check_user_id AND rol IN ('admin', 'moderador')
  );
$$;

-- 4. Actualizar políticas de seguridad en 'foro_temas'
DROP POLICY IF EXISTS "Usuarios editan sus temas" ON public.foro_temas;
DROP POLICY IF EXISTS "Usuarios borran sus temas" ON public.foro_temas;
DROP POLICY IF EXISTS "Autores o moderadores editan temas" ON public.foro_temas;
DROP POLICY IF EXISTS "Autores o moderadores borran temas" ON public.foro_temas;

-- El autor o un moderador/admin pueden editar o fijar un tema
CREATE POLICY "Autores o moderadores editan temas" ON public.foro_temas
  FOR UPDATE USING (auth.uid() = user_id OR public.is_admin_or_mod(auth.uid()));

-- El autor o un moderador/admin pueden borrar un tema
CREATE POLICY "Autores o moderadores borran temas" ON public.foro_temas
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin_or_mod(auth.uid()));

-- 5. Actualizar políticas de seguridad en 'foro_mensajes'
DROP POLICY IF EXISTS "Usuarios borran sus mensajes" ON public.foro_mensajes;
DROP POLICY IF EXISTS "Autores o moderadores borran mensajes" ON public.foro_mensajes;

-- El autor de la respuesta o un moderador/admin pueden borrar un mensaje
CREATE POLICY "Autores o moderadores borran mensajes" ON public.foro_mensajes
  FOR DELETE USING (auth.uid() = user_id OR public.is_admin_or_mod(auth.uid()));
