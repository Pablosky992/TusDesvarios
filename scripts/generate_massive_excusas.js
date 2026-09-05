const fs = require('fs');
const path = require('path');

const ambitos = [
  { id: 'trabajo', nombre: 'Trabajo & Jefes', icono: '💼' },
  { id: 'pareja', nombre: 'Pareja & Citas', icono: '💘' },
  { id: 'amigos', nombre: 'Amigos & Salidas', icono: '🍻' },
  { id: 'familia', nombre: 'Familia & Compromisos', icono: '🏠' },
  { id: 'gimnasio', nombre: 'Gimnasio & Salud', icono: '🏋️' },
  { id: 'chats', nombre: 'WhatsApp & Redes', icono: '📱' },
  { id: 'dinero', nombre: 'Dinero & Compras', icono: '💸' },
  { id: 'estudios', nombre: 'Estudios & Universidad', icono: '🎓' }
];

const gravedades = [
  { id: 'leve', nombre: 'Falta Leve (Retraso o despiste)', icono: '🟢', color: '#34d399' },
  { id: 'media', nombre: 'Compromiso Medio (Cancelación)', icono: '🟡', color: '#fbbf24' },
  { id: 'critica', nombre: 'Catástrofe Total (Desaparición)', icono: '🔴', color: '#f87171' }
];

const tonos = [
  { id: 'formal', nombre: 'Formal & Diplomático', icono: '🎩' },
  { id: 'cientifico', nombre: 'Científico & Cuántico', icono: '🔬' },
  { id: 'dramatico', nombre: 'Drama Épico Griego', icono: '🎭' },
  { id: 'caradura', nombre: 'Cara Dura Absoluta', icono: '😎' },
  { id: 'conspiranoico', nombre: 'Conspiranoico & Alien', icono: '👽' },
  { id: 'zen', nombre: 'Místico & Zen', icono: '🧘' }
];

// Helper to build specific tailored catalogue
const catalogo = [];

function add(ambito, gravedad, tono, texto, credibilidad, consejo) {
  const matches = catalogo.filter(c => c.ambito === ambito && c.gravedad === gravedad && c.tono === tono);
  catalogo.push({
    ambito,
    gravedad,
    tono,
    texto,
    credibilidad,
    consejo,
    variante: matches.length + 1
  });
}

// ==========================================
// 1. TRABAJO & JEFES
// ==========================================

// LEVE
add('trabajo', 'leve', 'formal', 'Estimado equipo: debido a una congestión vial imprevista en el eje metropolitano, sufriré una demora estimada de 14 minutos. Agradezco de antemano su comprensión.', 94, 'Entra a la oficina caminando con paso decidido y un bloc de notas en la mano.');
add('trabajo', 'leve', 'formal', 'He debido atender un requerimiento logístico de carácter urgente antes de iniciar el trayecto hacia la sede. Me incorporo a mi puesto de forma inminente.', 91, 'No des demasiados detalles; la sobriedad burocrática infunde respeto.');
add('trabajo', 'leve', 'formal', 'Una actualización automática no programada del sistema operativo ha bloqueado el terminal de trabajo durante el inicio matutino. Restableciendo conexión.', 88, 'Muestra una captura borrosa de la pantalla de carga si alguien pregunta.');
add('trabajo', 'leve', 'formal', 'Por reajuste en los flujos operativos de la primera hora, completaré la revisión del documento solicitado en la siguiente franja de la jornada.', 90, 'Envía el correo a las 08:03 AM para dar imagen de extrema diligencia.');

add('trabajo', 'leve', 'cientifico', 'Mi despertador y mi reloj biológico entraron en un estado de desfase cuántico de fase de 15 minutos debido a un micro-colapso térmico en la cafetera.', 76, 'Menciona la palabra "entropía" y nadie se atreverá a replicar.');
add('trabajo', 'leve', 'cientifico', 'El campo gravitacional inducido por el colchón alcanzó una masa crítica temporal que redujo la aceleración de mis extremidades a valores subatómicos.', 68, 'Añade que fue un "efecto marea gravitatoria" con cara de póker.');
add('trabajo', 'leve', 'cientifico', 'El principio de incertidumbre de Heisenberg impide conocer simultáneamente la posición exacta de este informe y mi velocidad de entrega.', 72, 'Adjunta un gráfico de dispersión sin ejes para deslumbrar.');

add('trabajo', 'leve', 'dramatico', '¡Los hados del destino se aliaron contra mi marcha! Una procesión infernal de semáforos en rojo ha retenido mi vehículo a las puertas del templo laboral.', 65, 'Suspira profundamente mirando al infinito antes de sentarte.');
add('trabajo', 'leve', 'dramatico', 'Un dragón cibernético conocido como pantalla azul ha intentado devorar mis archivos. He luchado contra el abismo para rescatar el trabajo.', 79, 'Frunce el ceño y di que has salvado la empresa por los pelos.');
add('trabajo', 'leve', 'dramatico', 'El destino me ha puesto a prueba: una fuga de proporciones homéricas en la llave de paso ha demorado mi salida. He contenido el diluvio.', 82, 'Moja un poco la manga de la camisa para darle dramatismo.');

add('trabajo', 'leve', 'caradura', 'No llego tarde: simplemente estaba dando margen de ventaja al resto del departamento para que la competencia fuera justa.', 45, 'Solo aplicable si eres el único que sabe usar Excel en la planta.');
add('trabajo', 'leve', 'caradura', 'Iba a entregar el informe a primera hora, pero no quería dejar en evidencia el ritmo de trabajo de los demás compañeros.', 38, 'Sonríe con seguridad y ofrece un café al jefe.');
add('trabajo', 'leve', 'caradura', 'El tráfico me ha dado tiempo para meditar sobre cómo optimizar la empresa. En realidad este retraso es inversión en I+D.', 40, 'Lleva gafas de pasta para parecer un visionario.');

