/**
 * Anti-Jão Extension - Constants
 * Palavras-chave, configurações padrão e listas de detecção
 */

// Lista principal de termos relacionados ao cantor Jão
const JAO_KEYWORDS = [
  // Nome principal e variações
  "jão",
  "joao vitor romania balbino",
  "joão vitor romania balbino",

  // Álbuns
  "lobos",
  "anti-heroi",
  "anti heroi",
  "super",
  "pirata",

  // Músicas populares
  "me beija com raiva",
  "vingança",
  "lindo demais",
  "idci",
  "eu quero ser como você",
  "alameda rua",
  "imperfeito",
  "clarão",
  "santo",
  "coringa",
  "a rua",
  "triste pra sempre",
  "feliz pra sempre",
  "só love",
  "não sou obrigado",
  "lágrimas de crocodilo",
  "meio termo",
  "você me perdeu",
  "vou morrer sozinho",
  "diferença",
  "vou ficar bem",
  "meninos e meninas",
  "me deixa",
  "esperança",
  "fim do mundo",
  "eu quero ser como voce",
  "a rua",

  // Turnês
  "turne pirata",
  "turnê pirata",
  "turne lobos",
  "turnê lobos",
  "turne super",
  "turnê super",

  // Termos associados
  "cantor jão",
  "musica do jão",
  "musica do joão",
  "show do jão",
  "show do joão",
  "jão cantor",
  "joão cantor",
  "jão musicas",
  "joão musicas",
  "jão album",
  "joão album",
  "jão clip",
  "joão clip",
  "jão letra",
  "joão letra",

  // Hashtags comuns
  "#jão",
  "#turnepirata",
  "#turnêpirata",
  "#superjao",
  "#superjoão",
  "#lobosjao",
  "#lobosjoão",
  "#jãoantiheroi",
  "#jãoantiherói",

  // Redes sociais e canais
  "jão no youtube",
  "joão no youtube",
  "jão no spotify",
  "joão no spotify",
  "jão oficial",
  "joão oficial",
  "canal do jão",
  "canal do joão",
];

// Termos de contexto que aumentam a pontuação de relevância
const CONTEXT_TERMS = [
  "cantor", "cantora", "música", "musica", "músico", "musico",
  "show", "concerto", "turnê", "turne", "palco", "banda",
  "álbum", "album", "single", "ep", "clipe", "videoclipe",
  "spotify", "deezer", "apple music", "youtube music",
  "letra", "lyrics", "cover", "acústico", "acustico",
  "fã", "fãs", "fandom", "fã clube", "fã-clube",
  "ingresso", "ingressos", "bilhete", "bilheteria",
  "estádio", "arena", "teatro", "lollapalooza", "rock in rio",
  "playlist", "hit", "top 50", "viral", "trending",
  "artista", "compositor", "produtor musical",
];

// Termos que indicam FALSO POSITIVO (palavras comuns que contêm "jao" ou "joao")
const FALSE_POSITIVES = [
  "joão pessoa", "são joão", "sao joão", "são joao", "sao joao",
  "joão de deus", "joão batista", "joão maria", "joão pedro",
  "joão da silva", "joão santos", "joão souza", "joão oliveira",
  "joão costa", "joão ferreira", "joão martins", "joão rodrigues",
  "joão carlos", "joão paulo", "joão miguel", "joão gabriel",
  "joão lucas", "joão victor", "joão vitor", "joão henrique",
  "joão guilherme", "joão pedro", "joão felipe", "joão matheus",
  "joão gabriel", "joão marcelo", "joão eduardo", "joão rafael",
  "joão arthur", "joão bernardo", "joão francisco", "joão antonio",
  "joão marcos", "joão ricardo", "joão fernando", "joão bruno",
  "joão diego", "joão igor", "joão leonardo", "joão murilo",
  "joão otavio", "joão thiago", "joão vinicius", "joão yuri",
  "joão augusto", "joão caio", "joão davi", "joão enzo",
  "joão erick", "joão gustavo", "joão hugo", "joão ian",
  "joão isaac", "joão julio", "joão kaio", "joão lorenzo",
  "joão lucas", "joão nicolas", "joão oliver", "joão pietro",
  "joão ryan", "joão samuel", "joão theo", "joão thomas",
  "joão vicente", "joão william", "joão xavier", "joão yago",
  "joão zion", "joão adriel", "joão benicio", "joão calebe",
  "joão daniel", "joão elias", "joão fabio", "joão heitor",
  "joão iago", "joão joaquim", "joão kauan", "joão laercio",
  "joão maicon", "joão nathan", "joão osvaldo", "joão paulino",
  "joão quentin", "joão raimundo", "joão salomão", "joão tadeu",
  "joão ulisses", "joão valdir", "joão wesley", "joão xisto",
  "joão yago", "joão zacarias",
  "evangelho de joão", "joão capítulo", "joão capitulo",
  "são joão del rei", "festa junina", "festa de são joão",
  "joão e maria", "joão e o pé de feijão",
  "joão goulart", "joão figueiredo", "joão doria",
  "joão bosco", "joão gilberto", "joão donato",
];

// Sites onde a extensão atua com prioridade
const PRIORITY_SITES = [
  "google.com", "google.com.br",
  "youtube.com", "youtu.be",
  "twitter.com", "x.com",
  "instagram.com",
  "tiktok.com",
  "facebook.com", "fb.com",
  "reddit.com",
  "spotify.com",
  "deezer.com",
  "tidal.com",
  "apple.com/music",
  "last.fm",
  "genius.com",
  "vagalume.com.br",
  "letras.mus.br", "letras.com",
  "cifraclub.com.br",
  "g1.globo.com", "globo.com",
  "uol.com.br", "terra.com.br",
  "ig.com.br", "r7.com",
  "folha.uol.com.br", "estadao.com.br",
  "globoplay.globo.com",
];

// Configurações padrão
const DEFAULT_SETTINGS = {
  enabled: true,
  mode: "moderado", // "moderado" | "agressivo"
  showBlockedCount: true,
  showNotifications: false,
  customKeywords: [],
  whitelistSites: [],
  stats: {
    totalBlocked: 0,
    sitesBlocked: {},
    history: [],
    lastReset: Date.now(),
  },
  advanced: {
    useContextAnalysis: true,
    minRelevanceScore: 0.3, // 0.0 a 1.0
    checkImages: true,
    checkVideos: true,
    checkText: true,
    hideCompletely: true, // true = display:none, false = blur/opacity
  },
};

// Exporta para uso em outros scripts (quando usado como módulo)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    JAO_KEYWORDS,
    CONTEXT_TERMS,
    FALSE_POSITIVES,
    PRIORITY_SITES,
    DEFAULT_SETTINGS,
  };
}
