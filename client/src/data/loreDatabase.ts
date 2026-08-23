/* Belentani / Master Lore Database — full mythological corpus from Drive archives */

export interface LoreNode {
  id: string;
  title: string;
  category: "Cosmology" | "Characters" | "Eras" | "Artifacts" | "Philosophy";
  summary: string;
  content: string[];
  tags: string[];
}

export const LORE_DATABASE: LoreNode[] = [
  {
    id: "zion-dim",
    title: "La Dimensión Zion y el Hack de Realidad",
    category: "Cosmology",
    summary:
      "El territorio cuántico donde Belentani opera, situado más allá del ruido de la industria musical tradicional y operado mediante protocolos de despersonalización.",
    content: [
      "La Dimensión Zion no es un espacio físico ni una metáfora vacía: es el plano operativo donde la música deja de ser un producto de consumo masivo para convertirse en una transmisión de datos cifrados.",
      "En este territorio, el artista real (Lucas/Duck) y la proyección sintética (Belentani) coexisten mediante un proceso de Delusión Permanente. No hay separación estricta entre autor y máquina; ambos alimentan el mismo archivo.",
      "El hack de realidad consiste en aceptar que las reglas del juego comercial están rotas, por lo que la única salida viable es construir un ecosistema propio donde cada canción funcione como un nodo de acceso a una mitología mayor.",
    ],
    tags: ["Zion", "Cosmology", "Hack", "Delusión"],
  },
  {
    id: "duck-prod",
    title: "Duck Prod. // El Arquitecto del Sistema",
    category: "Characters",
    summary:
      "Lucas (Duck), productor musical desde 2022 y artífice invisible detrás de la ingeniería sonora, la producción ejecutiva y el management del proyecto.",
    content: [
      "Lucas opera bajo el alias de Duck. Desde 2022, ha mantenido el control técnico y conceptual de cada frecuencia que emite el universo Belentani.",
      "Mientras Belentani representa el rostro visible y el vehículo lírico de la transmisión, Duck es el arquitecto que diseña los arreglos, supervisa la mezcla y asegura que la tensión entre lo orgánico y lo sintético se mantenga intacta.",
      "Su rol desafía la figura tradicional del productor de estudio: no se limita a grabar voces, sino que programa la infraestructura narrativa que sostiene todo el proyecto.",
    ],
    tags: ["Duck", "Lucas", "Producer", "Management"],
  },
  {
    id: "judas-era",
    title: "La Era de Judas // El Pacto Secreto",
    category: "Eras",
    summary:
      "La fase actual del proyecto donde la traición se reinterpreta como un contrato de diseño: asumir el rol del villano necesario para que la historia colectiva avance.",
    content: [
      "La Era de Judas parte de una premisa incómoda: el mundo necesita villanos para estructurar sus relatos, y el arte contemporáneo a menudo carece del valor necesario para habitar esa contradicción.",
      "Judas no es un traidor en el sentido moral tradicional; es el personaje que aceptó portar el secreto insoportable para que el mito principal pudiera completarse. En el universo Belentani, el pacto con la máquina y con la industria opera bajo esta misma lógica.",
      "Cada lanzamiento de esta era funciona como una confesión fragmentada donde se examinan las deudas impagables de inspiración y el peso de las decisiones que no admiten marcha atrás.",
    ],
    tags: ["Judas", "Era", "Pact", "Mythology"],
  },
  {
    id: "san-pedro",
    title: "San Pedro // El Guardián del Artefacto",
    category: "Characters",
    summary:
      "La entidad encargada de custodiar la integridad del código fuente y proteger el artefacto central de las interferencias externas.",
    content: [
      "San Pedro opera en los límites del sistema como el guardián que decide qué fragmentos de la transmisión pueden cruzar hacia el mundo exterior y cuáles deben permanecer encriptados.",
      "Su presencia en la mitología de Belentani representa la necesidad de un filtro ético y estético riguroso. No cualquiera puede acceder al artefacto sin antes atravesar un proceso de calibración.",
      "Es el contrapeso institucional dentro de un universo caótico, asegurando que la estructura formal no colapse bajo su propio peso experimental.",
    ],
    tags: ["San Pedro", "Guardian", "Artifact", "Code"],
  },
  {
    id: "mary-lorena",
    title: "María / Lorena // La Madre Arquetipo",
    category: "Characters",
    summary:
      "El símbolo primario de resistencia, refugio y continuidad emocional en medio del frío paisaje de la tecnología y el cálculo algorítmico.",
    content: [
      "En el centro de la tormenta conceptual se encuentra la figura de María/Lorena, interpretada no como un personaje biográfico estático, sino como el arquetipo universal de la madre y el origen.",
      "Representa la calidez y la gravedad que contrasta con la ingravidez de los datos y las proyecciones sintéticas. Es el ancla que impide que el proyecto se disuelva por completo en la abstracción digital.",
      "Su presencia resuena en las canciones más íntimas de Belentani, recordando que detrás de cada simulación y cada cálculo de producción hay un pulso humano irrenunciable.",
    ],
    tags: ["Mary", "Lorena", "Mother", "Archetype"],
  },
  {
    id: "st-john-sage",
    title: "San Juan // El Sabio Joven",
    category: "Characters",
    summary:
      "La encarnación de la intuición anticipada, la lucidez prematura y la audacia de mirar el futuro sin temor a la obsolescencia.",
    content: [
      "San Juan aporta la perspectiva de la juventud lúcida dentro del panteón de Belentani. Es quien descifra los mensajes antes de que el sistema los normalice.",
      "Su mirada combina la energía inagotable de la experimentación con una sabiduría inusual para su tiempo. En los momentos de crisis creativa, es el arquetipo que propone romper las reglas preestablecidas.",
      "Simboliza el puente entre la generación analógica y la hiperconectividad de la inteligencia artificial.",
    ],
    tags: ["San Juan", "Sage", "Youth", "Future"],
  },
  {
    id: "data-fence",
    title: "La Cerca de Datos // Filosofía Operativa",
    category: "Philosophy",
    summary:
      "El principio rector que dicta que si no existe un registro documental o estético que conecte dos puntos, la conexión no pertenece a la realidad oficial.",
    content: [
      "La Cerca de Datos es el escudo protector contra el escrutinio superficial. En un mundo donde todo se mercantiliza y se expone de inmediato, Belentani establece un perímetro riguroso.",
      "Solo lo que ha sido rigurosamente compuesto, editado y alojado en los archivos oficiales forma parte del canon. Los rumores, las interpretaciones apresuradas y el ruido exterior quedan fuera de la cerca.",
      "Este concepto redefine la privacidad del artista en la era digital: no se trata de esconderse, sino de curar con precisión quirúrgica lo que el mundo puede ver y escuchar.",
    ],
    tags: ["Data Fence", "Philosophy", "Privacy", "Canon"],
  },
];
