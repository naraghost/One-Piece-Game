import { DialogueMessage } from './types';

export const PROLOGUE_DIALOGUE: DialogueMessage[] = [
  {
    speaker: 'Narrador',
    portrait: 'narrator',
    title: 'PRÓLOGO: O MAR DE EAST BLUE',
    scene: 'whirlpool',
    text: 'Em pleno mar de East Blue, Monkey D. Luffy navegava em um minúsculo barquinho a remos... quando um gigantesco redemoinho oceânico surgiu do nada!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'PERIGO NO MAR!',
    scene: 'whirlpool',
    text: 'Uwooooh!! O barquinho vai ser engolido pelo redemoinho!! Eu não sei nadar por causa da Fruta de Borracha! Ah, tem um barril de saquê vazio aqui... VOU ENTRAR NELE!!',
  },
  {
    speaker: 'Narrador',
    portrait: 'narrator',
    title: 'À DERIVA NO OCEANO',
    scene: 'barrel_sea',
    text: 'Luffy se trancou dentro do barril de madeira resistente. O pequeno barco foi tragado pelas profundezas, mas o barril flutuou tranquilamente pelas águas mornas...',
  },
  {
    speaker: 'Pirata',
    portrait: 'pirate',
    title: 'O RESGATE DOS PIRATAS',
    scene: 'barrel_fish',
    text: 'Olhem só, marujos! Pescamos um barril de saquê novinho flutuando no mar! Vamos levar para a despensa e beber escondidos da Capitã Alvida!',
  },
  {
    speaker: 'Coby',
    portrait: 'coby',
    title: 'NA DESPENSA DO NAVIO',
    scene: 'galley',
    text: 'E-esperem! Se a Capitã Alvida descobrir que vocês estão bebendo saquê roubado, ela vai nos pulverizar com a Clava de Ferro!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'A GRANDE EXPLOSÃO!',
    scene: 'barrel_burst',
    text: 'KABOOOM!! UAAAHHH!! QUE SONECA DELICIOSA! Dormi feito uma pedra!',
  },
  {
    speaker: 'Pirata',
    portrait: 'pirate',
    title: 'PÂNICO NO PORÃO',
    scene: 'barrel_burst',
    text: 'QUÊÊÊ?! O barril explodiu e saiu um moleque esquisito de chapéu de palha de dentro dele?! Peguem as facas, marujos!!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'O FUTURO REI DOS PIRATAS',
    scene: 'galley',
    text: 'Eu sou Monkey D. Luffy! O homem que vai ser o Rei dos Piratas! Vocês não vão encostar a mão no Coby! GOMU GOMU NO...',
  },
];

export const STAGE_2_DIALOGUE: DialogueMessage[] = [
  {
    speaker: 'Coby',
    portrait: 'coby',
    title: 'RUMO AO CONVÉS',
    scene: 'deck',
    text: 'Luffy-san! Você derrotou todos os piratas da despensa! Mas os reforços estão nos esperando no convés principal sob o sol!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'SUBINDO AO CONVÉS',
    scene: 'deck',
    text: 'Shishishi! Vamos subir as escadas! Esse navio cheira a carne e aventura! Ninguém vai me parar!',
  },
];

export const BOSS_DIALOGUE: DialogueMessage[] = [
  {
    speaker: 'Alvida',
    portrait: 'alvida',
    title: 'A CAPITÃ DA CLAVA DE FERRO',
    scene: 'alvida_intro',
    text: 'COBY!! Responda bem alto para que todo o oceano ouça: quem é a mulher mais linda e graciosa de todos os mares?!',
  },
  {
    speaker: 'Coby',
    portrait: 'coby',
    title: 'O TERROR DE COBY',
    scene: 'alvida_intro',
    text: 'É a... é a senhora, Capitã Alvida... (ai socorro, ela vai me matar se eu falar a verdade...)',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'SINCERIDADE DO CHAPÉU DE PALHA',
    scene: 'alvida_intro',
    text: 'Hã? Coby, quem é essa velha gorda, feia e nariguda segurando essa clava preta?',
  },
  {
    speaker: 'Alvida',
    portrait: 'alvida',
    title: 'FÚRIA DESCOMUNAL',
    scene: 'alvida_intro',
    text: 'VELHA GORDA E FEIA?! SEU PIRRALHO ATREVIDO!! VOU QUEBRAR CADA OSSO DO SEU CORPO EM MIL PEDAÇOS COM MINHA CLAVA DE FERRO!!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'CORPO DE BORRACHA',
    scene: 'alvida_intro',
    text: 'Pode vir com tudo! Socos de ferro não funcionam em mim... porque eu sou feito de borracha! GOMU GOMU NO PISTOL!!',
  },
];