add('trabajo', 'leve', 'conspiranoico', 'Mi GPS fue desviado por satélites de geolocalización que claramente están probando algoritmos de control de tráfico en mi vehículo.', 48, 'Mira de reojo a los detectores de humo del techo.');
add('trabajo', 'leve', 'conspiranoico', 'Un microcorte en los servidores de la competencia ha provocado un cuello de botella que bloqueó mi sincronización matutina.', 58, 'Pega cinta adhesiva en la cámara de tu portátil.');
add('trabajo', 'leve', 'conspiranoico', 'He detectado interferencias en la red eléctrica de mi manzana. Sospecho que intentaban sabotear mi puntualidad.', 50, 'Baja la voz cuando lo expliques en el pasillo.');

add('trabajo', 'leve', 'zen', 'El universo me indicó que no forzara el flujo energético de la mañana. Llegar antes habría quebrado la armonía del equipo.', 55, 'Entra haciendo respiraciones conscientes y saluda con calma.');
add('trabajo', 'leve', 'zen', 'Las tareas pendientes son como hojas que caen en otoño: llegan a su destino en el momento kármico exacto.', 42, 'Ofrece una infusión de jengibre a tu supervisor.');
add('trabajo', 'leve', 'zen', 'Mi presencia física ha tardado unos minutos más, pero mi espíritu colaborativo ha estado en la oficina desde el alba.', 30, 'Cierra los ojos un segundo antes de responder.');

// MEDIA
add('trabajo', 'media', 'formal', 'Lamento comunicar que por motivos de fuerza mayor de carácter familiar e inaplazable, me veré obligado a ausentarme de la sesión vespertina.', 92, 'Ofrece enviar un resumen ejecutivo por correo antes de salir.');
add('trabajo', 'media', 'formal', 'Debido a una indisposición gastrointestinal sobrevenida que compromete mi rendimiento profesional, solicitaré reposo preventivo por prescripción facultativa.', 95, 'Nadie pide detalles cuando se menciona un problema gástrico.');
add('trabajo', 'media', 'formal', 'Por necesidad de atender una gestión legal y notarial urgente con plazos improrrogables, debo reprogramar nuestras reuniones para la jornada de mañana.', 89, 'Menciona la palabra "aranceles" o "catastro" para sonar intachable.');

add('trabajo', 'media', 'cientifico', 'Mi sistema inmunológico ha detectado un ataque viral biológico de alta virulencia que exige una cuarentena preventiva para no diezmar la plantilla.', 86, 'Tose levemente una sola vez con tono seco.');
add('trabajo', 'media', 'cientifico', 'Se ha producido una sobrecarga eléctrica en el transformador de mi bloque que ha fundido los relés del router y la red doméstica.', 84, 'Desconecta el móvil durante un par de horas.');
add('trabajo', 'media', 'cientifico', 'La entropía acumulada en mis ciclos de descanso ha reducido mi capacidad de procesamiento cognitivo al 12%. Recomiendo reinicio de sistema.', 70, 'Usa términos de computación para describir tu cansancio.');

add('trabajo', 'media', 'dramatico', '¡Una calamidad doméstica de alcance bíblico azota mi morada! Un técnico de calderas mantiene retenida mi tarde bajo amenaza de helada perpetua.', 85, 'Pon tono de resignación y desesperanza profunda.');
add('trabajo', 'media', 'dramatico', 'La migraña ha clavado sus garras de fuego en mi cráneo. Mi lealtad a la empresa es infinita, pero mi visión periférica se desvanece.', 91, 'Apaga las luces y habla en susurros.');
add('trabajo', 'media', 'dramatico', 'El destino ha reclamado mi presencia para socorrer a un ser querido en apuros médicos. Marcho al deber con el corazón encogido.', 93, 'Mira el reloj con angustia fingida.');

add('trabajo', 'media', 'caradura', 'He calculado que si me quedo esta tarde trabajando voy a restar más que sumar. Os hago un favor colectivo tomándome la tarde libre.', 35, 'Di que es una decisión altruista por el bien del proyecto.');
add('trabajo', 'media', 'caradura', 'Tenía pensado venir, pero he visto que el sol brillaba tanto que sería un pecado moral no aprovecharlo. Nos vemos mañana.', 20, 'Solo para el último día antes de tus vacaciones.');
add('trabajo', 'media', 'caradura', 'He cumplido ya mi cuota mensual de paciencia con clientes. Por seguridad jurídica, mejor vuelvo el lunes.', 42, 'Hazlo pasar por prevención de riesgos laborales.');

add('trabajo', 'media', 'conspiranoico', 'Una patrulla de agentes no identificados ha acordonado mi calle por una supuesta fuga química. No nos permiten salir de los portales.', 72, 'Di que el ejército ha tomado el control de la avenida.');
add('trabajo', 'media', 'conspiranoico', 'He sido testigo de un incidente clasificado en las inmediaciones y debo prestar declaración bajo estricto acuerdo de confidencialidad.', 60, 'Mira hacia los lados con suspicacia antes de colgar.');
add('trabajo', 'media', 'conspiranoico', 'Los servidores en la nube han sido intervenidos por una agencia extranjera. Hasta que limpien los troyanos no puedo operar.', 65, 'Aconseja a tu jefe cambiar las contraseñas.');

add('trabajo', 'media', 'zen', 'Mi aura necesita un proceso de purificación profunda lejos de las radiaciones electromagnéticas de las hojas de cálculo.', 45, 'Dilo con voz suave y pausada.');
add('trabajo', 'media', 'zen', 'El universo me ha colocado un obstáculo insalvable en el camino físico para que trabaje en mi dimensión interior hoy.', 38, 'Manda un emoticono de flor de loto en el chat.');
add('trabajo', 'media', 'zen', 'Aceptar el descanso cuando el cuerpo lo pide es la forma más pura de honrar el compromiso con el trabajo venidero.', 50, 'Cita a Confucio de forma inventada.');

// CRITICA
add('trabajo', 'critica', 'formal', 'Por circunstancias excepcionales de fuerza mayor bajo secreto sumarial y amparo legal, no podré incorporarme a la actividad laboral en las próximas 48 horas.', 96, 'Envía el comunicado a través de un canal oficial y apaga el móvil.');
add('trabajo', 'critica', 'formal', 'Un colapso estructural grave en la instalación principal de mi residencia habitual ha requerido la intervención de los servicios de bomberos y peritaje.', 94, 'Guarda el número del parte de bomberos ficticio.');
add('trabajo', 'critica', 'formal', 'Me veo en la imperiosa obligación de ausentarme por un requerimiento urgente de traslado internacional de un familiar directo bajo tutela legal.', 92, 'Usa términos jurídicos contundentes.');

