-- ====================================================================
-- POBLACIÓN INICIAL DEL FORO DE LA COMUNIDAD (TUS DESVARÍOS)
-- ====================================================================
-- Ejecuta este script en el SQL Editor de tu panel de Supabase.
-- Crea 6 miembros de la comunidad con sus perfiles y avatares,
-- 6 temas temáticos con formato enriquecido en todas las categorías,
-- y 13 respuestas cruzadas (incluyendo bienvenidas a tu tema).
-- ====================================================================

-- 1. USUARIOS DE LA COMUNIDAD EN AUTH.USERS
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
)
VALUES
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000001',
    'authenticated',
    'authenticated',
    'guardian@desvarios.local',
    '$2a$10$wK1r0d8f9zX9yP7q4b6h7euN5m0L3k9j8h7g6f5d4s3a2z1x0c9v8',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"ElGuardian","avatar_id":"lighthouse-keeper"}'::jsonb,
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000002',
    'authenticated',
    'authenticated',
    'pixel@desvarios.local',
    '$2a$10$wK1r0d8f9zX9yP7q4b6h7euN5m0L3k9j8h7g6f5d4s3a2z1x0c9v8',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"PixelMaster","avatar_id":"arcade-alien"}'::jsonb,
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000003',
    'authenticated',
    'authenticated',
    'cuantica@desvarios.local',
    '$2a$10$wK1r0d8f9zX9yP7q4b6h7euN5m0L3k9j8h7g6f5d4s3a2z1x0c9v8',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"MenteCuantica","avatar_id":"quantum-brain"}'::jsonb,
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000004',
    'authenticated',
    'authenticated',
    'bufon@desvarios.local',
    '$2a$10$wK1r0d8f9zX9yP7q4b6h7euN5m0L3k9j8h7g6f5d4s3a2z1x0c9v8',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"BufonCaotico","avatar_id":"chaos-jester"}'::jsonb,
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000005',
    'authenticated',
    'authenticated',
    'cyborg@desvarios.local',
    '$2a$10$wK1r0d8f9zX9yP7q4b6h7euN5m0L3k9j8h7g6f5d4s3a2z1x0c9v8',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"CyborgArcade","avatar_id":"cyber-cyborg"}'::jsonb,
    now() - interval '3 days',
    now() - interval '3 days'
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    'a0000000-0000-0000-0000-000000000006',
    'authenticated',
    'authenticated',
    'sombragato@desvarios.local',
    '$2a$10$wK1r0d8f9zX9yP7q4b6h7euN5m0L3k9j8h7g6f5d4s3a2z1x0c9v8',
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"username":"SombraGato","avatar_id":"mystic-cat"}'::jsonb,
    now() - interval '3 days',
    now() - interval '3 days'
  )
ON CONFLICT (id) DO NOTHING;

-- 2. PERFILES PÚBLICOS (NIVEL, PUNTOS Y BIOGRAFÍA)
INSERT INTO public.perfiles (id, username, avatar_id, bio, puntos, nivel)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'ElGuardian', 'lighthouse-keeper', 'Vigilante de las sombras y farero en San Telmo.', 260, 3),
  ('a0000000-0000-0000-0000-000000000002', 'PixelMaster', 'arcade-alien', 'Veterano de las salas de arcade de los 80. Si parpadeas, pierdes.', 380, 4),
  ('a0000000-0000-0000-0000-000000000003', 'MenteCuantica', 'quantum-brain', 'Desentrañando paradojas, acertijos y bucles lógicos.', 140, 2),
  ('a0000000-0000-0000-0000-000000000004', 'BufonCaotico', 'chaos-jester', 'Especialista en coartadas imposibles y humor absurdo.', 110, 2),
  ('a0000000-0000-0000-0000-000000000005', 'CyborgArcade', 'cyber-cyborg', 'Reflejos cibernéticos en busca del récord perfecto.', 210, 3),
  ('a0000000-0000-0000-0000-000000000006', 'SombraGato', 'mystic-cat', 'Observo en silencio desde el tejado de la abadía.', 120, 2)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  avatar_id = EXCLUDED.avatar_id,
  bio = EXCLUDED.bio,
  puntos = EXCLUDED.puntos,
  nivel = EXCLUDED.nivel;

