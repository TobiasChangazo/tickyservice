/* =========================================================
   TickyService — Datos de las guías
   Única fuente de verdad: la usan el listado (guias.js, home y
   guias.html) y la página de detalle (guia.js → guia.html?g=slug).

   Cómo agregar una guía: copiar un bloque de GUIAS y cambiarlo.
   Campos:
   - slug        identificador para la URL (sin espacios ni tildes)
   - titulo, categoria ('notebook' | 'pc' | 'joystick' | 'consola')
   - tipo        'Guía' | 'Checklist' | 'Video'
   - duracion    texto libre ("5 min de lectura", "7 min de video")
   - nivel       1 = podés hacerlo vos · 2 = requiere herramientas · 3 = taller
   - destacada   true → aparece primero (y en el home)
   - resumen     párrafo de entrada del detalle
   - video       OPCIONAL. ID de YouTube (lo que va después de "v=").
                 '' = video pendiente (muestra un recuadro "en preparación").
                 Sin el campo = la guía no tiene video.
   - necesitas   lista de herramientas / cosas (vacía = "nada especial")
   - tiempo      tiempo estimado
   - pasos       [{ titulo, texto }]
   - frena       OPCIONAL { titulo, texto }: cuándo parar y traerlo
   - tienda      OPCIONAL texto del botón a la tienda
   ========================================================= */