export const VICTORY_DIALOGUE: DialogueMessage[] = [
  {
    speaker: 'Alvida',
    portrait: 'alvida',
    title: 'VOANDO ATÉ O HORIZONTE',
    scene: 'victory',
    text: 'EU NUNCA VOU ESQUECER ESSE DIAAAA...!! (sumindo brilhando como uma estrela no céu)',
  },
  {
    speaker: 'Coby',
    portrait: 'coby',
    title: 'A LIBERTAÇÃO',
    scene: 'victory',
    text: 'Luffy-san!! Você mandou a temível Alvida para fora do navio com um único soco esticado!! Eu... eu finalmente estou livre!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'O SONHO DE COBY',
    scene: 'victory',
    text: 'Shishishi! Foi moleza! E você, Coby? Qual é o seu maior sonho?',
  },
  {
    speaker: 'Coby',
    portrait: 'coby',
    title: 'RUMO À MARINHA',
    scene: 'victory',
    text: 'Eu decidi! Vou me alistar na Marinha e um dia vou me tornar um Almirante forte e justo para proteger as pessoas indefesas!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'A JORNADA CONTINUA',
    scene: 'victory',
    text: 'Muito bom, Coby! Então sejamos inimigos honrados! Agora vamos pegar um bote e ir até a base naval de Shells Town procurar o Caçador de Piratas... Roronoa Zoro!',
  },
];

// ============================================================================
// SHELLS TOWN / SAGA DO ZORO DIALOGUES
// ============================================================================

export const ZORO_COURTYARD_DIALOGUE: DialogueMessage[] = [
  {
    speaker: 'Coby',
    portrait: 'coby',
    title: 'CHEGADA A SHELLS TOWN',
    scene: 'marine_courtyard',
    text: 'Luffy-san, chegamos à Base Naval da 153ª Divisão da Marinha! As pessoas da cidade têm pavor deste lugar... dizem que o Capitão Morgan é um monstro cruel!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'O HOMEM AMARRADO',
    scene: 'zoro_bound',
    text: 'Olha lá no meio do pátio sob o sol escaldante! Tem um cara amarrado numa cruz de madeira! É ele? Ele tem cabelo verde!',
  },
  {
    speaker: 'Zoro',
    portrait: 'zoro',
    title: 'O CAÇADOR DE PIRATAS',
    scene: 'zoro_bound',
    text: 'Ei, vocês dois... sumam daqui. Já faz três semanas que estou sem comer nem beber água. Não tenho paciência pra idiotas.',
  },
  {
    speaker: 'Helmeppo',
    portrait: 'helmeppo',
    title: 'O FILHO MIMADO',
    scene: 'marine_courtyard',
    text: 'Hahaha! Olhem só o grande Caçador de Piratas! Você achou mesmo que meu pai, o Capitão Morgan, iria te soltar depois de 1 mês? Amanhã você vai ser fuzilado!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'ACORDO DE PIRATA',
    scene: 'zoro_bound',
    text: 'Ei, Zoro! Se eu invadir a torre do Morgan e pegar suas espadas de volta, você entra pro meu bando de piratas?',
  },
  {
    speaker: 'Zoro',
    portrait: 'zoro',
    title: 'A PROMESSA',
    scene: 'zoro_bound',
    text: 'Eu sou um caçador de recompensas, não um pirata desgraçado! Mas se você recuperar minhas três katanas... eu não tenho escolha a não ser lutar ao seu lado!',
  },
];