-- 3. TEMAS DESTACADOS EN TODAS LAS CATEGORÍAS
INSERT INTO public.foro_temas (id, categoria_id, user_id, titulo, contenido, fijado, created_at)
VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'teorias',
    'a0000000-0000-0000-0000-000000000001',
    '¿Quién apagó la linterna en San Telmo? Teorías sobre el final del Faro',
    'Llevo varias partidas explorando la novela interactiva de El Faro de San Telmo y hay un detalle que no me deja dormir: cuando llegas a la cúpula en la noche de tormenta, la lente de Fresnel no está rota, está apagada mecánicamente desde dentro. ¿Pensáis que Mateo perdió el juicio por el aislamiento o realmente la criatura que sube por los acantilados tiene forma humana? Dejad vuestras hipótesis aquí abajo.',
    true,
    now() - interval '2 days'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'arcade',
    'a0000000-0000-0000-0000-000000000002',
    'Récords en Invasores del Espacio: ¿Cuál es vuestra máxima oleada?',
    'Abro hilo oficial para medir fuerzas en la recreativa de Invasores del Espacio. Actualmente mi récord está en 14.850 puntos alcanzando la oleada 8. El truco definitivo es no destruir los escudos frontales y disparar en ráfagas cuando los invasores bajan al penúltimo peldaño. ¿Quién se atreve a retarme en la tabla?',
    true,
    now() - interval '1 day' - interval '14 hours'
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'enigmas',
    'a0000000-0000-0000-0000-000000000003',
    'El acertijo del relojero ciego: ¿Lógica deductiva o paradoja temporal?',
    'En la sección de retos de ingenio hay un enigma que me ha fascinado: "Un reloj que se atrasa diez minutos cada hora y otro que no funciona en absoluto... ¿cuál da la hora correcta con mayor frecuencia al cabo de un mes?". Muchos caen en la trampa intuitiva, pero el desglose matemático esconde una lección brutal de perspectiva.',
    false,
    now() - interval '1 day' - interval '6 hours'
  ),
  (
    'b0000000-0000-0000-0000-000000000004',
    'teorias',
    'a0000000-0000-0000-0000-000000000004',
    'El manuscrito oculto de la Abadía: ¿Alguien logró descifrar el folio 42?',
    'En el scriptorium de la Abadía Maldita encontré una nota al margen en latín macarrónico. Decía algo como "non omnes qui errant perditi sunt" junto a un dibujo de una llave triangular. ¿Abre el osario subterráneo o es una trampa de Fray Guillermo?',
    false,
    now() - interval '18 hours'
  ),
  (
    'b0000000-0000-0000-0000-000000000005',
    'arcade',
    'a0000000-0000-0000-0000-000000000005',
    'La Serpiente Clásica: ¿Es posible llenar el 100% de la cuadrícula?',
    'He estado practicando el patrón de zigzag hamiltoniano en el juego de la serpiente retro. Llegué a 68 manzanas recogidas y el cuerpo ocupaba casi toda la pantalla. ¿Alguien ha conseguido la pantalla de felicitación final o se vuelve matemáticamente imposible girar a esa velocidad?',
    false,
    now() - interval '12 hours'
  ),
  (
    'b0000000-0000-0000-0000-000000000006',
    'general',
    'a0000000-0000-0000-0000-000000000006',
    'El rincón de las peores coartadas: ¿La excusa más absurda que habéis usado?',
    'Inspirado en el generador de coartadas absurdas de la web... ¿alguna vez habéis soltado una excusa tan surrealista en la vida real que la otra persona se quedó sin palabras? Una vez dije que llegaba tarde porque un pato no me dejaba abrir la cancela del jardín.',
    false,
    now() - interval '5 hours'
  )
ON CONFLICT (id) DO NOTHING;