window.TICKY_GUIAS = (function(){

const CATEGORIAS = [
  { id: 'notebook', nombre: 'Notebook', icono: 'laptop' },
  { id: 'pc',       nombre: 'PC',       icono: 'cpu' },
  { id: 'joystick', nombre: 'Joystick', icono: 'gamepad-2' },
  { id: 'consola',  nombre: 'Consola',  icono: 'gamepad' },
];

const NIVELES = [
  { id: 0, nombre: 'Todas' },
  { id: 1, nombre: 'Podés hacerlo vos',     barra: 'ok' },
  { id: 2, nombre: 'Requiere herramientas', barra: 'warn' },
  { id: 3, nombre: 'Es trabajo de taller',  barra: 'brand' },
];

const GUIAS = [

  /* ---------------- NOTEBOOK ---------------- */
  {
    slug: 'notebook-no-enciende',
    titulo: 'Notebook que no enciende: primeros pasos',
    categoria: 'notebook', tipo: 'Guía', duracion: '5 min de lectura', nivel: 1, destacada: true,
    resumen: 'Antes de pensar en la placa, hay tres o cuatro cosas que resuelven la mayoría de los casos y no requieren abrir nada. Hacelas en orden.',
    necesitas: ['El cargador original', 'Un monitor o TV con HDMI (opcional)'],
    tiempo: '10 a 15 minutos',
    pasos: [
      { titulo: 'Revisá el cargador', texto: 'Fijate si la luz del cargador o la de carga de la notebook prende. Probá otro enchufe (no zapatilla) y revisá el cable en toda su longitud: los cortes suelen estar cerca de la ficha.' },
      { titulo: 'Descargá la energía residual', texto: 'Desenchufá, sacá la batería si es extraíble y mantené apretado el botón de encendido 30 segundos. Volvé a conectar solo el cargador (sin batería) e intentá prender.' },
      { titulo: 'Distinguí "no prende" de "no da imagen"', texto: 'Si escuchás el ventilador, ves luces en el teclado o suena el arranque de Windows, la notebook prende: el problema es la pantalla. Conectala a un monitor por HDMI para confirmarlo.' },
      { titulo: 'Anotá luces y pitidos', texto: 'Muchas marcas indican la falla con parpadeos o pitidos en un patrón. Contá cuántos son: nos ahorra tiempo de diagnóstico cuando nos escribís.' },
    ],
    frena: { titulo: 'Si pasa algo de esto, no sigas probando', texto: 'Se le cayó líquido · Olor a quemado · El cargador calienta de más o chispea. En esos casos, cuanto menos se enchufe, mejor.' },
  },
  {
    slug: 'backup-antes-del-taller',
    titulo: 'Backup antes de llevar el equipo al taller',
    categoria: 'notebook', tipo: 'Checklist', duracion: '3 min de lectura', nivel: 1, destacada: false,
    resumen: 'Cuidamos tus datos, pero algunas reparaciones implican cambiar el disco o reinstalar el sistema. Con este checklist no perdés nada importante.',
    necesitas: ['Un pendrive o disco externo', 'O una cuenta en la nube (Google Drive, OneDrive)'],
    tiempo: '20 a 40 minutos según cuántos archivos tengas',
    pasos: [
      { titulo: 'Copiá tus carpetas personales', texto: 'Escritorio, Documentos, Imágenes, Videos y Descargas. Ahí está el 90% de lo importante. No hace falta copiar "Archivos de programa".' },
      { titulo: 'Sincronizá el navegador', texto: 'Iniciá sesión en Chrome, Edge o Firefox con tu cuenta para guardar favoritos y contraseñas. Si no usás cuenta, exportá los favoritos a un archivo.' },
      { titulo: 'Anotá licencias y claves', texto: 'Office, antivirus, programas pagos: buscá los mails de compra o las claves de producto. Sin eso, reinstalarlos puede ser un problema.' },
      { titulo: 'Verificá la copia', texto: 'Abrí un par de archivos desde el pendrive o la nube. Una copia que no se probó no es una copia.' },
      { titulo: 'Dejanos la contraseña de usuario', texto: 'Para probar el equipo después de repararlo necesitamos entrar. Si preferís no darla, avisanos y lo coordinamos.' },
    ],
  },
  {
    slug: 'bateria-notebook-no-carga',
    titulo: 'Batería de notebook que no carga: qué revisar',
    categoria: 'notebook', tipo: 'Guía', duracion: '4 min de lectura', nivel: 1, destacada: true,
    resumen: 'Que diga "enchufado, no se está cargando" no siempre es la batería. Muchas veces es el cargador, la ficha o un driver.',
    necesitas: ['El cargador original'],
    tiempo: '15 minutos',
    pasos: [
      { titulo: 'Confirmá que el cargador sea el correcto', texto: 'Mirá la etiqueta: los watts (W) tienen que ser iguales o mayores a los del original. Un cargador genérico más chico puede mantenerla prendida pero no cargar.' },
      { titulo: 'Revisá la ficha', texto: 'Si tenés que mover el cable para que cargue, el problema es la ficha o el conector de la notebook, no la batería.' },
      { titulo: 'Reiniciá el driver de batería', texto: 'En Windows: Administrador de dispositivos → Baterías → desinstalá "Batería con método de control compatible con ACPI de Microsoft" y reiniciá. Se reinstala solo.' },
      { titulo: 'Mirá el estado real de la batería', texto: 'Abrí una terminal y escribí powercfg /batteryreport. Compará "Design capacity" con "Full charge capacity": si la segunda es menos de la mitad, la batería está gastada.' },
    ],
    frena: { titulo: 'Batería hinchada: dejá de usarla', texto: 'Si el touchpad se levanta, la carcasa no cierra bien o se ve deformada, la batería está inflada. No la cargues ni la pinches. Traela lo antes posible.' },
    tienda: 'Ver baterías en la tienda',
  },

  /* ---------------- PC ---------------- */
  {
    slug: 'pasta-termica',
    titulo: 'Cómo limpiar la pasta térmica sin arruinar nada',
    categoria: 'pc', tipo: 'Video', duracion: '8 min de video', nivel: 2, destacada: true,
    resumen: 'Si el equipo se apaga solo, hace ruido de turbina o se traba en juegos, lo más probable es temperatura. Esto se resuelve en casa si tenés las herramientas y paciencia. Si en algún paso dudás, frená: desarmado a medias es peor que sucio.',
    video: '',
    necesitas: ['Destornillador Phillips PH0', 'Alcohol isopropílico 99%', 'Paño sin pelusa', 'Pasta térmica (1g alcanza)', 'Púa plástica o tarjeta vieja'],
    tiempo: '40 a 60 minutos la primera vez',
    pasos: [
      { titulo: 'Confirmá que sea temperatura', texto: 'Abrí un monitor de temperatura y dejalo diez minutos con uso normal. Arriba de 90 °C en reposo prolongado ya es señal. Si está fresco y igual se apaga, el problema es otro y no hace falta que abras nada.' },
      { titulo: 'Desarmá con orden', texto: 'Desenchufá, sacá la batería si es extraíble y descargá la estática tocando algo metálico. Los tornillos no son todos iguales: pegalos sobre una hoja en el mismo orden en que salieron.' },
      { titulo: 'Limpiá la pasta vieja', texto: 'Alcohol isopropílico y paño sin pelusa, nunca papel de cocina ni objetos con filo. El die tiene que quedar espejado, sin restos grises en los bordes.' },
      { titulo: 'Aplicá la nueva, poca', texto: 'Una gota del tamaño de una arveja en el centro. La presión del disipador la reparte sola. Más pasta no enfría más: aísla y chorrea a los costados.' },
      { titulo: 'Cerrá y volvé a medir', texto: 'Ajustá los tornillos del disipador en cruz, de a poco. Repetí la medición del paso 1: tendrías que ver entre 15 y 25 °C menos.' },
    ],
    frena: { titulo: 'Si aparece alguna de estas tres, cerrá y traelo', texto: 'Tornillos pasados o cabeza redondeada · Fichas planas que no salen con presión suave · Olor a quemado o manchas oscuras en la placa. Ninguna de las tres se arregla con fuerza.' },
    tienda: 'Ver el kit en la tienda',
  },
  {
    slug: 'pc-lenta',
    titulo: 'PC lenta: 6 cosas para probar antes de traerla',
    categoria: 'pc', tipo: 'Checklist', duracion: '4 min de lectura', nivel: 1, destacada: true,
    resumen: 'La mayoría de las PC lentas no están rotas: están cargadas. Probá esto en orden y medí si mejora antes de gastar plata.',
    necesitas: [],
    tiempo: '30 minutos',
    pasos: [
      { titulo: 'Sacá programas del inicio', texto: 'Ctrl + Shift + Esc → pestaña Inicio. Deshabilitá todo lo que no necesites apenas prendés (launchers de juegos, Spotify, actualizadores).' },
      { titulo: 'Liberá espacio en el disco', texto: 'Si el disco C: tiene menos del 15% libre, Windows se pone lento. Usá "Liberador de espacio en disco" y vaciá Descargas.' },
      { titulo: 'Terminá las actualizaciones', texto: 'Windows Update a medio instalar consume recursos en segundo plano. Dejalo terminar y reiniciá.' },
      { titulo: 'Hacé un análisis completo', texto: 'Seguridad de Windows → Protección antivirus → Opciones de examen → Examen completo. Tarda, pero descarta malware.' },
      { titulo: 'Mirá qué la está usando', texto: 'En el Administrador de tareas, ordená por CPU, Memoria y Disco. Si el disco está al 100% todo el tiempo, casi seguro es un disco mecánico (HDD) pidiendo un SSD.' },
      { titulo: 'Revisá la temperatura', texto: 'Si se pone lenta después de un rato de uso, puede estar bajando la velocidad por calor. Ahí conviene limpieza y pasta térmica.' },
    ],
  },
  {
    slug: 'pc-no-bootea',
    titulo: 'PC no bootea: pantalla negra al encender',
    categoria: 'pc', tipo: 'Guía', duracion: '6 min de lectura', nivel: 3, destacada: false,
    resumen: 'Ventiladores girando y pantalla negra puede ser desde un cable mal puesto hasta una placa. Hay chequeos seguros para hacer en casa; si no alcanzan, es trabajo de taller.',
    necesitas: ['Destornillador Phillips (para abrir el gabinete)'],
    tiempo: '15 a 20 minutos de chequeo',
    pasos: [
      { titulo: 'Descartá el monitor', texto: 'Revisá que el monitor esté en la entrada correcta (HDMI 1, DP…) y que el cable esté conectado a la placa de video, no a la salida de la placa madre si tenés placa dedicada.' },
      { titulo: 'Anotá pitidos y luces', texto: 'Muchas placas madre tienen luces de diagnóstico (CPU, DRAM, VGA, BOOT). La que queda prendida indica dónde se traba el arranque.' },
      { titulo: 'Reacomodá la memoria RAM', texto: 'Con la PC desenchufada, sacá los módulos de RAM y volvé a colocarlos hasta que hagan clic. Si tenés dos, probá con uno solo.' },
      { titulo: 'Reseteá la BIOS', texto: 'Con la PC desenchufada, sacá la pila redonda de la placa madre 5 minutos y volvé a ponerla. Vuelve la configuración de fábrica.' },
    ],
    frena: { titulo: 'Hasta acá llega lo que conviene hacer en casa', texto: 'Si después de esto sigue sin imagen, el problema puede ser fuente, placa de video, placa madre o procesador. Probar piezas sin repuestos para comparar suele terminar en más gastos.' },
  },
  {
    slug: 'limpiar-polvo-pc',
    titulo: 'Cómo limpiar el polvo por dentro de tu PC',
    categoria: 'pc', tipo: 'Video', duracion: '7 min de video', nivel: 2, destacada: false,
    resumen: 'El polvo tapa disipadores y ventiladores, sube la temperatura y el ruido. Una limpieza cada 6 a 12 meses alcanza.',
    video: '',
    necesitas: ['Destornillador Phillips', 'Aire comprimido o sopladora', 'Pincel de cerda suave', 'Un lugar ventilado (mejor afuera)'],
    tiempo: '20 a 30 minutos',
    pasos: [
      { titulo: 'Apagá, desenchufá y esperá', texto: 'Apagá la fuente desde su interruptor, desenchufá y apretá el botón de encendido unos segundos para descargarla.' },
      { titulo: 'Trabajá afuera o en un lugar ventilado', texto: 'Va a salir mucho polvo. Abrí la tapa lateral y apoyá el gabinete acostado.' },
      { titulo: 'Trabá los ventiladores', texto: 'Sostené cada ventilador con un dedo mientras soplás. Si giran a mucha velocidad con el aire pueden generar corriente y dañarse.' },
      { titulo: 'Soplá de adentro hacia afuera', texto: 'Disipador del procesador, placa de video y fuente (desde afuera, sin abrirla). Ráfagas cortas, con la lata derecha.' },
      { titulo: 'Limpiá los filtros', texto: 'Si el gabinete tiene filtros de polvo magnéticos o deslizables, sacalos y lavalos con agua. Dejalos secar del todo antes de volver a ponerlos.' },
    ],
    frena: { titulo: 'Nunca uses aspiradora', texto: 'Genera estática que puede quemar componentes. Tampoco abras la fuente: aunque esté desenchufada guarda carga eléctrica peligrosa.' },
    tienda: 'Ver aire comprimido en la tienda',
  },
  {
    slug: 'ssd-o-pc-nueva',
    titulo: 'Cuándo conviene sumar un SSD en vez de comprar una PC nueva',
    categoria: 'pc', tipo: 'Guía', duracion: '5 min de lectura', nivel: 1, destacada: true,
    resumen: 'Si tu PC tiene disco mecánico, un SSD es la mejora más barata que hay: arranque en segundos y programas que abren al instante. Pero no siempre alcanza.',
    necesitas: [],
    tiempo: '5 minutos para averiguarlo',
    pasos: [
      { titulo: 'Fijate qué disco tenés', texto: 'Administrador de tareas → Rendimiento → Disco. Si dice "HDD", un SSD te va a cambiar la experiencia. Si ya dice "SSD", el cuello de botella está en otro lado.' },
      { titulo: 'Revisá la memoria RAM', texto: 'En la misma pestaña, Memoria. Con 8 GB o más estás bien para uso general. Con 4 GB conviene sumar RAM junto con el SSD.' },
      { titulo: 'Mirá la antigüedad del procesador', texto: 'Un procesador de los últimos 10 años (Intel Core de 4ª generación en adelante, o Ryzen) rinde bien con SSD. Más viejo que eso, la inversión rinde menos.' },
      { titulo: 'Elegí el tipo de SSD', texto: 'Casi todas las PC aceptan SSD SATA de 2,5". Si la placa tiene ranura M.2, un NVMe es más rápido. Consultanos el modelo y te decimos cuál entra.' },
    ],
    frena: { titulo: 'Cuándo no conviene', texto: 'Si el procesador es muy antiguo, la placa no admite más RAM o necesitás correr juegos o programas pesados actuales, el SSD mejora pero no alcanza. Ahí vale más pensar en un equipo nuevo.' },
    tienda: 'Ver SSD en la tienda',
  },
  {
    slug: 'sin-wifi',
    titulo: 'Sin wifi o internet: diagnóstico rápido',
    categoria: 'pc', tipo: 'Checklist', duracion: '3 min de lectura', nivel: 1, destacada: false,
    resumen: 'Primero hay que saber si el problema es la PC, el router o el proveedor. Este checklist lo resuelve en minutos.',
    necesitas: ['Otro dispositivo conectado a la misma red (celular)'],
    tiempo: '10 minutos',
    pasos: [
      { titulo: '¿Anda en otros dispositivos?', texto: 'Si el celular tampoco navega con el mismo wifi, el problema es el router o el proveedor, no la PC.' },
      { titulo: 'Reiniciá el router', texto: 'Desenchufalo 30 segundos y volvé a enchufar. Esperá 2 minutos a que las luces se estabilicen.' },
      { titulo: 'Olvidá la red y reconectá', texto: 'Configuración → Red → Wi-Fi → Administrar redes conocidas → Olvidar. Después conectate de nuevo con la contraseña.' },
      { titulo: 'Restablecé la configuración de red', texto: 'Configuración → Red e Internet → Configuración de red avanzada → Restablecimiento de red. La PC se reinicia y reinstala los adaptadores.' },
      { titulo: 'Probá con cable', texto: 'Si con cable de red anda y por wifi no, el problema es la placa wifi o su driver.' },
    ],
  },

  /* ---------------- JOYSTICK ---------------- */
  {
    slug: 'joystick-drift',
    titulo: 'Joystick con drift: cómo detectarlo y calibrarlo',
    categoria: 'joystick', tipo: 'Video', duracion: '6 min de video', nivel: 1, destacada: true,
    resumen: 'El drift es cuando el personaje o la cámara se mueven sin que toques la palanca. A veces se corrige con limpieza o calibración; si no, hay que cambiar el módulo.',
    video: '',
    necesitas: ['Una PC o celular para probar el joystick', 'Aire comprimido (opcional)'],
    tiempo: '15 minutos',
    pasos: [
      { titulo: 'Confirmá que sea drift', texto: 'Conectá el joystick a una PC y abrí una página de "gamepad tester". Con las palancas sueltas, los valores tendrían que quedar cerca de 0. Si se mueven solos, es drift.' },
      { titulo: 'Limpiá la base de la palanca', texto: 'Inclinala hacia un lado y soplá con aire comprimido en la base. Después hacé círculos completos con la palanca 20 o 30 veces. Repetí hacia los cuatro lados.' },
      { titulo: 'Calibrá si tu equipo lo permite', texto: 'Nintendo Switch: Configuración → Controles y sensores → Calibrar palancas. En PC, desde la configuración del juego o de Steam.' },
      { titulo: 'Subí la zona muerta', texto: 'Muchos juegos permiten ajustar la "zona muerta" de las palancas. Subirla un poco oculta un drift leve mientras tanto.' },
    ],
    frena: { titulo: 'Si vuelve a los pocos días', texto: 'El módulo analógico está gastado. Cambiarlo requiere desoldar y soldar: no es para hacer en casa. Lo hacemos en el taller.' },
  },
  {
    slug: 'joystick-bluetooth',
    titulo: 'Mi joystick no conecta por bluetooth',
    categoria: 'joystick', tipo: 'Guía', duracion: '4 min de lectura', nivel: 1, destacada: true,
    resumen: 'Casi siempre se resuelve reseteando el joystick y volviendo a vincularlo desde cero.',
    necesitas: ['El cable USB del joystick', 'Un clip (para joysticks de PlayStation)'],
    tiempo: '10 minutos',
    pasos: [
      { titulo: 'Cargalo del todo', texto: 'Con batería muy baja puede prender la luz pero no vincular. Dejalo 30 minutos conectado.' },
      { titulo: 'Olvidalo en el dispositivo', texto: 'En la consola, PC o celular, eliminá el joystick de la lista de dispositivos bluetooth.' },
      { titulo: 'Reseteá el joystick', texto: 'Los de PlayStation tienen un agujero chico atrás: apretá con un clip 5 segundos. Los de Xbox se reinician manteniendo el botón Xbox 10 segundos.' },
      { titulo: 'Ponelo en modo vinculación', texto: 'PlayStation: mantené Share/Create + PS hasta que la luz titile. Xbox: mantené el botón de vinculación (arriba) hasta que el logo parpadee rápido.' },
      { titulo: 'Probá por cable', texto: 'Si por cable anda y por bluetooth nunca vincula, puede ser la antena o la placa del joystick.' },
    ],
  },
  {
    slug: 'gatillos-botones-pegados',
    titulo: 'Limpieza de gatillos y botones pegados',
    categoria: 'joystick', tipo: 'Checklist', duracion: '3 min de lectura', nivel: 2, destacada: false,
    resumen: 'Botones duros o que no vuelven suelen ser suciedad o restos de bebida. Una limpieza por fuera resuelve la mayoría.',
    necesitas: ['Alcohol isopropílico 99%', 'Hisopos', 'Un palillo o púa plástica'],
    tiempo: '15 a 20 minutos',
    pasos: [
      { titulo: 'Apagá el joystick', texto: 'Desconectalo y apagalo antes de empezar.' },
      { titulo: 'Hisopo con alcohol en los bordes', texto: 'Humedecé el hisopo (no empapado) y pasalo por el contorno del botón o gatillo.' },
      { titulo: 'Presioná varias veces', texto: 'Apretá el botón 20 o 30 veces para que el alcohol afloje la suciedad de abajo. Repetí si hace falta.' },
      { titulo: 'Sacá restos del borde', texto: 'Con un palillo o púa plástica, pasá suave por la ranura. Nada de metal.' },
      { titulo: 'Dejá secar', texto: 'Esperá 10 minutos antes de volver a usarlo. El isopropílico evapora rápido y no deja residuo.' },
    ],
    frena: { titulo: 'Si se derramó bebida adentro', texto: 'Hay que abrirlo y limpiar la placa. Tiene flex muy finos y clips que se rompen fácil: mejor traelo.' },
  },

  /* ---------------- CONSOLA ---------------- */
  {
    slug: 'consola-no-lee-discos',
    titulo: 'La consola no lee discos: guía de limpieza',
    categoria: 'consola', tipo: 'Guía', duracion: '5 min de lectura', nivel: 2, destacada: true,
    resumen: 'Antes de pensar en el lector, descartá el disco y el software. Si el problema es el lector, a veces una limpieza alcanza.',
    necesitas: ['Paño de microfibra', 'Otro disco para comparar'],
    tiempo: '15 minutos',
    pasos: [
      { titulo: 'Probá otro disco', texto: 'Si otro juego anda, el problema es el disco, no la consola. Si ninguno anda, seguí.' },
      { titulo: 'Limpiá el disco', texto: 'Con paño de microfibra, en línea recta desde el centro hacia afuera. Nunca en círculos: una raya circular es la que más errores genera.' },
      { titulo: 'Actualizá el sistema', texto: 'Algunas fallas de lectura se corrigen con actualizaciones. Mirá la guía "Actualizar el sistema de tu consola".' },
      { titulo: 'Reconstruí la base de datos', texto: 'En PlayStation: apagala, mantené el botón de encendido hasta el segundo pitido para entrar en Modo seguro y elegí "Reconstruir base de datos". No borra tus partidas.' },
    ],
    frena: { titulo: 'No soples ni metas nada en la ranura', texto: 'Si hace ruido de engranajes, no expulsa el disco o no lee ninguno, el lector necesita limpieza interna o recambio. Eso implica abrirla: traela.' },
  },
  {
    slug: 'consola-se-apaga',
    titulo: 'Consola que se apaga sola jugando',
    categoria: 'consola', tipo: 'Guía', duracion: '5 min de lectura', nivel: 3, destacada: false,
    resumen: 'Si se apaga después de un rato de juego, casi siempre es temperatura. Podés mejorar la ventilación, pero la limpieza interna es trabajo de taller.',
    necesitas: [],
    tiempo: '10 minutos',
    pasos: [
      { titulo: 'Dale aire', texto: 'Dejá al menos 10 cm libres a los costados y atrás. Dentro de un mueble cerrado se recalienta aunque esté limpia.' },
      { titulo: 'Limpiá las rejillas por fuera', texto: 'Con la consola desenchufada, pasá un pincel o aire comprimido por las rejillas de entrada y salida de aire.' },
      { titulo: 'Enchufala directo a la pared', texto: 'Descartá zapatillas o alargues en mal estado: una caída de tensión también la apaga.' },
      { titulo: 'Anotá cuándo pasa', texto: 'Si se apaga siempre en el mismo juego o a los mismos minutos, contanos: ayuda a saber si es temperatura o fuente.' },
    ],
    frena: { titulo: 'Si sigue apagándose, es trabajo de taller', texto: 'La limpieza interna y el cambio de pasta térmica en consolas requieren desarmado completo. En PS5, además, el procesador usa metal líquido que no se debe tocar sin experiencia.' },
  },
  {
    slug: 'vincular-joystick-consola',
    titulo: 'Cómo vincular un joystick nuevo a tu consola',
    categoria: 'consola', tipo: 'Video', duracion: '3 min de video', nivel: 1, destacada: true,
    resumen: 'Un joystick nuevo o reseteado no aparece solo: hay que vincularlo una vez. Así se hace en cada consola.',
    video: '',
    necesitas: ['El cable USB del joystick (PlayStation)'],
    tiempo: '5 minutos',
    pasos: [
      { titulo: 'PlayStation 4 y 5', texto: 'Conectá el joystick a la consola con el cable USB y apretá el botón PS. Queda vinculado; después ya podés desconectar el cable.' },
      { titulo: 'Xbox One y Series', texto: 'Prendé la consola y apretá su botón de vinculación. En los 20 segundos siguientes, mantené el botón de vinculación del joystick hasta que el logo quede fijo.' },
      { titulo: 'Nintendo Switch', texto: 'En el menú: Controles → Cambiar agarre/orden. Con esa pantalla abierta, mantené el botón de sincronización del control hasta que aparezca.' },
      { titulo: 'Si no aparece', texto: 'Reseteá el joystick (ver la guía de bluetooth) y repetí.' },
    ],
  },
  {
    slug: 'actualizar-consola',
    titulo: 'Actualizar el sistema de tu consola paso a paso',
    categoria: 'consola', tipo: 'Checklist', duracion: '4 min de lectura', nivel: 1, destacada: false,
    resumen: 'Las actualizaciones corrigen errores de lectura, conexión y compatibilidad. Lo importante es no cortarlas a la mitad.',
    necesitas: ['Conexión a internet estable', 'O un pendrive (para PlayStation sin internet)'],
    tiempo: '15 a 30 minutos',
    pasos: [
      { titulo: 'Revisá el espacio libre', texto: 'Las actualizaciones necesitan varios GB. Si falta lugar, borrá algún juego que no uses (las partidas se conservan).' },
      { titulo: 'Buscá la actualización', texto: 'PlayStation: Configuración → Sistema → Software del sistema. Xbox: Configuración → Sistema → Actualizaciones. Switch: Configuración de la consola → Consola → Actualizar.' },
      { titulo: 'No la apagues durante la instalación', texto: 'Cortar la luz a la mitad puede dejar la consola sin arrancar. Si tenés cortes seguidos, esperá a un momento estable.' },
      { titulo: 'Sin internet (PlayStation)', texto: 'En una PC, descargá la actualización de la web oficial y guardala en un pendrive FAT32 o exFAT, dentro de la carpeta PS5/UPDATE (o PS4/UPDATE). Instalala desde el Modo seguro.' },
    ],
    frena: { titulo: 'Si falla y queda en error', texto: 'No repitas el proceso muchas veces seguidas. Anotá el código de error y escribinos.' },
  },
];

return { CATEGORIAS, NIVELES, GUIAS };

})();