export const SWORD_TOWER_DIALOGUE: DialogueMessage[] = [
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'INFILTRAÇÃO NA TORRE',
    scene: 'morgan_tower',
    text: 'Shishishi! Entrei na torre do Morgan! Helmeppo escondeu as espadas do Zoro em algum dos baús dos marinheiros lá no alto!',
  },
  {
    speaker: 'Marinheiro',
    portrait: 'marine',
    title: 'ALARME NA BASE',
    scene: 'morgan_tower',
    text: 'INTRUSO! É um garoto de chapéu de palha invadindo o gabinete do Capitão Morgan! Guardas, posicionem os sabres e fuzis!!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'ABRINDO CAMINHO',
    scene: 'morgan_tower',
    text: 'Saiam da frente! O Zoro está morrendo de fome e eu vim buscar o tesouro dele! GOMU GOMU NO PISTOL!!',
  },
];

export const ZORO_FREED_DIALOGUE: DialogueMessage[] = [
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'O RETORNO DAS TRÊS ESPADAS',
    scene: 'zoro_freed',
    text: 'ZORO!! Eu peguei! Eu não sabia qual das três era a sua... então trouxe TODAS AS TRÊS KATANAS!!',
  },
  {
    speaker: 'Zoro',
    portrait: 'zoro',
    title: 'O ESTILO TRÊS ESPADAS',
    scene: 'zoro_freed',
    text: 'Todas as três são minhas! Eu uso o Santoryu — o Estilo de Três Espadas! Rápido, solte minhas cordas!',
  },
  {
    speaker: 'Morgan',
    portrait: 'morgan',
    title: 'O JULGAMENTO DO MACHADO',
    scene: 'morgan_boss',
    text: 'Pelotão de fuzilamento, ATIREM!! Nenhum verme escapa da autoridade do Capitão Morgan "Mão-de-Machado"!!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'ESCUDO DE BORRACHA',
    scene: 'zoro_freed',
    text: 'GOMU GOMU NO FUUSEN!! As balas da marinha rebatem no meu corpo de borracha! Agora é com você, Zoro!',
  },
  {
    speaker: 'Zoro',
    portrait: 'zoro',
    title: 'SANTORYU DESPERTADO',
    scene: 'morgan_boss',
    text: 'Luffy... Eu fiz uma promessa a uma velha amiga. Eu vou me tornar o maior espadachim do mundo! Se você ficar no meu caminho, eu corto você! Mas por hoje... esse cara de machado é MEU!!',
  },
];

export const MORGAN_VICTORY_DIALOGUE: DialogueMessage[] = [
  {
    speaker: 'Morgan',
    portrait: 'morgan',
    title: 'A QUEDA DO TIRANO',
    scene: 'victory',
    text: 'IMPOSSÍVEL...!! Eu sou o grande Capitão Morgan... a lei absoluta... cortado por meros pirralhos...?! (cai no chão desacordado)',
  },
  {
    speaker: 'Marinheiro',
    portrait: 'marine',
    title: 'A LIBERTAÇÃO DA CIDADE',
    scene: 'victory',
    text: 'O Capitão Morgan... foi derrotado!! VIVA!! ESTAMOS LIVRES DA TIRANIA!! OBRIGADO, PIRATAS!!',
  },
  {
    speaker: 'Coby',
    portrait: 'coby',
    title: 'O PRIMEIRO PASSO',
    scene: 'victory',
    text: 'Luffy-san! Zoro-san! Os marinheiros foram libertados do medo! E eles vão me aceitar como recruta da Marinha!',
  },
  {
    speaker: 'Luffy',
    portrait: 'luffy',
    title: 'O PRIMEIRO COMPANHEIRO',
    scene: 'zoro_joined',
    text: 'Shishishi! Conseguimos nosso primeiro companheiro para o bando do Chapéu de Palha! Roronoa Zoro, o espadachim do Rei dos Piratas!',
  },
  {
    speaker: 'Zoro',
    portrait: 'zoro',
    title: 'A CAMINHO DA GRAND LINE',
    scene: 'zoro_joined',
    text: 'Rei dos Piratas, é? Bom... se vou ser o subordinado de alguém, que seja do homem mais ambicioso dos mares. Vamos nessa, Capitão!',
  },
];