-- 4. RESPUESTAS Y DEBATE EN LOS HILOS
INSERT INTO public.foro_mensajes (id, tema_id, user_id, contenido, created_at)
VALUES
  -- Respuestas para Tema 1 (El Faro)
  (
    'c0000000-0000-0000-0000-000000000001',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000003',
    'Para mí está claro que es una metáfora de la culpa. Si eliges la ruta del diario en el sótano, descubres que Mateo ya había escuchado los golpes antes del naufragio del bergantín.',
    now() - interval '1 day' - interval '20 hours'
  ),
  (
    'c0000000-0000-0000-0000-000000000002',
    'b0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000006',
    'Ojo con la opción de bajar a la cala con el candil de aceite. Si no miras hacia la cueva, el faro sigue encendido cuando regresas... Hay más de 4 finales posibles según las decisiones previas.',
    now() - interval '1 day' - interval '12 hours'
  ),

  -- Respuestas para Tema 2 (Invasores del Espacio)
  (
    'c0000000-0000-0000-0000-000000000003',
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000005',
    '¡14.850 es una barbaridad! Yo me quedé en 9.200 puntos en la oleada 5 porque la nave nodriza roja me pilló sin cobertura. ¿El movimiento de los alienígenas se acelera exponencialmente en la oleada 6?',
    now() - interval '1 day' - interval '8 hours'
  ),
  (
    'c0000000-0000-0000-0000-000000000004',
    'b0000000-0000-0000-0000-000000000002',
    'a0000000-0000-0000-0000-000000000002',
    'Sí, en la oleada 6 la velocidad se duplica. Mi consejo: céntrate primero en despejar las columnas exteriores para que la hilera tarde más tiempo en rebotar en los bordes.',
    now() - interval '1 day' - interval '2 hours'
  ),

  -- Respuestas para Tema 3 (Relojero ciego)
  (
    'c0000000-0000-0000-0000-000000000005',
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000004',
    '¡El que está parado! Marca la hora exacta dos veces al día (60 veces al mes), mientras que el otro que atrasa necesita una barbaridad de días para volver a sincronizarse.',
    now() - interval '1 day'
  ),
  (
    'c0000000-0000-0000-0000-000000000006',
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    '¡Exacto! 60 veces al mes frente a apenas 4 o 5 veces del que se retrasa. La intuición siempre nos engaña con las cosas que "parecen" funcionar a medias.',
    now() - interval '20 hours'
  ),

  -- Respuestas para Tema 4 (Abadía manuscrito)
  (
    'c0000000-0000-0000-0000-000000000007',
    'b0000000-0000-0000-0000-000000000004',
    'a0000000-0000-0000-0000-000000000001',
    'Abre la cripta del priorato, pero necesitas haber recogido primero el medallón de estaño en el refectorio. Si entras sin luz, el juego termina abruptamente en la trampa de pinchos.',
    now() - interval '14 hours'
  ),

  -- Respuestas para Tema 5 (Serpiente)
  (
    'c0000000-0000-0000-0000-000000000008',
    'b0000000-0000-0000-0000-000000000005',
    'a0000000-0000-0000-0000-000000000003',
    'Con el algoritmo del ciclo hamiltoniano es matemáticamente posible cubrir las 400 casillas, pero los reflejos humanos a partir de velocidad 7 fallan por 20 milisegundos. ¡Pura tensión!',
    now() - interval '8 hours'
  ),

  -- Respuestas para Tema 6 (Coartadas)
  (
    'c0000000-0000-0000-0000-000000000009',
    'b0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000004',
    'Yo una vez dije que mi despertador se había desincronizado con la rotación de la Tierra debido a una tormenta solar. Lo mejor de todo es que coló y me dijeron "vaya, ten cuidado mañana".',
    now() - interval '3 hours'
  ),
  (
    'c0000000-0000-0000-0000-000000000010',
    'b0000000-0000-0000-0000-000000000006',
    'a0000000-0000-0000-0000-000000000001',
    'En el faro las gaviotas te roban el almuerzo y no necesitas inventar ninguna excusa, la realidad costera ya supera a cualquier ficción.',
    now() - interval '1 hour'
  ),

  -- Respuestas para el tema de Bienvenida (ID: e9da641c-6119-4310-941f-88c87af49390)
  (
    'c0000000-0000-0000-0000-000000000011',
    'e9da641c-6119-4310-941f-88c87af49390',
    'a0000000-0000-0000-0000-000000000001',
    '¡Bienvenido a los Desvaríos, @Pablosky92! Que la luz de San Telmo guíe tus pasos y cuidado con las sombras de la abadía. Ponte cómodo.',
    now() - interval '1 hour' - interval '40 min'
  ),
  (
    'c0000000-0000-0000-0000-000000000012',
    'e9da641c-6119-4310-941f-88c87af49390',
    'a0000000-0000-0000-0000-000000000002',
    '¡Hola @Pablosky92! Bienvenido a la nave nodriza. Si te gustan los retos retro, nos vemos en los rankings de los juegos arcade 👾🕹️.',
    now() - interval '1 hour' - interval '15 min'
  ),
  (
    'c0000000-0000-0000-0000-000000000013',
    'e9da641c-6119-4310-941f-88c87af49390',
    'a0000000-0000-0000-0000-000000000004',
    '¡Un nuevo desvariado en la sala! Pasa por la cafetería a por un café cuántico y ten a mano una buena coartada por si acaso. ¡Nos leemos!',
    now() - interval '45 min'
  )
ON CONFLICT (id) DO NOTHING;