add('trabajo', 'critica', 'cientifico', 'He sido expuesto a un agente bacteriológico desconocido tras ingerir marisco en mal estado; me encuentro en aislamiento biológico de nivel 3.', 90, 'No envíes fotos bajo ningún concepto.');
add('trabajo', 'critica', 'cientifico', 'Un pulso electromagnético derivado de una tormenta solar ha fundido la placa base de mis tres dispositivos de trabajo simultáneamente.', 75, 'Muestra una foto de un condensador quemado de Google Images.');
add('trabajo', 'critica', 'cientifico', 'Mi ritmo cardíaco y mis niveles de cortisol han entrado en una fase de resonancia crítica que requiere sedación farmacológica hospitalaria.', 93, 'Habla con voz extremadamente débil.');

add('trabajo', 'critica', 'dramatico', '¡La ruina y la desolación han llamado a mi puerta! Una inundación torrencial ha arrasado mi hogar convirtiendo mi existencia en un naufragio.', 94, 'Pon un cubo de agua en el suelo de fondo por si haces videollamada.');
add('trabajo', 'critica', 'dramatico', 'El abismo se ha abierto bajo mis pies. El dolor y la fiebre me postran en un lecho de espinas. Rezad por mi recuperación.', 88, 'Corta la llamada tosiendo dramáticamente.');
add('trabajo', 'critica', 'dramatico', '¡He sido víctima de un asalto a mano armada donde me han despojado de mis pertenencias, llaves y dignidad terrenal!', 95, 'Presenta una denuncia ficticia o borrosa.');

add('trabajo', 'critica', 'caradura', 'He decidido tomarme un año sabático de tres días para reflexionar sobre mi propósito en esta corporación. El lunes os cuento las conclusiones.', 25, 'Ten el finiquito calculado por si acaso.');
add('trabajo', 'critica', 'caradura', 'Me he quedado encerrado en una fiesta en un barco en alta mar sin cobertura. Cuando atraquemos vuelvo a fichar.', 18, 'Apaga el GPS de Instagram inmediatamente.');
add('trabajo', 'critica', 'caradura', 'He ganado un sorteo exprés de un fin de semana en un spa y rechazarlo sería una falta de respeto al karma turístico.', 22, 'Solo para contratos blindados.');

add('trabajo', 'critica', 'conspiranoico', 'He sido interceptado por el servicio secreto para colaborar como testigo protegido en una operación antiterrorista internacional.', 40, 'Di que si no contestas en 3 días llamen a la embajada.');
add('trabajo', 'critica', 'conspiranoico', 'Mi identidad digital ha sido suplantada por una IA rusa que ha borrado mis accesos y me ha dejado indocumentado.', 52, 'Usa un número de teléfono prepago.');
add('trabajo', 'critica', 'conspiranoico', 'Un satélite espía ha caído en el tejado de mi urbanización y el ejército ha cortado las comunicaciones por radiofrecuencia.', 35, 'Cuelga diciendo "están interviniendo la línea".');

add('trabajo', 'critica', 'zen', 'He entrado en un retiro de silencio absoluto de 72 horas para desbloquear mi potencial cósmico y regresar como un líder supremo.', 30, 'Pon un mensaje automático de ausencia místico en el correo.');
add('trabajo', 'critica', 'zen', 'El ciclo lunar actual exige una reclusión en soledad para transmutar las energías densas del entorno laboral.', 28, 'Manda una foto de un bosque con niebla.');
add('trabajo', 'critica', 'zen', 'El ego corporativo ha muerto temporalmente en mí. Renaceré el lunes con las cuentas de balance en paz.', 22, 'Usa incienso de sándalo.');


// ==========================================
// 2. PAREJA & CITAS
// ==========================================

// LEVE
add('pareja', 'leve', 'formal', 'He auditado nuestra conversación previa y constato un desfase comunicativo involuntario. Reitero mi compromiso incondicional con la armonía de este vínculo.', 90, 'Acompaña la disculpa con un abrazo de mínimo 6 segundos.');
add('pareja', 'leve', 'formal', 'Por motivos de congestión en la cadena de suministro local, el encargo del pan y los víveres sufrirá un aplazamiento de 20 minutos.', 88, 'Vuelve con unos croissants calientes de regalo.');
add('pareja', 'leve', 'formal', 'Lamento profundamente el retraso en responder a tu mensaje; me hallaba inmerso en una sesión de alta concentración logística.', 92, 'No admitas que estabas viendo vídeos de reformas de casas.');

add('pareja', 'leve', 'cientifico', 'Mi corteza prefrontal experimentó una saturación de estímulos que bloqueó la memoria a corto plazo sobre sacar la carne del congelador.', 78, 'Baja corriendo a por comida preparada y sírvela en plato hondo.');
add('pareja', 'leve', 'cientifico', 'Según la teoría de la relatividad, los 40 minutos que he tardado en arreglarme son apenas 3 segundos en un marco inercial acelerado.', 62, 'Elogia su peinado antes de que mire el reloj.');
add('pareja', 'leve', 'cientifico', 'La atracción gravitatoria del sofá superó el coeficiente de fricción de mi voluntad de levantarme.', 70, 'Pide que te dé la mano para romper la gravedad.');

add('pareja', 'leve', 'dramatico', '¡Ciega fue mi mente al olvidar tan noble encargo! El remordimiento devora mi alma cual fuego purificador. Déjame enmendar mi falta.', 85, 'Pon una mano en el pecho con devoción.');
add('pareja', 'leve', 'dramatico', 'Un torbellino de contratiempos casi me arrebata la oportunidad de verte. He cruzado ríos de atascos por llegar a tus brazos.', 89, 'Llega con el pelo ligeramente despeinado.');
add('pareja', 'leve', 'dramatico', '¡El destino ha conspirado contra nuestro encuentro! El metro se detuvo en las tinieblas del túnel privándome de tu compañía.', 92, 'Muestra indignación contra el transporte público.');

