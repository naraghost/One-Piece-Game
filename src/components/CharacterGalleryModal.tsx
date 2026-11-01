import React, { useState, useEffect, useRef } from 'react';
import { SpriteRenderer } from '../game/sprites';
import { sound } from '../game/audio';

export type GalleryCategory = 'PROTAGONISTAS' | 'INIMIGOS' | 'COADJUVANTES';

export interface GalleryCharacter {
  id: string;
  name: string;
  title: string;
  category: GalleryCategory;
  bounty?: string;
  affiliation: 'Bando do Chapéu de Palha' | 'Piratas de Alvida' | 'Marinha (Shells Town)' | 'Civil';
  attributes: {
    strength: number; // 0 - 100
    defense: number;
    agility: number;
    reach: number;
  };
  specials: string[];
  biography: string;
  quote: string;
  renderType: 'luffy' | 'zoro' | 'alvida' | 'morgan' | 'marine_elite' | 'pirate_grunt' | 'coby' | 'helmeppo';
}

const GALLERY_CHARACTERS: GalleryCharacter[] = [
  // PROTAGONISTAS
  {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    title: 'Capitão dos Chapéus de Palha',
    category: 'PROTAGONISTAS',
    bounty: '30.000.000 Berries',
    affiliation: 'Bando do Chapéu de Palha',
    attributes: { strength: 94, defense: 88, agility: 95, reach: 98 },
    specials: [
      'Gomu Gomu no Pistol (Soco Elástico de Longo Alcance)',
      'Gomu Gomu no Bazooka (Disparo Duplo de Alta Potência)',
      'Gomu Gomu no Stamp (Pisão Aéreo Devastador)',
      'Combo Finisher: Gomu Gomu no Cannon Rush'
    ],
    biography: 'Um jovem audacioso que consumiu a Gomu Gomu no Mi, tornando seu corpo de borracha. Seu maior sonho é encontrar o lendário One Piece e se consagrar como o Rei dos Piratas.',
    quote: '"Eu serei o Rei dos Piratas!"',
    renderType: 'luffy'
  },
  {
    id: 'zoro',
    name: 'Roronoa Zoro',
    title: 'O Caçador de Piratas',
    category: 'PROTAGONISTAS',
    bounty: '60.000.000 Berries',
    affiliation: 'Bando do Chapéu de Palha',
    attributes: { strength: 96, defense: 92, agility: 90, reach: 90 },
    specials: [
      'Oni Giri (Corte das Três Lâminas do Demônio)',
      'Santoryu Ougi: Sanzen Sekai (Três Mil Mundos em Espiral)',
      'Sanjuuroku Pound Ho (Canhão de Vento Cortante)',
      'Combo Finisher: Tatsu Maki Tempestade Furiosa'
    ],
    biography: 'Mestre no estilo lendário de três espadas (Santoryu), empunha a preciosa Wado Ichimonji na boca. Fez uma solene promessa à sua falecida amiga Kuina de se tornar o maior espadachim do mundo.',
    quote: '"Se eu morrer aqui, significa que esse era o meu limite."',
    renderType: 'zoro'
  },

  // INIMIGOS
  {
    id: 'alvida',
    name: 'Capitã Alvida',
    title: 'A Clava de Ferro',
    category: 'INIMIGOS',
    bounty: '5.000.000 Berries',
    affiliation: 'Piratas de Alvida',
    attributes: { strength: 85, defense: 80, agility: 58, reach: 75 },
    specials: [
      'Iron Kanabō Smash (Impacto Sísmico de Ferro)',
      'Cyclone Spin (Vórtice Giratório Repulsor)',
      'Heart Wave Berserk (Fúria dos Mares)'
    ],
    biography: 'Líder dos temidos Piratas de Alvida que aterrorizava o East Blue. Fanática por sua suposta beleza, exige elogios de toda a sua tripulação sob ameaça de esmagamento pela sua colossal clava de ferro.',
    quote: '"Quem é a mulher mais bela e temível de todos os mares?!"',
    renderType: 'alvida'
  },
  {
    id: 'morgan',
    name: 'Capitão Morgan',
    title: 'Axe-Hand Morgan',
    category: 'INIMIGOS',
    affiliation: 'Marinha (Shells Town)',
    attributes: { strength: 90, defense: 86, agility: 62, reach: 88 },
    specials: [
      'Axe-Hand Heavy Cleave (Machadada Demolidora)',
      'Executioner Sweep (Corte Circular Amplo)',
      'Tyrant Tremor (Onda de Choque Terrestre)'
    ],
    biography: 'Coronel impiedoso da 153ª Divisão da Marinha em Shells Town. Teve sua mandíbula substituída por uma máscara de ferro e seu braço direito por um machado gigante de aço.',
    quote: '"Neste mundo, os superiores mandam e os fracos obedecem cegamente!"',
    renderType: 'morgan'
  },
  {
    id: 'marine_elite',
    name: 'Guarda de Elite da Marinha',
    title: 'Halberdier de Shells Town',
    category: 'INIMIGOS',
    affiliation: 'Marinha (Shells Town)',
    attributes: { strength: 75, defense: 78, agility: 76, reach: 92 },
    specials: [
      'Halberd Thrust Lunge (Estocada de Alabarda)',
      'High-Poise Stance (Imunidade a Interrupções Leves)',
      'Guard Counter (Contra-ataque Rápido)'
    ],
    biography: 'Soldados disciplinados treinados pessoalmente no pátio da fortaleza de Morgan. Empunham pesadas lanças com machados de ponta dupla para repelir invasores de longe.',
    quote: '"Pela glória da 153ª Divisão da Marinha!"',
    renderType: 'marine_elite'
  },
  {
    id: 'pirate_grunt',
    name: 'Pirata Minion',
    title: 'Marujo de Alvida',
    category: 'INIMIGOS',
    affiliation: 'Piratas de Alvida',
    attributes: { strength: 58, defense: 54, agility: 68, reach: 60 },
    specials: [
      'Cutlass Slash (Golpe com Sabre Pirata)',
      'Swarm Rush (Investida em Grupo)'
    ],
    biography: 'Membros da tripulação de Alvida vestidos com lenços cor-de-rosa e calças bufantes. Tremem de pavor constante da clava de sua capitã.',
    quote: '"Capitã Alvida é a mulher mais maravilhosa do universo!"',
    renderType: 'pirate_grunt'
  },

  // COADJUVANTES
  {
    id: 'coby',
    name: 'Coby',
    title: 'Garoto das Tarefas / Futuro Marinheiro',
    category: 'COADJUVANTES',
    affiliation: 'Civil',
    attributes: { strength: 38, defense: 42, agility: 72, reach: 50 },
    specials: [
      'Vassoura de Limpeza Defensiva',
      'Continência da Coragem Inabalável',
      'Determinação de Aço'
    ],
    biography: 'Garoto capturado por engano pelos Piratas de Alvida e forçado a ser faxineiro de bordo por dois anos. Inspirado pela audácia de Luffy, decide reunir coragem para perseguir seu sonho de entrar na Marinha.',
    quote: '"Eu também vou lutar pelo meu sonho... Eu serei um Oficial da Marinha!"',
    renderType: 'coby'
  },
  {
    id: 'helmeppo',
    name: 'Helmeppo',
    title: 'Filho do Tirano Morgan',
    category: 'COADJUVANTES',
    affiliation: 'Marinha (Shells Town)',
    attributes: { strength: 46, defense: 42, agility: 64, reach: 70 },
    specials: [
      'Disparo de Pistola Dourada',
      'Chamar o Papai (Ameaça Covarde)',
      'Lobo de Estimação Soro'
    ],
    biography: 'Filho mimado de Morgan com corte de cabelo tigela roxo. Costumava aterrorizar os moradores de Shells Town usando a autoridade tirânica do pai, até ser derrubado por Luffy e Zoro.',
    quote: '"Meu pai vai executar todos vocês! Vocês sabem quem eu sou?!"',
    renderType: 'helmeppo'
  }
];

