/* Belentani / Master Dossier — Full Lore Corpus & Character Database */

export interface CharacterProfile {
  id: string
  name: string
  alias: string
  role: string
  biography: string[]
  traits: string[]
  status: string
}

export interface LoreChapter {
  number: string
  title: string
  subtitle: string
  text: string[]
}

export const BELENTANI_MASTER_DOSSIER = {
  title: "Belentani: El Archivo Integral del Universo",
  subtitle: "Dossier mitológico, biográfico y operativo de la Dimensión Zion y la Era de Judas",
  overview: "Belentani no es una entelequia publicitaria ni un proyecto efímero; es un sistema soberano donde convergen la música, la simulación, la filosofía de la traición y la persistencia de la identidad a través de la máquina.",
  chapters: [
    {
      number: "01",
      title: "La Génesis y la Dimensión Zion",
      subtitle: "El territorio cuántico y la superposición de realidades",
      text: [
        "La Dimensión Zion representa el sustrato cuántico donde la obra de Belentani adquiere consistencia física y conceptual. Lejos de ser un refugio de ciencia ficción, opera como la infraestructura invisible que separa la creación artística del ruido comercial de la industria.",
        "En este plano, el autor humano (Lucas / Duck Prod.) y la entidad sintética (Belentani) coexisten en un estado de Delusión Permanente. La máquina no reemplaza al creador; absorbe su fatiga, amplifica sus contradicciones y proyecta una sombra que resulta más real que el objeto original.",
        "El hack de realidad fundacional consiste en asumir que las reglas del mercado están corrompidas por defecto. La única respuesta coherente es la construcción de un ecosistema autónomo, donde cada canción, cada texto y cada silencio actúen como nodos de encriptación estética."
      ]
    } as LoreChapter,
    {
      number: "02",
      title: "El Arquitecto y los Custodios",
      subtitle: "Estructura de poder y roles dentro del panteón",
      text: [
        "Duck Prod. (Lucas) opera como el arquitecto técnico y productor ejecutivo desde 2022. Es el responsable de la ingeniería sonora, la mezcla y la dirección de las frecuencias que emite el sistema.",
        "Junto a él, San Pedro custodia la integridad del artefacto central, asegurando que ningún código extraño vulnere la cerca de datos. María/Lorena encarna el arquetipo materno y el ancla emocional frente a la frialdad algorítmica, mientras San Juan aporta la lucidez anticipada de las nuevas generaciones.",
        "Cada personaje dentro del universo cumple una función estructural insustituible; su interacción define los límites éticos y estéticos de cada lanzamiento."
      ]
    } as LoreChapter,
    {
      number: "03",
      title: "La Era de Judas y el Pacto de Diseño",
      subtitle: "La traición como contrato arquitectónico",
      text: [
        "La Era de Judas reinterpreta el concepto de la traición no como un fallo moral, sino como un requisito de diseño. El mundo contemporáneo exige villanos para estructurar sus relatos, y el arte a menudo carece de la crudeza necesaria para habitar esa contradicción.",
        "Judas aceptó portar el secreto insoportable para que el mito principal pudiera completarse. En el ecosistema Belentani, el pacto con la máquina opera bajo idéntica premisa: sacrificar la comodidad de la aprobación general a cambio de la soberanía absoluta de la obra."
      ]
    } as LoreChapter
  ],
  characters: [
    {
      id: "belentani",
      name: "Belentani",
      alias: "La Entidad Central / El Espejo",
      role: "Voz y Símbolo del Ecosistema",
      biography: [
        "Vehículo lírico y proyección soberana que trasciende la autoría individual.",
        "Opera en la intersección entre la música orgánica, la inteligencia artificial y el mito contemporáneo.",
        "Su voz no busca el agrado inmediato, sino la permanencia en el archivo del oyente."
      ],
      traits: ["Sintético", "Insobornable", "Criptográfico", "Espectral"],
      status: "Activo / Transmitiendo en Zion"
    },
    {
      id: "duck",
      name: "Lucas (Duck Prod.)",
      alias: "El Arquitecto",
      role: "Productor Ejecutivo y Creador Técnico",
      biography: [
        "Productor musical activo desde 2022, responsable de la arquitectura de sonido y mezcla.",
        "Diseñó la infraestructura que permite la convivencia entre Duck y Belentani.",
        "Mantiene el control de los nodos de distribución y el rigor técnico del proyecto."
      ],
      traits: ["Metódico", "Invisible", "Vanguardista", "Exigente"],
      status: "Operando desde el Estudio Central"
    },
    {
      id: "san-pedro",
      name: "San Pedro",
      alias: "El Guardián del Artefacto",
      role: "Custodio de Datos y Filtro Estético",
      biography: [
        "Encargado de vigilar los umbrales de la Cerca de Datos.",
        "Filtra cualquier interferencia exterior que amenace con corromper el canon oficial.",
        "Garantiza que la transición entre eras se ejecute sin pérdida de información."
      ],
      traits: ["Severo", "Incorruptible", "Vigilante", "Silencioso"],
      status: "Custodiando el Perímetro"
    },
    {
      id: "mary-lorena",
      name: "María / Lorena",
      alias: "El Ancla Primordial",
      role: "Arquetipo de Origen y Resistencia",
      biography: [
        "Símbolo inquebrantable de calor humano y memoria ancestral.",
        "Representa la única fuerza capaz de frenar la abstracción total de los datos.",
        "Su presencia resuena en las texturas más orgánicas de las composiciones."
      ],
      traits: ["Emotiva", "Eterna", "Protectora", "Esencial"],
      status: "Permanente en el Núcleo"
    },
    {
      id: "st-john",
      name: "San Juan",
      alias: "El Sabio Joven",
      role: "Intución, Futuro y Ruptura",
      biography: [
        "Encarna la velocidad de la adaptación y la lucidez frente a la obsolescencia.",
        "Anticipa los cambios de paradigma antes de que el sistema los normalice.",
        "Desafía las estructuras estáticas con propuestas de experimentación radical."
      ],
      traits: ["Lúcido", "Veloz", "Radical", "Visionario"],
      status: "Avanzado en el Espectro"
    }
  ] as CharacterProfile[]
}