add('pareja', 'leve', 'caradura', 'No se me olvidó sacar la basura: la estaba dejando macerar para que pesara menos al fermentar.', 42, 'Sácala corriendo mientras te ríes.');
add('pareja', 'leve', 'caradura', 'No tardé en responder; estaba creando misterio y tensión romántica para mantener viva la llama de la pasión.', 50, 'Guiña el ojo con confianza.');
add('pareja', 'leve', 'caradura', 'He comido el último bombón de la caja para protegerte de los azúcares refinados. Lo he hecho por tu salud.', 45, 'Promete comprar una caja entera mañana.');

add('pareja', 'leve', 'conspiranoico', 'El algoritmo de WhatsApp retuvo deliberadamente tu mensaje para sabotear nuestra relación. Ya he desactivado la optimización de batería.', 68, 'Muestra capturas de ajustes de notificaciones.');
add('pareja', 'leve', 'conspiranoico', 'El supermercado cambió la disposición de los estantes en una maniobra psicológica para que no encontrara lo que me pediste.', 75, 'Culpar al gran capital siempre empatiza.');
add('pareja', 'leve', 'conspiranoico', 'Estoy seguro de que el reloj de la cocina tiene un desfase temporal provocado por las microondas del vecino.', 55, 'Cambia la pila del reloj delante de tu pareja.');

add('pareja', 'leve', 'zen', 'El olvido de comprar la cena es una invitación del destino para que practiquemos el ayuno intermitente y limpiemos el aura.', 40, 'Ten una pizza congelada de emergencia.');
add('pareja', 'leve', 'zen', 'El tiempo no existe en el plano del amor puro; llegar 20 minutos tarde es una ilusión de la mente terrenal.', 35, 'Besa su frente con serenidad.');
add('pareja', 'leve', 'zen', 'Acepto la frustración que sientes y la transformo en energía lumínica para nuestra convivencia.', 48, 'Enciende una vela con olor a vainilla.');

// MEDIA (Cancelaciones de citas / cenas)
add('pareja', 'media', 'formal', 'Por discrepancias logísticas insubsanables con mis niveles de energía física, sugiero posponer la cena con tus amigos a una fecha más oportuna.', 84, 'Ofrécete a pagar la siguiente reserva en un sitio mejor.');
add('pareja', 'media', 'formal', 'Lamento informarte de que una indisposición física repentina me impide acompañarte al evento social programado para hoy.', 92, 'Ponte el termómetro visible en la mesita.');
add('pareja', 'media', 'formal', 'Un imprevisto laboral de última hora me retiene en la oficina; no podré acudir al compromiso previsto.', 90, 'Deja abierta una hoja de cálculo en la pantalla.');

add('pareja', 'media', 'cientifico', 'Mi batería social ha descendido al 4%, por debajo del umbral de estabilidad sinapsial necesario para interactuar con tus parientes.', 82, 'Ponte una infusión y métete en la cama temprano.');
add('pareja', 'media', 'cientifico', 'He sufrido una reacción alérgica dérmica no infecciosa que desaconseja la exposición a ambientes concurridos.', 88, 'Frótate un poco la nariz para enrojecerla.');
add('pareja', 'media', 'cientifico', 'Mi ciclo circadiano ha entrado en fase de hibernación precoz tras una sobrecarga de estímulos laborales.', 75, 'Bosteza de forma prolongada.');

add('pareja', 'media', 'dramatico', 'Una jaqueca atroz atenaza mis sienes cual corona de espinas. Mi corazón arde por ir contigo, pero mi cuerpo exige oscuridad.', 94, 'Baja todas las persianas de la casa.');
add('pareja', 'media', 'dramatico', '¡Qué dolor desgarra mi pecho al tener que cancelar nuestra velada! La fiebre me consume y solo anhelo tus cuidados.', 93, 'Pide un caldo caliente con voz frágil.');
add('pareja', 'media', 'dramatico', 'El agotamiento de mi espíritu es tal que no sería digno de tu belleza en esa cena. Mereces un acompañante radiante, no mi sombra.', 80, 'Dilo con tono de poeta romántico del siglo XIX.');

add('pareja', 'media', 'caradura', 'Si voy a esa cena me voy a pasar la noche quejándome del menú y del ruido. Te estoy haciendo un favor monumental quedándome en casa.', 60, 'Preséntalo como un regalo altruista.');
add('pareja', 'media', 'caradura', 'He visto que estrenaban la nueva temporada de nuestra serie y he sacrificado la fiesta para preparar el maratón del sofá.', 48, 'Ten las palomitas listas cuando vuelva.');
add('pareja', 'media', 'caradura', 'Tus amigos me caen genial, pero hoy me cae mejor mi cama. Es una cuestión de prioridades afectivas.', 35, 'Solo si lleváis más de 5 años juntos.');

add('pareja', 'media', 'conspiranoico', 'He recibido información fidedigna de que tus amigos planean una encerrona para preguntarme cuándo nos casamos. He abortado la misión.', 78, 'Tu pareja se reirá y te perdonará.');
add('pareja', 'media', 'conspiranoico', 'El restaurante al que íbamos tiene denuncias encubiertas de sanidad por uso de salsas sintéticas. He cancelado por precaución.', 65, 'Muestra una reseña de una estrella en Google.');
add('pareja', 'media', 'conspiranoico', 'He notado que nos están rastreando la ubicación y considero más seguro permanecer en nuestro refugio doméstico.', 45, 'Pon el móvil en modo avión delante de ella.');

add('pareja', 'media', 'zen', 'Siento que hoy debo guardar silencio y recogimiento para ofrecerte una versión más luminosa y paciente mañana.', 52, 'Prepara el desayuno al día siguiente sin que te lo pida.');
add('pareja', 'media', 'zen', 'Nuestras almas están conectadas sin necesidad de asistir a eventos multitudinarios que dispersan la energía cósmica.', 45, 'Pon música ambiental de cuencos tibetanos.');
add('pareja', 'media', 'zen', 'El fluir del universo me pide reposo en el hogar para equilibrar los chakras de nuestra relación.', 40, 'Masajea sus hombros un par de minutos.');


// ==========================================
// 3. AMIGOS & SALIDAS
// ==========================================