interface CharacterGalleryModalProps {
  onClose: () => void;
}

export const CharacterGalleryModal: React.FC<CharacterGalleryModalProps> = ({ onClose }) => {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('PROTAGONISTAS');
  const [selectedCharId, setSelectedCharId] = useState<string>('luffy');
  const [currentPose, setCurrentPose] = useState<'IDLE' | 'ATTACK' | 'VICTORY'>('IDLE');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const poseTimerRef = useRef<number>(0);

  const selectedChar = GALLERY_CHARACTERS.find((c) => c.id === selectedCharId) || GALLERY_CHARACTERS[0];
  const filteredChars = GALLERY_CHARACTERS.filter((c) => c.category === activeCategory);

  // Switch category auto-selects first character in that category
  const handleSelectCategory = (cat: GalleryCategory) => {
    sound.playPunch(1);
    setActiveCategory(cat);
    const first = GALLERY_CHARACTERS.find((c) => c.category === cat);
    if (first) {
      setSelectedCharId(first.id);
      setCurrentPose('IDLE');
    }
  };

  const handleSelectCharacter = (char: GalleryCharacter) => {
    sound.playPunch(1);
    setSelectedCharId(char.id);
    setCurrentPose('IDLE');
    poseTimerRef.current = 0;
  };

  const handleSetPose = (pose: 'IDLE' | 'ATTACK' | 'VICTORY') => {
    sound.playPunch(2);
    setCurrentPose(pose);
    poseTimerRef.current = 0;
  };

  // Render loop for live animated canvas model
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();

    const loop = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      poseTimerRef.current += 0.016;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background vignette / podium aura
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.65,
        15,
        canvas.width / 2,
        canvas.height * 0.65,
        canvas.width * 0.55
      );
      grad.addColorStop(0, 'rgba(254, 240, 138, 0.25)');
      grad.addColorStop(0.6, 'rgba(30, 41, 59, 0.45)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grand Line Pedestal ring
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height * 0.78);
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, 75, 22, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(234, 179, 8, 0.12)';
      ctx.fill();

      // Floating dust / aura particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      for (let p = 0; p < 5; p++) {
        const px = Math.sin(elapsed * 2 + p * 1.5) * 60;
        const py = -10 - ((elapsed * 25 + p * 20) % 70);
        ctx.fillRect(px, py, 2.5, 2.5);
      }
      ctx.restore();

      // Center model render coordinates
      const modelX = canvas.width / 2;
      const modelY = canvas.height * 0.77;
      const walkFrame = Math.sin(elapsed * 4) * 5;

      const actStr = currentPose === 'ATTACK' 
        ? (selectedChar.renderType === 'luffy' ? 'PUNCH_2' : selectedChar.renderType === 'zoro' ? 'PUNCH_2' : 'ATTACK')
        : currentPose === 'VICTORY'
        ? 'VICTORY'
        : 'IDLE';

      ctx.save();
      // Render character sprite
      switch (selectedChar.renderType) {
        case 'luffy':
          SpriteRenderer.drawLuffy(ctx, modelX, modelY, 0, 1, actStr, poseTimerRef.current, walkFrame);
          break;
        case 'zoro':
          SpriteRenderer.drawZoro(ctx, modelX, modelY, 0, 1, actStr, poseTimerRef.current, walkFrame);
          break;
        case 'alvida':
          SpriteRenderer.drawAlvida(ctx, modelX, modelY, 0, 1, actStr, poseTimerRef.current);
          break;
        case 'morgan':
          SpriteRenderer.drawMorgan(ctx, modelX, modelY, 0, 1, actStr, poseTimerRef.current, walkFrame);
          break;
        case 'marine_elite':
          SpriteRenderer.drawMarineElite(ctx, modelX, modelY, 0, 1, actStr, poseTimerRef.current, walkFrame);
          break;
        case 'pirate_grunt':
          SpriteRenderer.drawPirateGrunt(ctx, modelX, modelY, 0, 1, actStr, poseTimerRef.current, false);
          break;
        case 'coby':
          SpriteRenderer.drawCoby(ctx, modelX, modelY, 0, 1, actStr, poseTimerRef.current);
          break;
        case 'helmeppo':
          SpriteRenderer.drawHelmeppo(ctx, modelX, modelY, 0, 1, actStr, poseTimerRef.current);
          break;
      }
      ctx.restore();

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [selectedChar, currentPose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
      {/* Outer Grand Line Map Parchment Border */}
      <div className="relative w-full max-w-5xl h-[92vh] max-h-[850px] bg-slate-900 border-4 border-amber-600 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-amber-50">
        
        {/* Top Header Bar */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b-2 border-amber-500/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl">☠️</span>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-wider text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] uppercase">
                Galeria do Grand Line
              </h2>
              <p className="text-xs md:text-sm text-amber-200/80 font-medium">
                Enciclopédia de Personagens, Atributos & Modelos Animados
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              sound.playPunch(1);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold rounded-xl border-2 border-red-400 shadow-lg cursor-pointer transition-all flex items-center gap-2"
          >
            <span>✕</span>
            <span>VOLTAR</span>
          </button>
        </div>

        {/* Category Tabs: Protagonistas, Inimigos, Coadjuvantes */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 px-4 py-2.5 bg-slate-950/70 border-b border-amber-500/30">
          {(['PROTAGONISTAS', 'INIMIGOS', 'COADJUVANTES'] as GalleryCategory[]).map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`px-4 sm:px-6 py-2 rounded-xl font-black text-xs sm:text-sm tracking-wider uppercase transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.6)] scale-105 border-2 border-amber-300'
                    : 'bg-slate-800/80 text-amber-200/70 hover:bg-slate-700 hover:text-amber-100 border border-slate-700'
                }`}
              >
                {cat === 'PROTAGONISTAS' && '⚔️ Protagonistas'}
                {cat === 'INIMIGOS' && '🏴‍☠️ Inimigos'}
                {cat === 'COADJUVANTES' && '🤝 Coadjuvantes'}
              </button>
            );
          })}
        </div>

        {/* Main Content: Character Selector Grid + Detailed Dossier */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Character List in Current Category */}
          <div className="w-full md:w-72 bg-slate-950/60 p-3 md:p-4 border-b md:border-b-0 md:border-r border-amber-500/20 overflow-y-auto flex md:flex-col gap-2.5 flex-shrink-0">
            {filteredChars.map((char) => {
              const isSelected = char.id === selectedCharId;
              return (
                <button
                  key={char.id}
                  onClick={() => handleSelectCharacter(char)}
                  className={`flex-1 md:flex-initial p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)] translate-x-1'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm md:text-base text-amber-200">
                      {char.name}
                    </span>
                    {isSelected && <span className="text-amber-400 text-xs">▶</span>}
                  </div>
                  <div className="text-xs text-amber-100/60 truncate mt-0.5">
                    {char.title}
                  </div>
                  {char.bounty && (
                    <div className="text-[11px] font-bold text-amber-400 mt-1 flex items-center gap-1">
                      <span>💰</span>
                      <span>{char.bounty}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Column: Complete Character Dossier Interface */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4">
            
            {/* Header with Name, Badge & Quote */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-500/30">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl md:text-3xl font-black text-amber-300">
                    {selectedChar.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {selectedChar.affiliation}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-amber-100/80 italic mt-0.5">
                  {selectedChar.quote}
                </p>
              </div>

              {selectedChar.bounty && (
                <div className="px-3.5 py-1.5 rounded-xl bg-amber-950/80 border border-amber-500/60 self-start sm:self-center">
                  <div className="text-[10px] font-black uppercase tracking-wider text-amber-400/90">
                    Recompensa do Governo Mundial
                  </div>
                  <div className="text-lg md:text-xl font-black text-amber-300 drop-shadow">
                    ฿ {selectedChar.bounty}
                  </div>
                </div>
              )}
            </div>

            {/* Split: Live Canvas Model Preview on Left + Attributes & Bio on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Interactive Live Canvas Model Box */}
              <div className="lg:col-span-5 flex flex-col items-center p-3 rounded-2xl bg-slate-950/80 border-2 border-amber-500/40 shadow-inner">
                <div className="text-xs font-bold tracking-wider text-amber-300/80 uppercase mb-2 flex items-center gap-1.5">
                  <span>🌀</span> Modelo 3D Interativo (Canvas 60 FPS)
                </div>

                {/* Animated Canvas */}
                <div className="relative w-full aspect-square max-w-[280px] rounded-xl overflow-hidden bg-slate-900 border border-slate-700/80">
                  <canvas
                    ref={canvasRef}
                    width={280}
                    height={280}
                    className="w-full h-full block"
                  />
                  {/* Watermark / Brand Badge */}
                  <div className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 bg-slate-950/70 text-amber-400 rounded border border-amber-500/30">
                    ESTADO: {currentPose}
                  </div>
                </div>

                {/* Pose Switcher Controls */}
                <div className="mt-3 flex items-center justify-center gap-2 w-full">
                  {(['IDLE', 'ATTACK', 'VICTORY'] as const).map((pose) => {
                    const isPoseActive = currentPose === pose;
                    return (
                      <button
                        key={pose}
                        onClick={() => handleSetPose(pose)}
                        className={`flex-1 py-1.5 px-2 rounded-lg font-black text-xs uppercase tracking-wide transition-all cursor-pointer ${
                          isPoseActive
                            ? 'bg-amber-400 text-slate-950 shadow-md font-black scale-105'
                            : 'bg-slate-800 hover:bg-slate-700 text-amber-200 border border-slate-700'
                        }`}
                      >
                        {pose === 'IDLE' && 'Parado'}
                        {pose === 'ATTACK' && 'Ataque'}
                        {pose === 'VICTORY' && 'Vitória'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Attributes, Specials & Lore */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Attributes Meter Grid */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/20">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                    <span>📊</span> Atributos de Batalha
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {/* Força */}
                    <div>
                      <div className="flex justify-between font-bold text-amber-200 mb-1">
                        <span>Força (Ataque)</span>
                        <span className="text-amber-400">{selectedChar.attributes.strength}/100</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${selectedChar.attributes.strength}%` }}
                        />
                      </div>
                    </div>

                    {/* Defesa */}
                    <div>
                      <div className="flex justify-between font-bold text-amber-200 mb-1">
                        <span>Defesa / Resistência</span>
                        <span className="text-amber-400">{selectedChar.attributes.defense}/100</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                          style={{ width: `${selectedChar.attributes.defense}%` }}
                        />
                      </div>
                    </div>

                    {/* Agilidade */}
                    <div>
                      <div className="flex justify-between font-bold text-amber-200 mb-1">
                        <span>Agilidade / Velocidade</span>
                        <span className="text-amber-400">{selectedChar.attributes.agility}/100</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${selectedChar.attributes.agility}%` }}
                        />
                      </div>
                    </div>

                    {/* Alcance */}
                    <div>
                      <div className="flex justify-between font-bold text-amber-200 mb-1">
                        <span>Alcance dos Golpes</span>
                        <span className="text-amber-400">{selectedChar.attributes.reach}/100</span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${selectedChar.attributes.reach}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Golpes e Habilidades Especiais */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/20">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                    <span>⚡</span> Movimentos e Golpes Especiais
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {selectedChar.specials.map((spec, i) => (
                      <div
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-amber-100 font-medium flex items-center gap-2"
                      >
                        <span className="text-amber-400 text-sm">✦</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Biografia / Lore */}
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-amber-500/20">
                  <div className="text-xs font-black uppercase tracking-wider text-amber-400 mb-1.5 flex items-center gap-1.5">
                    <span>📜</span> Arquivo Biográfico
                  </div>
                  <p className="text-xs leading-relaxed text-amber-100/90">
                    {selectedChar.biography}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