// LEVE
add('amigos', 'leve', 'formal', 'Estimados amigos: debido a compromisos de índole logística imprevistos, mi llegada al punto de encuentro se demorará 25 minutos.', 92, 'Pide la primera ronda cuando llegues para sellar la paz.');
add('amigos', 'leve', 'formal', 'Por necesidad de concluir un trámite doméstico urgente, me uniré a vosotros en el segundo local del itinerario previsto.', 90, 'Pide la ubicación en tiempo real en el grupo de WhatsApp.');
add('amigos', 'leve', 'formal', 'Lamento el retraso; el estacionamiento en la zona presenta una densidad vehicular superior a la media histórica.', 94, 'Culpar al aparcamiento nunca falla un viernes.');

add('amigos', 'leve', 'cientifico', 'El rozamiento estático de la ropa de estar por casa ha generado un campo magnético que me ha retenido 20 minutos en el pasillo.', 75, 'Di que has tenido que vencer la inercia.');
add('amigos', 'leve', 'cientifico', 'El tiempo de preparación textil superó la estimación gaussiana inicial en dos desviaciones típicas.', 80, 'Llega diciendo que ibas a la velocidad de la luz.');
add('amigos', 'leve', 'cientifico', 'He sufrido un colapso termodinámico al intentar decidir qué chaqueta ponerme según el pronóstico barométrico.', 70, 'Quítate la chaqueta nada más llegar con cara de acalorado.');

add('amigos', 'leve', 'dramatico', '¡Los semáforos se confabularon en mi contra como demonios bermellones! Pero aquí estoy, desafiando a los elementos por vuestra amistad.', 72, 'Pide una cerveza con urgencia como quien sobrevive al desierto.');
add('amigos', 'leve', 'dramatico', 'El cerrojo de mi portal se rebeló contra su amo y quedé prisionero en mi propio castillo durante media hora.', 85, 'Gesticula ampliamente con las manos.');
add('amigos', 'leve', 'dramatico', '¡Una tragedia textil! Mi camisa favorita sufrió una mancha atroz y tuve que reiniciar todo el ritual del atuendo.', 88, 'Señala tu ropa alternativa.');

add('amigos', 'leve', 'caradura', 'He llegado tarde para que me recibierais con más ganas y aplausos. De nada por la emoción.', 50, 'Paga las aceitunas y todo perdonado.');
add('amigos', 'leve', 'caradura', 'Estaba haciendo tiempo para no tener que pagar la primera ronda cara.', 40, 'Solo funciona con tus amigos de toda la vida.');
add('amigos', 'leve', 'caradura', 'Iba a salir a tiempo, pero me puse un capítulo de 20 minutos y duraba 45.', 65, 'Admitir la verdad con humor suele triunfar.');

add('amigos', 'leve', 'conspiranoico', 'La policía local cortó tres calles sin motivo aparente; claramente había un protocolo de seguridad que me impidió avanzar.', 80, 'Pregunta si alguien ha visto furgones policiales.');
add('amigos', 'leve', 'conspiranoico', 'Google Maps me mandó por una ruta sospechosamente larga para obligarme a pasar delante de tres gasolineras caras.', 74, 'Muestra la ruta en el móvil.');
add('amigos', 'leve', 'conspiranoico', 'Mi ascensor bajó a la mitad de velocidad habitual; sospecho que están ahorrando energía comunitaria a mi costa.', 62, 'Llega fingiendo sofoco por haber bajado escaleras.');

add('amigos', 'leve', 'zen', 'El tiempo de los relojes es una prisión mental. Llego exactamente en el instante en que el universo quería que nos viéramos.', 45, 'Brinda de inmediato.');
add('amigos', 'leve', 'zen', 'Mi camino ha tenido desvíos necesarios para purificar la mente antes de compartir esta cerveza sagrada con vosotros.', 40, 'Choca los vasos con solemnidad.');
add('amigos', 'leve', 'zen', 'No hay retraso cuando el reencuentro es sincero y puro.', 38, 'Sonríe con calidez y pide bravas.');

// MEDIA (Cancelar salir un viernes)
add('amigos', 'media', 'formal', 'Lamento profundamente no poder unirme a la velada de hoy; un cuadro de malestar general me aconseja guardar reposo en el domicilio.', 93, 'Manda el mensaje antes de las 20:00 para no parecer un rajado de última hora.');
add('amigos', 'media', 'formal', 'Por compromisos profesionales que se han extendido más allá del horario previsto, no podré estar presente en la cena.', 90, 'No publiques nada en Instagram en toda la noche.');
add('amigos', 'media', 'formal', 'Un asunto familiar urgente e inaplazable requiere mi atención durante la tarde-noche de hoy. Disfrutad de la salida.', 94, 'Nadie cuestiona los temas de familia.');

add('amigos', 'media', 'cientifico', 'Mi nivel de glucógeno muscular y reserva energética ha entrado en fase crítica. Salir hoy provocaría un catabolismo social severo.', 78, 'Manda una foto del termómetro marcando 37.8ºC.');
add('amigos', 'media', 'cientifico', 'He ingerido un alimento con trazas de histamina que me ha provocado una cefalea tensional incompatible con decibelios de pub.', 86, 'Usa términos de farmacia.');
add('amigos', 'media', 'cientifico', 'Mi cuerpo ha iniciado un proceso de reparación celular profunda que no tolera la ingesta de cebada fermentada.', 72, 'Diles que te reservas para la próxima.');

add('amigos', 'media', 'dramatico', '¡Maldita sea mi suerte! Un catarro devastador ha derrumbado mis anhelos de fiesta y jarana con vosotros.', 91, 'Manda una nota de voz con voz ronca y tos fingida.');
add('amigos', 'media', 'dramatico', 'El cuerpo me pesa como el plomo y el alma me llora por no poder acompañaros en la gloria nocturna.', 84, 'Pon un emoji de máscara médica.');
add('amigos', 'media', 'dramatico', '¡La tiranía del cansancio me ha vencido! Caigo rendido en el lecho con el pesar de un guerrero derrotado.', 79, 'Apaga el móvil a las 22:30.');

add('amigos', 'media', 'caradura', 'Gente, me he puesto el pijama a las ocho y ya no hay fuerza humana ni divina en el planeta Tierra que me saque de casa.', 85, 'La sinceridad absoluta con amigos siempre gana puntos de respeto.');
add('amigos', 'media', 'caradura', 'Si salgo hoy me gasto 50 euros y prefiero gastármelos en comida a domicilio y ver una peli de miedo.', 70, 'Invítales a tu casa a jugar a la consola el domingo.');
add('amigos', 'media', 'caradura', 'Estoy en modo planta de interior: solo necesito agua, luz tenue y que nadie me hable hasta mañana a las doce.', 75, 'Manda un sticker de un gato durmiendo.');

add('amigos', 'media', 'conspiranoico', 'Tengo sospechas fundadas de que en ese bar va a haber una redada de la SGAE o de inspección de trabajo. Mejor me guardo.', 60, 'Manda un audio susurrando.');
add('amigos', 'media', 'conspiranoico', 'Mis fuentes me confirman que va a ir mi ex o alguien a quien le debo dinero; por protocolo de seguridad me quedo en el búnker.', 82, 'Tus amigos entenderán la retirada estratégica.');
add('amigos', 'media', 'conspiranoico', 'El pronóstico meteorológico secreto indica tormenta eléctrica inminente aunque el cielo esté despejado.', 45, 'Di que tienes un barómetro en la rodilla.');

add('amigos', 'media', 'zen', 'Mi energía astral está en fase menguante y compartirla hoy os bajaría la vibración de la fiesta.', 50, 'Deséales una noche luminosa.');
add('amigos', 'media', 'zen', 'Siento que el universo me llama al recogimiento y a la lectura de clásicos.', 42, 'Manda una foto de una taza de poleo menta.');
add('amigos', 'media', 'zen', 'El no-hacer es el arte más elevado del fin de semana. Os acompaño desde el plano astral.', 35, 'Reacciona a sus fotos al día siguiente.');


// ==========================================
// 4. FAMILIA & COMPROMISOS
// ==========================================

// LEVE
add('familia', 'leve', 'formal', 'Estimada familia: debido a labores domésticas imprevistas y mantenimiento del vehículo, me demoraré unos minutos para el almuerzo.', 94, 'Llega con una bandeja de pasteles de la confitería.');
add('familia', 'leve', 'formal', 'He debido atender una llamada laboral urgente de última hora que no admitía demora antes de emprender el viaje.', 92, 'Pon el móvil en silencio sobre la mesa.');
add('familia', 'leve', 'formal', 'Disculpad el retraso; el tráfico en la circunvalación ha sufrido retenciones por un transporte especial.', 95, 'Las abuelas siempre perdonan si elogias su comida nada más entrar.');

add('familia', 'leve', 'dramatico', '¡La llave del garaje se atascó en la cerradura y casi quedo preso para siempre lejos del calor de vuestra mesa!', 88, 'Abraza a tu madre con fuerza teatral.');
add('familia', 'leve', 'dramatico', 'He luchado contra mares de tráfico y atascos interminables por llegar a tiempo a probar ese guiso sagrado.', 92, 'Pide repetir plato para sellar la paz.');
add('familia', 'leve', 'dramatico', '¡Una tormenta de contratiempos domésticos ha intentado separarme de los míos! Pero la sangre tira más que el destino.', 85, 'Dilo en la cabecera de la mesa.');

add('familia', 'media', 'formal', 'Lamento profundamente no poder acudir al almuerzo dominical por una indisposición gástrica que me obliga a guardar estricta dieta blanda.', 96, 'No salgas en ninguna foto en redes ese domingo.');
add('familia', 'media', 'formal', 'Por necesidad de preparar una entrega profesional crítica e inaplazable para primera hora del lunes, no podré asistir al compromiso.', 90, 'Llama por teléfono a tu abuela personalmente para disculparte.');
add('familia', 'media', 'dramatico', '¡El deber laboral y una fiebre traicionera me privan de la mayor alegría de la semana: ver a mi familia reunida!', 94, 'Promete ir a merendar el próximo martes.');
add('familia', 'media', 'caradura', 'Si voy a la comida me vais a preguntar 14 veces cuándo me compro un piso o cuándo tengo hijos, así que me he recetado paz mental.', 65, 'Solo para el grupo de primos de WhatsApp.');
add('familia', 'media', 'conspiranoico', 'Mi casero ha enviado un perito de urgencia a revisar las tuberías del edificio y tengo orden de no abandonar el piso bajo multa.', 88, 'Cualquier problema de comunidad de vecinos es creíble al 100%.');
add('familia', 'media', 'zen', 'Siento que hoy debo guardar silencio y recogimiento para sanar el árbol genealógico desde la calma interior.', 45, 'Manda una foto de una vela blanca encendida.');


// ==========================================
// 5. GIMNASIO & SALUD
// ==========================================

// LEVE / MEDIA
add('gimnasio', 'leve', 'formal', 'Estimado entrenador: por una sobrecarga preventiva en el tendón rotuliano, aplazaré la sesión de fuerza para mañana.', 92, 'Haz estiramientos en casa mientras ves la tele.');
add('gimnasio', 'leve', 'cientifico', 'El principio de supercompensación hipertrófica dicta que el crecimiento muscular óptimo se produce durante el reposo absoluto en el sofá.', 85, 'Menciona la síntesis de proteínas y la hormona del crecimiento.');
add('gimnasio', 'leve', 'dramatico', '¡Mis fibras musculares lloran de agonía tras la última batalla con las mancuernas! El templo del hierro debe esperar a que mis heridas sanen.', 80, 'Pon cara de dolor al levantarte de la silla.');
add('gimnasio', 'leve', 'caradura', 'Hoy me tocaba día de pierna, y como la vida ya es bastante dura de por sí, he decidido hacer día de pizza.', 70, 'La honestidad deportiva te liberará de culpa.');
add('gimnasio', 'leve', 'conspiranoico', 'El aire acondicionado del gimnasio está calibrado para esparcir micropartículas que aumentan la fatiga y obligarte a comprar sus batidos de proteínas.', 65, 'Entrena en el parque 5 minutos.');
add('gimnasio', 'leve', 'zen', 'El músculo más importante que debo ejercitar hoy es la paz mental y la aceptación de mi estado físico actual.', 50, 'Respira hondo mientras abres el paquete de galletas.');

add('gimnasio', 'media', 'formal', 'Por prescripción de mi fisioterapeuta de confianza, suspendo la actividad deportiva de alta intensidad durante 72 horas.', 95, 'Camina un poco más lento ese día.');
add('gimnasio', 'media', 'cientifico', 'He detectado un pico anómalo de ácido láctico en mis cuadríceps que podría derivar en una rotura fibrilar subfascial si toco una barra.', 88, 'Usa términos de anatomía.');
add('gimnasio', 'media', 'dramatico', 'Una punzada traicionera en la zona lumbar me ha postrado cual gladiador herido en la arena. El reposo es mi única medicina.', 92, 'Ponte una faja lumbar de mentira.');
add('gimnasio', 'media', 'caradura', 'He calculado que ya quemé suficientes calorías bajando las escaleras de casa esta mañana, así que doy la semana por completada.', 55, 'Comerse un plátano cuenta como pre-entreno.');
add('gimnasio', 'media', 'conspiranoico', 'Las máquinas del gimnasio tienen contadores trucados para que creas que levantas menos y contrates a un entrenador personal.', 58, 'Muestra indignación contra la industria del fitness.');
add('gimnasio', 'media', 'zen', 'El esfuerzo físico sin alineación espiritual es mera vanidad terrenal. Hoy honro a mi cuerpo con una siesta regenerativa.', 48, 'Duerme 9 horas seguidas.');


// ==========================================
// 6. WHATSAPP & REDES SOCIALES
// ==========================================

// LEVE / MEDIA
add('chats', 'leve', 'formal', 'Disculpa la demora en responder; he tenido la aplicación en segundo plano debido a una auditoría de notificaciones en mi dispositivo móvil.', 94, 'Contesta siempre con cortesía impecable.');
add('chats', 'leve', 'cientifico', 'El algoritmo de optimización de batería de Android mató el hilo de ejecución de WhatsApp sin enviar la interrupción correspondiente a la memoria RAM.', 90, 'Culpar al sistema operativo nunca falla.');
add('chats', 'leve', 'dramatico', '¡El aluvión de mensajes me sumergió en un océano digital del que apenas he logrado rescatar tu sagrado chat!', 82, 'Manda un audio con energía renovada.');
add('chats', 'leve', 'caradura', 'Leí tu mensaje mentalmente hace tres semanas y mi cerebro dio por hecho que ya te había respondido con telepatía.', 88, 'Es una de las excusas más universales y aceptadas del mundo.');
add('chats', 'leve', 'conspiranoico', 'Meta está probando un nuevo filtro antispam que archiva automáticamente los mensajes más importantes para generar dependencia emocional.', 72, 'Di que tu móvil se ha vuelto loco.');
add('chats', 'leve', 'zen', 'El no contestar de inmediato fue un ejercicio consciente de desconexión del ruido del mundo para darte una respuesta pura.', 60, 'Manda un sticker pacífico.');

add('chats', 'media', 'formal', 'He desactivado temporalmente las aplicaciones de mensajería instantánea para atender asuntos laborales con dedicación exclusiva.', 93, 'Quita el doble check azul y la última hora.');
add('chats', 'media', 'cientifico', 'He entrado en un periodo de desintoxicación dopaminérgica para reducir los picos de cortisol inducidos por la luz azul de la pantalla.', 85, 'Dilo con tono de neurólogo de élite.');
add('chats', 'media', 'dramatico', '¡Mi teléfono se precipitó al abismo del lavabo y resucitó milagrosamente tras tres días enterrado en un sarcófago de arroz!', 95, 'La clásica excusa del arroz siempre tiene 95% de éxito.');
add('chats', 'media', 'caradura', 'Vi tu audio de 8 minutos y sinceramente preferí esperar a que saliera la adaptación en película de Netflix.', 89, 'Los audios de más de 3 minutos no tienen defensa moral.');
add('chats', 'media', 'conspiranoico', 'Sospecho que mi cuenta de WhatsApp fue clonada en un servidor remoto de Europa del Este y he tenido que formatear el terminal.', 76, 'Di que te hackearon.');
add('chats', 'media', 'zen', 'El silencio es la respuesta más elocuente cuando las palabras del teclado no alcanzan la profundidad del ser.', 50, 'Deja que pasen 24 horas más.');


// ==========================================
// 7. DINERO & COMPRAS
// ==========================================

// LEVE / MEDIA
add('dinero', 'leve', 'formal', 'Por motivos de conciliación bancaria y revisión de cargos indebidos en mi cuenta corriente, aplazaré la transferencia del importe correspondiente a mañana.', 94, 'Muestra la app del banco con saldo oculto.');
add('dinero', 'leve', 'cientifico', 'El protocolo de comunicación cifrada de Bizum ha entrado en tiempo de espera por saturación en la pasarela de pagos de Redsys.', 91, 'El fallo de Bizum es el comodín financiero del siglo XXI.');
add('dinero', 'leve', 'dramatico', '¡Los impuestos y las facturas inesperadas han saqueado mi tesorería cual corsarios desalmados! Esperaré al ingreso de la nómina.', 90, 'Suspira al mirar la cartera.');
add('dinero', 'leve', 'caradura', 'Te iba a hacer el Bizum pero pensé que el dinero arruina las amistades verdaderas y yo valoro demasiado lo nuestro.', 55, 'Paga tú la siguiente ronda de cañas.');
add('dinero', 'leve', 'conspiranoico', 'Hacienda está monitorizando los micropagos entre particulares con inteligencia artificial; es más seguro que me invites hoy tú.', 70, 'Baja la voz y mira hacia las esquinas.');
add('dinero', 'leve', 'zen', 'El desapego del dinero material es el primer paso hacia la iluminación. Tú hoy das y el universo te lo devolverá multiplicado.', 35, 'Sonríe con beatitud.');

add('dinero', 'media', 'formal', 'Por reestructuración de mi presupuesto mensual en fondos de amortización obligatoria, me resulta imposible participar en el fondo común.', 92, 'Usa lenguaje macroeconómico.');
add('dinero', 'media', 'cientifico', 'Mi liquidez disponible ha alcanzado el cero absoluto kelvin tras abonar el seguro del coche y el IBI.', 88, 'Enseña un extracto bancario con cara de víctima.');
add('dinero', 'media', 'dramatico', '¡La ruina económica se cierne sobre mis finanzas como una nube negra! Debo sobrevivir a base de arroz y pasta durante 10 días.', 93, 'Rechaza pedir postre con resignación.');
add('dinero', 'media', 'caradura', 'Tengo dinero en la cuenta pero está en plazo fijo a 10 años en las Islas Caimán y si lo saco me penalizan un 80%.', 40, 'Hazte el misterioso con inversiones en bolsa.');
add('dinero', 'media', 'conspiranoico', 'El banco me ha bloqueado la tarjeta por movimientos sospechosos tras comprar un kebab a las 4 de la mañana.', 92, 'Muy creíble porque los bancos lo hacen de verdad.');
add('dinero', 'media', 'zen', 'La verdadera riqueza no se mide en euros sino en momentos compartidos; por eso hoy me invitas tú a cenar.', 30, 'Abraza a tu amigo con afecto.');


// ==========================================
// 8. ESTUDIOS & UNIVERSIDAD
// ==========================================

// LEVE / MEDIA / CRITICA
add('estudios', 'leve', 'formal', 'Estimado profesor: el archivo adjunto con la entrega del trabajo sufrió una corrupción de metadatos durante la subida al campus virtual a las 23:59.', 94, 'Envía un archivo .docx corrupto abriéndolo con el Bloc de notas y borrando caracteres.');
add('estudios', 'leve', 'cientifico', 'El algoritmo de detección de plagio del campus ha marcado como coincidencia del 98% citas que corresponden al propio temario de la asignatura.', 88, 'Di que es un falso positivo informático.');
add('estudios', 'leve', 'dramatico', '¡Tres noches en vela entregado a la ciencia y la pluma para que un fallo de corriente en mi barrio borrara el último capítulo!', 92, 'Llega a clase con ojeras bien marcadas.');
add('estudios', 'leve', 'caradura', 'Estudié tanto para el examen que sufrí una amnesia temporal por exceso de conocimientos acumulados.', 38, 'Pide revisión de examen con optimismo.');
add('estudios', 'leve', 'conspiranoico', 'El profesor puso preguntas de temas que dijo explícitamente en clase que no iban a entrar para filtrar a los alumnos no dóciles.', 85, 'Todos tus compañeros de clase te apoyarán.');
add('estudios', 'leve', 'zen', 'El conocimiento no se demuestra con exámenes cronometrados sino con la comprensión holística de la existencia.', 35, 'Cita a Platón de memoria.');

add('estudios', 'media', 'formal', 'Solicito respetuosamente el aplazamiento de la convocatoria extraordinaria por coincidencia con una intervención médica prescrita.', 95, 'Presenta el justificante médico reglamentario.');
add('estudios', 'media', 'cientifico', 'Mi disco duro secundario donde almacenaba la bibliografía del TFG ha sufrido un fallo electromecánico irrecuperable en el cabezal de lectura.', 90, 'Lleva el portátil al despacho del tutor.');
add('estudios', 'media', 'dramatico', '¡La presión académica ha doblegado mis fuerzas! Necesito 48 horas de tregua para rehacer mis argumentos y defender el honor del trabajo.', 89, 'Habla con devoción por la materia.');
add('estudios', 'media', 'caradura', 'Iba a estudiar el domingo pero la técnica Pomodoro me dijo que descansara 25 minutos y se me hicieron las 3 de la mañana.', 70, 'Compártelo en el grupo de clase.');
add('estudios', 'media', 'conspiranoico', 'El campus virtual se cae a propósito los domingos por la noche para que los alumnos aprendan a tolerar la frustración laboral.', 80, 'Muestra capturas de error 504 Gateway Timeout.');
add('estudios', 'media', 'zen', 'Suspender este parcial es solo un paso en el camino del aprendizaje. El fracaso es la semilla del éxito futuro.', 45, 'Acepta la nota con una reverencia budista.');

// Fill remaining combinations to make sure every single triple has at least 3-4 distinct variations!
// Generate safety padding for any missing combo
ambitos.forEach(a => {
  gravedades.forEach(g => {
    tonos.forEach(t => {
      const existing = catalogo.filter(c => c.ambito === a.id && c.gravedad === g.id && c.tono === t.id);
      if (existing.length < 3) {
        // Add dynamic filler excuses with witty content
        const defaultQuotes = [
          {
            txt: `Por una reconfiguración imprevista en mis protocolos prioritarios en el ámbito de ${a.nombre}, me veo en la necesidad de reprogramar esta acción.`,
            cons: 'Mantén la compostura y no des explicaciones no solicitadas.',
            cred: 88
          },
          {
            txt: `Una alteración temporal en el flujo habitual de ${a.nombre} me ha impedido culminar este compromiso con el estándar habitual de excelencia.`,
            cons: 'Ofrece una solución alternativa para dentro de 48 horas.',
            cred: 84
          },
          {
            txt: `Los acontecimientos recientes en el sector de ${a.nombre} han alcanzado un punto crítico que requería mi intervención personal inmediata.`,
            cons: 'Apaga las notificaciones durante un par de horas.',
            cred: 86
          },
          {
            txt: `He decidido aplicar el principio de prudencia máxima ante la situación de ${a.nombre} para evitar daños colaterales mayores.`,
            cons: 'Acompaña con una mirada seria y profesional.',
            cred: 82
          }
        ];

        let idx = 0;
        while (catalogo.filter(c => c.ambito === a.id && c.gravedad === g.id && c.tono === t.id).length < 3) {
          const item = defaultQuotes[idx % defaultQuotes.length];
          add(a.id, g.id, t.id, item.txt, item.cred, item.cons);
          idx++;
        }
      }
    });
  });
});

const output = {
  ambitos,
  gravedades,
  tonos,
  catalogo
};

const excusasPath = path.join(__dirname, '..', 'data', 'humor', 'excusas.json');
fs.writeFileSync(excusasPath, JSON.stringify(output, null, 2), 'utf8');

console.log(`Successfully generated ${catalogo.length} excuses in excusas.json across all combinations!`);
