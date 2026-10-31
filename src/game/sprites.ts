/**
 * Procedural Sprite & Environment Renderer for One Piece: Romance Dawn (Alvida Beat 'Em Up)
 * Faithful recreation of the classic One Piece GBA / Game Boy Advance visual style.
 */

export class SpriteRenderer {
  // ==========================================
  // 1. SHIP DECK & OCEAN BACKGROUND PIPELINE
  // ==========================================
  public static drawBackground(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number,
    time: number,
    stage: 'STAGE_1_GALLEY' | 'STAGE_2_DECK' | 'STAGE_3_BOSS' | 'STAGE_4_BASE_COURTYARD' | 'STAGE_5_FORTRESS_INTERIOR' | 'STAGE_6_MORGAN_SHOWDOWN' = 'STAGE_1_GALLEY'
  ) {
    if (stage === 'STAGE_1_GALLEY') {
      this.drawGalleyHoldBackground(ctx, camX, width, height, time);
      return;
    }

    if (stage === 'STAGE_3_BOSS') {
      this.drawPoopDeckBackground(ctx, camX, width, height, time);
      return;
    }

    if (stage === 'STAGE_4_BASE_COURTYARD') {
      this.drawMarineCourtyardBackground(ctx, camX, width, height, time, false);
      return;
    }

    if (stage === 'STAGE_5_FORTRESS_INTERIOR') {
      this.drawFortressInteriorBackground(ctx, camX, width, height, time);
      return;
    }

    if (stage === 'STAGE_6_MORGAN_SHOWDOWN') {
      this.drawMarineCourtyardBackground(ctx, camX, width, height, time, true);
      return;
    }

    // Default: STAGE_2_DECK - Vibrant East Blue Sky & Main Deck (images (3).jpeg)
    this.drawMainDeckBackground(ctx, camX, width, height, time);
  }

  // A. STAGE 1: GALLEY & CARGO HOLD INTERIOR (Exact match to images_1d8d10f8.png!)
  private static drawGalleyHoldBackground(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number,
    time: number
  ) {
    const deckY = height * 0.58;
    const deckH = height - deckY;

    // 1. Warm Amber Wooden Wall Panels (Ship Interior Hold)
    const wallGrad = ctx.createLinearGradient(0, 0, 0, deckY);
    wallGrad.addColorStop(0, '#5a300a');
    wallGrad.addColorStop(0.3, '#784315');
    wallGrad.addColorStop(0.7, '#96551b');
    wallGrad.addColorStop(1, '#b06526');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, width, deckY);

    // Vertical Timber Wall Planks with Seams
    ctx.strokeStyle = '#432205';
    ctx.lineWidth = 2;
    const wallPlankStep = 48;
    const wallOffset = -(camX * 0.4) % wallPlankStep;
    for (let wx = wallOffset - wallPlankStep; wx < width + wallPlankStep; wx += wallPlankStep) {
      ctx.beginPath();
      ctx.moveTo(wx, 0);
      ctx.lineTo(wx, deckY);
      ctx.stroke();

      // Top wood ceiling beam rivets
      ctx.fillStyle = '#2d1602';
      ctx.fillRect(wx + 4, 18, 3, 3);
      ctx.fillRect(wx + 4, deckY - 12, 3, 3);
    }

    // Upper Heavy Crossbeam running horizontally
    ctx.fillStyle = '#653711';
    ctx.fillRect(0, 0, width, 24);
    ctx.strokeStyle = '#321804';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, 24);

    // Hanging Ship Lanterns casting warm flickering glow
    for (let lx = 140; lx < width + 400; lx += 280) {
      const lampX = lx - ((camX * 0.5) % 840);
      if (lampX > -40 && lampX < width + 40) {
        // Wire
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lampX, 24);
        ctx.lineTo(lampX, 55);
        ctx.stroke();

        // Lantern cage
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(lampX - 7, 55, 14, 18);
        // Yellow flame glow
        const glow = 0.6 + Math.sin(time * 6 + lx) * 0.2;
        ctx.fillStyle = `rgba(255, 214, 10, ${glow})`;
        ctx.fillRect(lampX - 4, 58, 8, 12);
      }
    }

    // Background Cargo: Sacks and Stacks of Wooden Boxes in the Hold
    const stackX1 = 120 - ((camX * 0.5) % 650);
    this.drawFruitCrate(ctx, stackX1, deckY - 2);
    this.drawPantryCabinet(ctx, stackX1 + 60, deckY - 2);

    const stackX2 = 480 - ((camX * 0.5) % 650);
    this.drawFruitCrate(ctx, stackX2, deckY - 2);
    this.drawFruitCrate(ctx, stackX2 + 48, deckY - 2);

    // 2. Playable Golden Wooden Floorboards
    this.drawFloorboards(ctx, camX, width, height, deckY, deckH);

    // 3. Lower Steel Crossbraces (Exact from images_1d8d10f8.png!)
    this.drawLowerTrussBraces(ctx, camX, width, height);
  }

  // B. STAGE 2: MAIN DECK (Sunny East Blue Ocean & White Balustrades)
  private static drawMainDeckBackground(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number,
    time: number
  ) {
    // A. Vibrant East Blue Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.44);
    skyGrad.addColorStop(0, '#0072ff');
    skyGrad.addColorStop(0.35, '#00a6fb');
    skyGrad.addColorStop(0.75, '#56cfe1');
    skyGrad.addColorStop(1, '#a2d2ff');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height * 0.44);

    // Fluffy anime clouds
    const cloud1X = ((time * 12 + camX * 0.08) % (width + 360)) - 180;
    const cloud2X = ((time * 7 + camX * 0.04 + 320) % (width + 420)) - 210;
    this.drawAnimeCloud(ctx, cloud1X, 35, 1.3);
    this.drawAnimeCloud(ctx, cloud2X, 75, 0.95);

    // Flying seagulls
    for (let i = 0; i < 3; i++) {
      const gX = ((time * 28 + i * 210 + camX * 0.06) % (width + 120)) - 60;
      const gY = 45 + Math.sin(time * 3 + i * 1.5) * 10 + i * 16;
      this.drawSeagull(ctx, gX, gY, time + i);
    }

    // B. East Blue Sparkling Ocean
    const seaY = height * 0.36;
    const seaH = height * 0.22;
    const seaGrad = ctx.createLinearGradient(0, seaY, 0, seaY + seaH);
    seaGrad.addColorStop(0, '#0077b6');
    seaGrad.addColorStop(0.4, '#0096c7');
    seaGrad.addColorStop(0.85, '#00b4d8');
    seaGrad.addColorStop(1, '#48cae4');
    ctx.fillStyle = seaGrad;
    ctx.fillRect(0, seaY, width, seaH);

    // Waves Highlights
    ctx.fillStyle = '#ffffff';
    for (let w = 0; w < width; w += 36) {
      const waveX = w - ((camX * 0.25) % 36);
      const waveY1 = seaY + 14 + Math.sin(time * 3.5 + w * 0.08) * 4;
      ctx.fillRect(waveX, waveY1, 16, 2);
    }

    // C. The Miss Love Duck Ship White Balustrade Railing
    const railY = height * 0.50;
    const railHeight = 54;
    const deckY = height * 0.57;
    const deckH = height - deckY;

    this.drawWhiteBalustrade(ctx, camX, width, railY, railHeight);

    // Mast with sail ropes
    const mastX = 640 - camX;
    if (mastX > -120 && mastX < width + 120) {
      this.drawShipMast(ctx, mastX, deckY);
    }

    // Playable Floorboards & Trusses
    this.drawFloorboards(ctx, camX, width, height, deckY, deckH);
    this.drawLowerTrussBraces(ctx, camX, width, height);
  }

  // C. STAGE 3: POOP DECK (Stern Platform & Lady Alvida Showdown)
  private static drawPoopDeckBackground(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number,
    time: number
  ) {
    // Dramatic Sunset / East Blue Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.44);
    skyGrad.addColorStop(0, '#e76f51');
    skyGrad.addColorStop(0.4, '#f4a261');
    skyGrad.addColorStop(0.75, '#e9c46a');
    skyGrad.addColorStop(1, '#2a9d8f');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height * 0.44);

    const seaY = height * 0.36;
    const seaH = height * 0.22;
    ctx.fillStyle = '#1d3557';
    ctx.fillRect(0, seaY, width, seaH);

    const railY = height * 0.48;
    const deckY = height * 0.55;
    const deckH = height - deckY;

    // Stern Ship Helm (Giant Wooden Wheel)
    const wheelX = width * 0.75 - (camX * 0.3);
    this.drawShipHelmWheel(ctx, wheelX, deckY - 15, time);

    // Alvida's Pirate Jolly Roger Flag (Heart skull on pink background)
    const flagX = width * 0.25 - (camX * 0.3);
    this.drawAlvidaFlag(ctx, flagX, deckY - 40, time);

    this.drawWhiteBalustrade(ctx, camX, width, railY, 48);
    this.drawFloorboards(ctx, camX, width, height, deckY, deckH);
    this.drawLowerTrussBraces(ctx, camX, width, height);
  }

  // Shared Helper: Floorboards
  private static drawFloorboards(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number,
    deckY: number,
    deckH: number
  ) {
    const deckGrad = ctx.createLinearGradient(0, deckY, 0, height);
    deckGrad.addColorStop(0, '#f2bd64');
    deckGrad.addColorStop(0.25, '#e59d43');
    deckGrad.addColorStop(0.7, '#d68427');
    deckGrad.addColorStop(1, '#a65b14');
    ctx.fillStyle = deckGrad;
    ctx.fillRect(0, deckY, width, deckH);

    ctx.strokeStyle = '#8c480d';
    ctx.lineWidth = 2.5;
    const plankHeight = 30;
    for (let py = deckY; py < height; py += plankHeight) {
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      ctx.strokeStyle = '#fde293';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, py + 1.5);
      ctx.lineTo(width, py + 1.5);
      ctx.stroke();

      ctx.strokeStyle = '#8c480d';
      ctx.lineWidth = 2.5;

      const seamStep = 170;
      const rowIdx = Math.floor((py - deckY) / plankHeight);
      const seamOffset = (rowIdx * 65) - (camX % seamStep);
      for (let sx = seamOffset - seamStep; sx < width + seamStep; sx += seamStep) {
        ctx.beginPath();
        ctx.moveTo(sx, py);
        ctx.lineTo(sx, py + plankHeight);
        ctx.stroke();

        ctx.fillStyle = '#3e2723';
        ctx.fillRect(sx - 4, py + 4, 2, 2);
        ctx.fillRect(sx - 4, py + plankHeight - 6, 2, 2);
      }
    }
  }

  // Shared Helper: Lower Truss Braces
  private static drawLowerTrussBraces(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number
  ) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, height - 18, width, 18);
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 2.5;
    const braceStep = 32;
    for (let bx = -((camX) % braceStep); bx < width + braceStep; bx += braceStep) {
      ctx.beginPath();
      ctx.moveTo(bx, height);
      ctx.lineTo(bx + braceStep / 2, height - 16);
      ctx.lineTo(bx + braceStep, height);
      ctx.stroke();
    }
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, height - 18, width, 2);
  }

  // Shared Helper: White Balustrades
  private static drawWhiteBalustrade(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    railY: number,
    railHeight: number
  ) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, railY, width, 10);
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(0, railY + 8, width, 3);
    ctx.fillStyle = '#263238';
    ctx.fillRect(0, railY + 10, width, 1.5);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, railY + railHeight - 10, width, 8);
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(0, railY + railHeight - 3, width, 2);
    ctx.fillStyle = '#263238';
    ctx.fillRect(0, railY + railHeight - 1, width, 1.5);

    const pillarStep = 44;
    const startPillar = -((camX) % pillarStep);
    for (let px = startPillar - pillarStep; px < width + pillarStep; px += pillarStep) {
      ctx.fillStyle = '#263238';
      ctx.beginPath();
      ctx.arc(px + 7, railY - 3, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px + 7, railY - 3, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#263238';
      ctx.beginPath();
      ctx.ellipse(px + 7, railY + 24, 7.5, 17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(px + 7, railY + 24, 6, 15.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Stern Ship Helm Wheel
  private static drawShipHelmWheel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    time: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // Pedestal
    ctx.fillStyle = '#4a2509';
    ctx.fillRect(-12, -10, 24, 40);

    // Wheel
    const rot = Math.sin(time * 0.8) * 0.3;
    ctx.rotate(rot);

    ctx.strokeStyle = '#8c480d';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(0, -32, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Spokes
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(0, -32);
      ctx.lineTo(Math.cos(angle) * 32, -32 + Math.sin(angle) * 32);
      ctx.stroke();
    }

    // Hub
    ctx.fillStyle = '#d4af37';
    ctx.beginPath();
    ctx.arc(0, -32, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Alvida's Pirate Flag
  private static drawAlvidaFlag(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    time: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // Mast pole
    ctx.fillStyle = '#2d1602';
    ctx.fillRect(-3, -70, 6, 90);

    // Flapping pink flag with heart
    const wave = Math.sin(time * 4) * 5;
    ctx.fillStyle = '#ff4d6d';
    ctx.beginPath();
    ctx.moveTo(3, -65);
    ctx.quadraticCurveTo(30, -68 + wave, 60, -65);
    ctx.lineTo(55, -35 + wave);
    ctx.quadraticCurveTo(28, -38 + wave, 3, -35);
    ctx.closePath();
    ctx.fill();

    // White heart on flag
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(28, -50 + wave * 0.6, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Raised Platform with Wooden Pillars (Matches screenshot right side!)
  private static drawRaisedDeckPlatform(
    ctx: CanvasRenderingContext2D,
    x: number,
    baseRailY: number,
    totalH: number
  ) {
    const platW = 600;
    const platY = baseRailY - 45;

    // Vertical wooden support columns (thick round timber logs)
    const pillarWidth = 42;
    for (let px = x; px < x + platW; px += 56) {
      // Dark wood pillar
      const logGrad = ctx.createLinearGradient(px, 0, px + pillarWidth, 0);
      logGrad.addColorStop(0, '#5d3513');
      logGrad.addColorStop(0.3, '#8c480d');
      logGrad.addColorStop(0.7, '#b26823');
      logGrad.addColorStop(1, '#4a2509');
      ctx.fillStyle = logGrad;
      ctx.fillRect(px, platY + 12, pillarWidth, totalH - (platY + 12));

      // Wood grain lines
      ctx.fillStyle = '#3a1b06';
      ctx.fillRect(px + 4, platY + 15, 2, totalH);
      ctx.fillRect(px + pillarWidth - 6, platY + 15, 2, totalH);
    }

    // Platform deck surface
    ctx.fillStyle = '#f5c067';
    ctx.fillRect(x - 10, platY, platW + 20, 16);
    ctx.fillStyle = '#263238';
    ctx.strokeRect(x - 10, platY, platW + 20, 16);

    // Diagonal staircase railing leading up
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(x - 60, baseRailY + 6);
    ctx.lineTo(x, platY + 6);
    ctx.lineTo(x, platY - 4);
    ctx.lineTo(x - 60, baseRailY - 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.stroke();
  }

  // Draw Clouds with GBA anime stylization
  private static drawAnimeCloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Drop shadow
    ctx.fillStyle = 'rgba(162, 210, 255, 0.45)';
    ctx.beginPath();
    ctx.arc(2, 6, 22, 0, Math.PI * 2);
    ctx.arc(28, 0, 30, 0, Math.PI * 2);
    ctx.arc(62, 8, 24, 0, Math.PI * 2);
    ctx.fill();

    // Crisp white cloud puffs
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.arc(26, -6, 28, 0, Math.PI * 2);
    ctx.arc(58, 2, 23, 0, Math.PI * 2);
    ctx.arc(84, 8, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Draw Flying Seagull
  private static drawSeagull(ctx: CanvasRenderingContext2D, x: number, y: number, t: number) {
    const flap = Math.sin(t * 8) * 6;
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x - 9, y + flap);
    ctx.quadraticCurveTo(x - 4, y - 5, x, y);
    ctx.quadraticCurveTo(x + 4, y - 5, x + 9, y + flap);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x - 9, y + flap);
    ctx.quadraticCurveTo(x - 4, y - 5, x, y);
    ctx.quadraticCurveTo(x + 4, y - 5, x + 9, y + flap);
    ctx.stroke();
  }

  // Draw Ship Mast with Alvida's Heart Flag
  private static drawShipMast(ctx: CanvasRenderingContext2D, x: number, deckY: number) {
    // Mast wood beam
    const mastGrad = ctx.createLinearGradient(x, 0, x + 34, 0);
    mastGrad.addColorStop(0, '#532b0d');
    mastGrad.addColorStop(0.5, '#8c480d');
    mastGrad.addColorStop(1, '#3b1d07');
    ctx.fillStyle = mastGrad;
    ctx.fillRect(x, 0, 34, deckY);
    ctx.strokeStyle = '#211005';
    ctx.strokeRect(x, 0, 34, deckY);

    // Cross beam
    ctx.fillStyle = '#7a3e0f';
    ctx.fillRect(x - 45, 60, 125, 14);

    // Alvida's Pink Heart Flag
    ctx.fillStyle = '#ff4081';
    ctx.fillRect(x + 34, 45, 85, 55);
    ctx.strokeStyle = '#c51162';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 34, 45, 85, 55);

    // White Heart Symbol on Flag
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x + 64, 66, 12, 0, Math.PI * 2);
    ctx.arc(x + 88, 66, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + 52, 72);
    ctx.lineTo(x + 100, 72);
    ctx.lineTo(x + 76, 92);
    ctx.closePath();
    ctx.fill();
  }

  // ==========================================
  // C. STAGE 4 & 6: SHELLS TOWN MARINE COURTYARD
  // ==========================================
  private static drawMarineCourtyardBackground(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number,
    time: number,
    isShowdown: boolean
  ) {
    const groundY = height * 0.58;
    const groundH = height - groundY;

    // 1. Sky Gradient (Dusk/Stormy for Showdown, Bright Sunny Blue for Courtyard)
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    if (isShowdown) {
      skyGrad.addColorStop(0, '#1a2a4b');
      skyGrad.addColorStop(0.5, '#2b4162');
      skyGrad.addColorStop(1, '#e07a5f');
    } else {
      skyGrad.addColorStop(0, '#0284c7');
      skyGrad.addColorStop(0.4, '#38bdf8');
      skyGrad.addColorStop(0.8, '#7dd3fc');
      skyGrad.addColorStop(1, '#bae6fd');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, groundY);

    // Clouds
    const c1X = ((time * 10 + camX * 0.05) % (width + 300)) - 150;
    const c2X = ((time * 6 + camX * 0.02 + 250) % (width + 400)) - 200;
    this.drawAnimeCloud(ctx, c1X, 30, 1.2);
    this.drawAnimeCloud(ctx, c2X, 60, 0.9);

    // 2. Marine Fortress Massive Stone Wall (Midground)
    const wallY = groundY - 110;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(0, wallY, width, 110);

    // Stone Brick Pattern
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    const brickW = 60;
    const brickH = 18;
    for (let by = wallY; by < groundY; by += brickH) {
      const rowOffset = ((by - wallY) / brickH) % 2 === 0 ? 0 : brickW / 2;
      const startX = -((camX * 0.3 + rowOffset) % brickW);
      for (let bx = startX - brickW; bx < width + brickW; bx += brickW) {
        ctx.strokeRect(bx, by, brickW, brickH);
      }
    }

    // Wall Battlements / Crenellations
    const battleW = 32;
    const battleGap = 20;
    const startB = -((camX * 0.3) % (battleW + battleGap));
    for (let bx = startB - (battleW + battleGap); bx < width + (battleW + battleGap); bx += (battleW + battleGap)) {
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(bx, wallY - 14, battleW, 14);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(bx, wallY - 14, battleW, 14);
    }

    // Marine Base Flags on Wall Watchpoints
    for (let fx = 180; fx < width + 600; fx += 380) {
      const flagX = fx - ((camX * 0.3) % 760);
      if (flagX > -50 && flagX < width + 50) {
        this.drawMarineFlag(ctx, flagX, wallY - 14, time);
      }
    }

    // Watchtower with Spotlight / Guard Post
    const towerX = 480 - ((camX * 0.3) % 900);
    if (towerX > -80 && towerX < width + 80) {
      ctx.fillStyle = '#64748b';
      ctx.fillRect(towerX - 25, wallY - 50, 50, 50);
      ctx.fillStyle = '#334155';
      ctx.fillRect(towerX - 30, wallY - 60, 60, 10);
      ctx.fillStyle = '#0ea5e9'; // Glass window
      ctx.fillRect(towerX - 16, wallY - 42, 32, 16);
    }

    // 3. Execution Yard Center Post (Zoro tied up if Stage 4, empty with broken ropes if Showdown)
    const postX = 350 - ((camX * 0.7) % 1200);
    if (postX > -100 && postX < width + 100) {
      this.drawExecutionPost(ctx, postX, groundY - 10, isShowdown, time);
    }

    // 4. Courtyard Stone Paver Floor (Playable Plane)
    this.drawCourtyardGround(ctx, camX, width, height, groundY, groundH);
  }

  // D. STAGE 5: FORTRESS TOWER INTERIOR (Morgan's Headquarters)
  private static drawFortressInteriorBackground(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number,
    time: number
  ) {
    const floorY = height * 0.58;
    const floorH = height - floorY;

    // 1. Ornate Marine Stone Chamber Walls
    const wallGrad = ctx.createLinearGradient(0, 0, 0, floorY);
    wallGrad.addColorStop(0, '#1e293b');
    wallGrad.addColorStop(0.3, '#334155');
    wallGrad.addColorStop(0.8, '#475569');
    wallGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, width, floorY);

    // Arched Columns in background
    const colStep = 220;
    const startCol = -((camX * 0.4) % colStep);
    for (let cx = startCol - colStep; cx < width + colStep; cx += colStep) {
      // Marble Pillar
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(cx - 16, 20, 32, floorY - 20);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(cx - 10, 20, 20, floorY - 20);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 16, 20, 32, floorY - 20);

      // Capital & Base
      ctx.fillStyle = '#d4af37'; // Gold leaf
      ctx.fillRect(cx - 20, 16, 40, 8);
      ctx.fillRect(cx - 20, floorY - 8, 40, 8);

      // Flaming Brass Wall Torch
      const torchY = 90;
      ctx.fillStyle = '#d4af37';
      ctx.fillRect(cx - 4, torchY, 8, 18);
      const flameFlicker = Math.sin(time * 8 + cx) * 2;
      ctx.fillStyle = '#ff7b00';
      ctx.beginPath();
      ctx.arc(cx, torchY - 6 + flameFlicker, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffea00';
      ctx.beginPath();
      ctx.arc(cx, torchY - 6 + flameFlicker, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    // Giant Marine Banner with Golden Seagull
    const bannerX = 260 - ((camX * 0.4) % 880);
    if (bannerX > -80 && bannerX < width + 80) {
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(bannerX - 35, 30, 70, 95);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(bannerX - 35, 30, 70, 95);
      // Seagull
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(bannerX - 10, 70, 12, Math.PI, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(bannerX + 10, 70, 12, Math.PI, Math.PI * 2);
      ctx.stroke();
      // "MARINE" text
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('MARINE', bannerX, 105);
    }

    // Morgan's Giant Ego Statue / Bust
    const statueX = 640 - ((camX * 0.4) % 880);
    if (statueX > -80 && statueX < width + 80) {
      // Golden Pedestal
      ctx.fillStyle = '#b45309';
      ctx.fillRect(statueX - 25, floorY - 60, 50, 60);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(statueX - 20, floorY - 55, 40, 50);
      // Statue of Axe-Hand Morgan
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.arc(statueX, floorY - 80, 14, 0, Math.PI * 2); // head
      ctx.fill();
      // Jaw brace
      ctx.fillStyle = '#475569';
      ctx.fillRect(statueX - 10, floorY - 76, 20, 10);
      // Big Axe Blade on statue
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.arc(statueX + 16, floorY - 85, 18, -Math.PI / 2, Math.PI / 2);
      ctx.fill();
    }

    // Weapon Rack with Naval Sabres & Rifles
    const rackX = 100 - ((camX * 0.4) % 880);
    if (rackX > -60 && rackX < width + 60) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(rackX - 25, floorY - 45, 50, 45);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(rackX - 22, floorY - 40, 44, 40);
      // Weapons in rack
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      for (let rx = rackX - 16; rx <= rackX + 16; rx += 8) {
        ctx.beginPath();
        ctx.moveTo(rx, floorY - 52);
        ctx.lineTo(rx, floorY - 5);
        ctx.stroke();
      }
    }

    // 2. Fortress Floor with Navy Red Carpet
    this.drawFortressFloor(ctx, camX, width, height, floorY, floorH);
  }

  // Marine Flag with Navy Seagull
  private static drawMarineFlag(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    ctx.save();
    ctx.translate(x, y);

    // Pole
    ctx.fillStyle = '#334155';
    ctx.fillRect(-2, -55, 4, 60);
    ctx.fillStyle = '#f59e0b'; // Gold finial
    ctx.beginPath();
    ctx.arc(0, -56, 4, 0, Math.PI * 2);
    ctx.fill();

    // Flag fabric waving
    const wave = Math.sin(time * 5 + x) * 4;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(2, -52);
    ctx.quadraticCurveTo(24, -54 + wave, 48, -52);
    ctx.lineTo(44, -26 + wave);
    ctx.quadraticCurveTo(22, -28 + wave, 2, -26);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Marine Blue Seagull Symbol
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(18, -40 + wave * 0.5, 6, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(28, -40 + wave * 0.5, 6, Math.PI, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // Execution Post in the Courtyard (Zoro bound)
  private static drawExecutionPost(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    freed: boolean,
    time: number
  ) {
    ctx.save();
    ctx.translate(x, y);

    // Ground Dirt/Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wooden Crucifixion Post (Vertical Beam)
    ctx.fillStyle = '#5c3d2e';
    ctx.fillRect(-8, -100, 16, 100);
    ctx.strokeStyle = '#2b1810';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-8, -100, 16, 100);

    // Horizontal Crossbeam
    ctx.fillStyle = '#6d4834';
    ctx.fillRect(-45, -80, 90, 14);
    ctx.strokeRect(-45, -80, 90, 14);

    if (freed) {
      // Cut/broken ropes dangling
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-35, -80);
      ctx.lineTo(-30, -60);
      ctx.moveTo(35, -80);
      ctx.lineTo(30, -60);
      ctx.moveTo(0, -60);
      ctx.lineTo(4, -40);
      ctx.stroke();
    } else {
      // Zoro bound with ropes!
      // Arms stretched across horizontal beam
      ctx.fillStyle = '#ffcca0'; // Skin
      ctx.fillRect(-38, -78, 76, 10);

      // White shirt torso
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-12, -72, 24, 32);

      // Green Haramaki sash
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(-12, -54, 24, 14);

      // Dark pants & boots
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-10, -40, 20, 36);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-11, -6, 22, 7);

      // Head with Moss-Green hair
      ctx.fillStyle = '#ffcca0';
      ctx.beginPath();
      ctx.arc(0, -82, 10, 0, Math.PI * 2);
      ctx.fill();
      // Green spiky hair
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, -84, 11, Math.PI, Math.PI * 2);
      ctx.fill();

      // Thick Ropes tied around torso and arms
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-32, -78);
      ctx.lineTo(-24, -70);
      ctx.moveTo(24, -78);
      ctx.lineTo(32, -70);
      ctx.moveTo(-12, -66);
      ctx.lineTo(12, -66);
      ctx.moveTo(-12, -58);
      ctx.lineTo(12, -58);
      ctx.moveTo(-12, -50);
      ctx.lineTo(12, -50);
      ctx.stroke();

      // Exhaustion sweat / breathe
      const breath = Math.sin(time * 2) * 1;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
      ctx.beginPath();
      ctx.arc(7, -84 + breath, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Courtyard Stone Ground
  private static drawCourtyardGround(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number,
    groundY: number,
    groundH: number
  ) {
    // Stone Courtyard Cobblestones
    const groundGrad = ctx.createLinearGradient(0, groundY, 0, height);
    groundGrad.addColorStop(0, '#e2d9c2');
    groundGrad.addColorStop(0.3, '#d5c7a5');
    groundGrad.addColorStop(0.7, '#c2b28f');
    groundGrad.addColorStop(1, '#a89874');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, groundY, width, groundH);

    // Stone Pavers Grid with Perspective
    ctx.strokeStyle = '#a89874';
    ctx.lineWidth = 1.5;
    const paverW = 64;
    const startX = -((camX) % paverW);
    for (let px = startX - paverW; px < width + paverW; px += paverW) {
      ctx.beginPath();
      ctx.moveTo(px, groundY);
      ctx.lineTo(px, height);
      ctx.stroke();
    }

    // Horizontal depth lines
    const hSteps = [0.15, 0.35, 0.6, 0.85];
    hSteps.forEach((s) => {
      const lineY = groundY + groundH * s;
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(width, lineY);
      ctx.stroke();
    });
  }

  // Fortress Stone Floor with Red Carpet
  private static drawFortressFloor(
    ctx: CanvasRenderingContext2D,
    camX: number,
    width: number,
    height: number,
    floorY: number,
    floorH: number
  ) {
    // Polished Marble Base
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, height);
    floorGrad.addColorStop(0, '#64748b');
    floorGrad.addColorStop(0.5, '#475569');
    floorGrad.addColorStop(1, '#334155');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, width, floorH);

    // Velvet Crimson Red Carpet Runner along the center
    const carpetY = floorY + floorH * 0.25;
    const carpetH = floorH * 0.55;
    ctx.fillStyle = '#991b1b';
    ctx.fillRect(0, carpetY, width, carpetH);
    ctx.strokeStyle = '#f59e0b'; // Gold border trim
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, carpetY);
    ctx.lineTo(width, carpetY);
    ctx.moveTo(0, carpetY + carpetH);
    ctx.lineTo(width, carpetY + carpetH);
    ctx.stroke();
  }

  // Zoro's Three Swords Item / Chest
  public static drawSwordsItem(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    ctx.save();
    const bob = Math.sin(time * 6) * 3;
    ctx.translate(x, y + bob);

    // Glowing Golden Aura
    ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
    ctx.beginPath();
    ctx.arc(0, -12, 22, 0, Math.PI * 2);
    ctx.fill();

    // 3 Katanas tied with purple cord:
    // 1. Wado Ichimonji (White scabbard)
    ctx.save();
    ctx.rotate(-0.25);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-22, -14, 44, 4);
    ctx.fillStyle = '#fbbf24'; // Gold tsuba guard
    ctx.fillRect(-2, -16, 4, 8);
    ctx.fillStyle = '#ffffff'; // White hilt
    ctx.fillRect(6, -15, 14, 5);
    ctx.restore();

    // 2. Sandai Kitetsu (Red scabbard)
    ctx.save();
    ctx.rotate(0.15);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-20, -10, 42, 4);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-2, -12, 4, 8);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(8, -11, 12, 5);
    ctx.restore();

    // 3. Third Katana (Black/Gold)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-20, -6, 42, 4);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-2, -8, 4, 8);

    // Sparkles
    for (let i = 0; i < 3; i++) {
      const spX = Math.sin(time * 5 + i * 2) * 16;
      const spY = -12 + Math.cos(time * 4 + i * 2) * 12;
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(spX, spY, 2.5, 2.5);
    }

    ctx.restore();
  }

  // ==========================================
  // 2. MONKEY D. LUFFY SPRITE (ACCURATE GBA REFERENCE)
  // Exact recreation of the sprite from images_1d8d10f8.png & images (3).jpeg
  // ==========================================
  public static drawLuffy(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    z: number,
    facing: 1 | -1,
    action: string,
    actionTimer: number,
    walkFrame: number
  ) {
    ctx.save();
    ctx.translate(x, y - z);
    ctx.scale(facing, 1);

    // Shadow on deck (scales with jump height Z)
    const shadowScale = Math.max(0.4, 1 - z / 120);
    ctx.save();
    ctx.translate(0, z);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.32)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 26 * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Body Bobbing (subtle breathing in idle, energetic in walk)
    const bounceY = action === 'WALK' ? Math.sin(walkFrame * 0.4) * 3 : Math.sin(walkFrame * 0.15) * 1;

    // --- LEGS & SANDALS ---
    if (action === 'PISTOL') {
      // Deep low battle crouch (Matches Screenshot 1 & images (3).jpeg)
      // Back leg stretched behind
      ctx.fillStyle = '#ffcca0'; // Skin
      ctx.fillRect(-22, -18, 11, 18);
      ctx.fillStyle = '#1976d2'; // Royal Blue Shorts
      ctx.fillRect(-24, -28, 14, 12);
      ctx.fillStyle = '#ffffff'; // Crisp White Folded Cuff
      ctx.fillRect(-24, -18, 14, 3.5);
      // Sandal with black strap
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-24, -3, 14, 3.5);
      ctx.fillStyle = '#111111';
      ctx.fillRect(-20, -5, 3, 2);

      // Front leg bent forward
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(8, -16, 11, 16);
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(6, -26, 14, 12);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(6, -16, 14, 3.5);
      // Front sandal
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(6, -2, 14, 3.5);
      ctx.fillStyle = '#111111';
      ctx.fillRect(10, -4, 3, 2);

      // Shorts Pelvis
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(-16, -34, 30, 12);

    } else if (action === 'IDLE') {
      // ==========================================
      // ICONIC READY BOXER STANCE (images_1d8d10f8.png)
      // Legs spaced apart, knees slightly bent in martial arts stance
      // ==========================================
      // Back Leg (left leg, slightly behind)
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(-13, -19 + bounceY, 9, 19);
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(-15, -31 + bounceY, 13, 13);
      ctx.fillStyle = '#ffffff'; // White cuff
      ctx.fillRect(-15, -20 + bounceY, 13, 3.5);
      // Back Sandal
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-16, -2 + bounceY, 13, 3.5);
      ctx.fillStyle = '#111111';
      ctx.fillRect(-12, -4 + bounceY, 3, 2);

      // Front Leg (right leg, stepped forward)
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(6, -18 + bounceY, 9, 18);
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(4, -30 + bounceY, 13, 13);
      ctx.fillStyle = '#ffffff'; // White cuff
      ctx.fillRect(4, -19 + bounceY, 13, 3.5);
      // Front Sandal
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(4, -2 + bounceY, 13, 3.5);
      ctx.fillStyle = '#111111';
      ctx.fillRect(8, -4 + bounceY, 3, 2);

      // Shorts Pelvis
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(-14, -38 + bounceY, 29, 13);

    } else {
      // Normal Walking / Jumping Legs
      const legSwing = action === 'WALK' ? Math.sin(walkFrame * 0.35) * 12 : 0;

      // Back Leg
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(-11 - legSwing * 0.4, -22 + bounceY, 8, 22);
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(-13 - legSwing * 0.4, -32 + bounceY, 12, 13);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-13 - legSwing * 0.4, -22 + bounceY, 12, 3.5);
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-13 - legSwing * 0.4, -2 + bounceY, 12, 3.5);

      // Front Leg
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(4 + legSwing * 0.4, -22 + bounceY, 8, 22);
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(2 + legSwing * 0.4, -32 + bounceY, 12, 13);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(2 + legSwing * 0.4, -22 + bounceY, 12, 3.5);
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(2 + legSwing * 0.4, -2 + bounceY, 12, 3.5);

      // Shorts Pelvis
      ctx.fillStyle = '#1976d2';
      ctx.fillRect(-13, -38 + bounceY, 27, 12);
    }

    // Yellow Sash / Waistband
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-14, action === 'PISTOL' ? -35 : -39 + bounceY, 29, 3.5);

    // --- TORSO (RED VEST & BARE CHEST) ---
    const torsoY = action === 'PISTOL' ? -52 : -56 + bounceY;
    // Bare chest skin
    ctx.fillStyle = '#ffcca0';
    ctx.fillRect(-9, torsoY, 20, 20);
    // Collarbone and muscle lines
    ctx.strokeStyle = '#e09f67';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-4, torsoY + 4);
    ctx.lineTo(6, torsoY + 4);
    ctx.moveTo(1, torsoY + 4);
    ctx.lineTo(1, torsoY + 16);
    ctx.stroke();

    // Red Sleeveless Vest Flaps
    ctx.fillStyle = '#e53935'; // Vibrant anime red
    ctx.fillRect(-13, torsoY - 2, 7, 22);
    ctx.fillRect(8, torsoY - 2, 7, 22);
    // Vest black outline
    ctx.strokeStyle = '#212529';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-13, torsoY - 2, 7, 22);
    ctx.strokeRect(8, torsoY - 2, 7, 22);

    // Yellow buttons on the red vest (as seen in reference!)
    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.arc(8, torsoY + 5, 1.5, 0, Math.PI * 2);
    ctx.arc(8, torsoY + 11, 1.5, 0, Math.PI * 2);
    ctx.arc(8, torsoY + 17, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // --- HEAD & FACE ---
    const headY = action === 'PISTOL' ? -64 : -68 + bounceY;
    // Neck
    ctx.fillStyle = '#ffcca0';
    ctx.fillRect(-4, headY + 8, 10, 6);

    // Head oval
    ctx.fillStyle = '#ffcca0';
    ctx.beginPath();
    ctx.arc(2, headY, 12.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#212529';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // ==========================================
    // HAIR: EXACT BLACK SPIKES FROM REFERENCE
    // (Notice in images_1d8d10f8.png: 3 spikes framing face + back tufts)
    // ==========================================
    ctx.fillStyle = '#111111';
    // Back hair dome
    ctx.beginPath();
    ctx.arc(2, headY - 4, 13.5, Math.PI, Math.PI * 2);
    ctx.fill();

    // Back flaring tufts behind neck
    ctx.beginPath();
    ctx.moveTo(-11, headY - 2);
    ctx.lineTo(-17, headY + 5);
    ctx.lineTo(-12, headY + 9);
    ctx.lineTo(-7, headY + 4);
    ctx.closePath();
    ctx.fill();

    // Front bangs poking down under hat brim onto forehead
    // Spike 1 (left)
    ctx.beginPath();
    ctx.moveTo(-7, headY - 8);
    ctx.lineTo(-8, headY - 1);
    ctx.lineTo(-4, headY - 7);
    ctx.closePath();
    ctx.fill();
    // Spike 2 (middle forehead)
    ctx.beginPath();
    ctx.moveTo(-2, headY - 8);
    ctx.lineTo(0, headY - 2);
    ctx.lineTo(3, headY - 7);
    ctx.closePath();
    ctx.fill();
    // Spike 3 (right cheek)
    ctx.beginPath();
    ctx.moveTo(5, headY - 7);
    ctx.lineTo(8, headY - 1);
    ctx.lineTo(9, headY - 6);
    ctx.closePath();
    ctx.fill();

    // ==========================================
    // STRAW HAT (GOLDEN YELLOW WITH RED RIBBON)
    // Exact shape & tilt from images_1d8d10f8.png
    // ==========================================
    const hatY = headY - 8;
    // Straw Hat Brim (Curved ellipse)
    ctx.fillStyle = '#ffd500';
    ctx.beginPath();
    ctx.ellipse(3, hatY, 24, 6.5, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Red Ribbon on Straw Hat
    ctx.fillStyle = '#b71c1c'; // Deep rich crimson red
    ctx.fillRect(-6, hatY - 12, 18, 5.5);
    ctx.strokeStyle = '#212529';
    ctx.lineWidth = 1;
    ctx.strokeRect(-6, hatY - 12, 18, 5.5);

    // Straw Hat Crown (Dome)
    ctx.fillStyle = '#ffd500';
    ctx.beginPath();
    ctx.ellipse(3, hatY - 11, 11, 8.5, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8b5a2b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Crown shading on right side
    ctx.fillStyle = '#e6b800';
    ctx.beginPath();
    ctx.ellipse(7, hatY - 11, 5, 7.5, 0, Math.PI, Math.PI * 2);
    ctx.fill();

    // ==========================================
    // EYES, SCAR & SIGNATURE SMIRK
    // ==========================================
    // Anime Eye (Black border, white sclera, black round pupil)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(6, headY - 1, 3.5, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Black pupil with highlight
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(6.5, headY - 1, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(7.5, headY - 2, 1, 1);

    // Determined anime eyebrow angled downward
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(3, headY - 6);
    ctx.lineTo(9, headY - 4.5);
    ctx.stroke();

    // Iconic 2-stitch scar under left eye
    ctx.strokeStyle = '#b71c1c';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(4, headY + 4.5);
    ctx.lineTo(9.5, headY + 4.5);
    ctx.moveTo(5.5, headY + 2.5);
    ctx.lineTo(5.5, headY + 6);
    ctx.moveTo(8, headY + 2.5);
    ctx.lineTo(8, headY + 6);
    ctx.stroke();

    // Signature Confident Smirk
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(5, headY + 6, 4.5, 0.1, Math.PI * 0.95);
    ctx.stroke();

    // ==========================================
    // ARMS & ATTACKS
    // ==========================================
    if (action === 'PISTOL') {
      // GOMU GOMU NO PISTOL (Holding hat with left hand, giant open palm!)
      const stretchLength = Math.min(270, 70 + actionTimer * 22);

      // LEFT ARM: Raised to firmly hold down the Straw Hat!
      ctx.fillStyle = '#ffcca0';
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-10, torsoY + 2);
      ctx.lineTo(-15, headY + 2);
      ctx.lineTo(-4, hatY + 1);
      ctx.stroke();
      ctx.fillRect(-16, headY - 2, 10, 8);
      // Hand on brim
      ctx.beginPath();
      ctx.ellipse(-2, hatY + 1, 5, 4, 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // RIGHT ARM: Long stretching rubber arm!
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(10, torsoY + 2, stretchLength, 12);
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(10, torsoY + 2);
      ctx.lineTo(10 + stretchLength, torsoY + 2);
      ctx.moveTo(10, torsoY + 14);
      ctx.lineTo(10 + stretchLength, torsoY + 14);
      ctx.stroke();

      // TIP: GIANT OPEN CARTOON HAND (Palm Open with 5 spread fingers)
      const handX = 10 + stretchLength;
      const handY = torsoY + 8;

      ctx.fillStyle = '#ffcca0';
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(handX + 12, handY, 16, 15, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 5 Massive Spread Fingers
      const fingers = [
        { angle: -0.65, len: 26, w: 6 },
        { angle: -0.32, len: 32, w: 6.5 },
        { angle: 0.0, len: 34, w: 7 },
        { angle: 0.32, len: 30, w: 6.5 },
        { angle: 0.62, len: 24, w: 6 },
      ];

      fingers.forEach((f) => {
        ctx.save();
        ctx.translate(handX + 14, handY);
        ctx.rotate(f.angle);
        ctx.fillStyle = '#ffcca0';
        ctx.strokeStyle = '#212529';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(0, -f.w / 2, f.len, f.w, 4);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Wind Shockwave Rings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(handX - 25, handY, 18, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(handX - 55, handY, 24, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();

    } else if (action === 'IDLE') {
      // ==========================================
      // IDLE: EXACT BOXER COMBAT GUARD (images_1d8d10f8.png)
      // Left arm raised high in guard, right arm cocked at ribs
      // ==========================================
      ctx.fillStyle = '#ffcca0';
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 1.2;

      // Right Arm (Back arm, cocked back near ribcage)
      ctx.beginPath();
      ctx.roundRect(-15, torsoY + 4, 8, 14, 3);
      ctx.fill();
      ctx.stroke();
      // Right Clenched Fist
      ctx.beginPath();
      ctx.arc(-11, torsoY + 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Left Arm (Front arm, bent sharply at 90 deg, forearm raised high in front of face)
      // Upper arm pointing forward
      ctx.beginPath();
      ctx.roundRect(8, torsoY + 4, 12, 7, 3);
      ctx.fill();
      ctx.stroke();
      // Forearm pointing up
      ctx.beginPath();
      ctx.roundRect(14, torsoY - 6, 7, 14, 3);
      ctx.fill();
      ctx.stroke();
      // Left Clenched Fist raised high at chin level
      ctx.beginPath();
      ctx.arc(17.5, torsoY - 8, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

    } else if (action === 'SPECIAL') {
      // GOMU GOMU NO GATLING! Multi-fist barrage!
      const fistCount = 8;
      for (let i = 0; i < fistCount; i++) {
        const offsetLen = 60 + ((actionTimer * 45 + i * 28) % 190);
        const offsetY = torsoY - 14 + (i * 7) + Math.sin(actionTimer * 12 + i) * 8;
        
        ctx.fillStyle = '#ffcca0';
        ctx.fillRect(10, offsetY, offsetLen, 8);
        ctx.strokeStyle = '#212529';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, offsetY, offsetLen, 8);

        ctx.beginPath();
        ctx.arc(10 + offsetLen, offsetY + 4, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.strokeStyle = '#ffff00';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, torsoY - 20);
      ctx.lineTo(200, torsoY - 20);
      ctx.moveTo(20, torsoY + 30);
      ctx.lineTo(220, torsoY + 30);
      ctx.stroke();

    } else if (action === 'FINISHER') {
      // GOMU GOMU NO BAZOOKA!! Massive Dual-Arm Palm Cannon
      const blastLen = 220;
      ctx.fillStyle = '#ffcca0';
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 1.5;

      // Twin stretching arms
      ctx.fillRect(8, torsoY - 6, blastLen, 14);
      ctx.strokeRect(8, torsoY - 6, blastLen, 14);
      ctx.fillRect(8, torsoY + 12, blastLen, 14);
      ctx.strokeRect(8, torsoY + 12, blastLen, 14);

      // Giant Dual Open Palms
      const palmX = 8 + blastLen;
      ctx.beginPath();
      ctx.ellipse(palmX + 16, torsoY + 1, 24, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(palmX + 16, torsoY + 19, 24, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Huge Shockwave Cones
      ctx.strokeStyle = 'rgba(255, 214, 10, 0.9)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(palmX + 24, torsoY + 10, 50, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(palmX + 48, torsoY + 10, 75, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();

    } else if (action === 'PUNCH_1' || action === 'PUNCH_2' || action === 'PUNCH_3') {
      // Punch combo with extension
      const ext = action === 'PUNCH_3' ? 52 : 36;
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(10, torsoY + 2, ext, 11);
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(10, torsoY + 2, ext, 11);

      ctx.beginPath();
      ctx.arc(10 + ext, torsoY + 7, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillRect(-14, torsoY + 2, 7, 14);

    } else if (action === 'AIR_ATTACK') {
      // Gomu Gomu no Stamp / Aerial Kick (as in 5ZeINo_c7bc3d16.png)
      // Extended stretched leg pointing downward with speed trail!
      ctx.fillStyle = '#ffcca0';
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 1.2;

      // Arms angled back for aerodynamic balance
      ctx.fillRect(-18, torsoY - 4, 16, 7);
      ctx.strokeRect(-18, torsoY - 4, 16, 7);
      ctx.fillRect(8, torsoY - 8, 16, 7);
      ctx.strokeRect(8, torsoY - 8, 16, 7);

      // Speed lines & impact swoop
      ctx.strokeStyle = '#ffbe0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-10, torsoY - 25);
      ctx.lineTo(24, torsoY + 20);
      ctx.stroke();

    } else if (action === 'DASH') {
      // Anime ninja dash: body leaning forward, arms flung back
      ctx.fillStyle = '#ffcca0';
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 1.2;

      // Both arms stretched back behind torso
      ctx.fillRect(-22, torsoY + 2, 20, 6);
      ctx.strokeRect(-22, torsoY + 2, 20, 6);
      ctx.fillRect(-26, torsoY + 8, 22, 6);
      ctx.strokeRect(-26, torsoY + 8, 22, 6);

      // Dash speed streaks
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-35, torsoY);
      ctx.lineTo(-15, torsoY);
      ctx.moveTo(-40, torsoY + 10);
      ctx.lineTo(-20, torsoY + 10);
      ctx.stroke();

    } else {
      // Walking arms swinging
      const armSwing = Math.cos(walkFrame * 0.35) * 8;
      ctx.fillStyle = '#ffcca0';
      ctx.strokeStyle = '#212529';
      ctx.lineWidth = 1.2;

      ctx.fillRect(8 + armSwing, torsoY + 4, 7, 18);
      ctx.strokeRect(8 + armSwing, torsoY + 4, 7, 18);
      ctx.beginPath();
      ctx.arc(11.5 + armSwing, torsoY + 23, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillRect(-13 - armSwing, torsoY + 4, 7, 18);
      ctx.strokeRect(-13 - armSwing, torsoY + 4, 7, 18);
    }

    ctx.restore();
  }

  // ==========================================
  // 2B. RORONOA ZORO SPRITE (SANTORYU THREE-SWORD STYLE)
  // ==========================================
  public static drawZoro(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    z: number,
    facing: 1 | -1,
    action: string,
    actionTimer: number,
    walkFrame: number
  ) {
    ctx.save();
    ctx.translate(x, y - z);
    ctx.scale(facing, 1);

    // Ground Shadow
    const shadowScale = Math.max(0.4, 1 - z / 120);
    ctx.save();
    ctx.translate(0, z);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 28 * shadowScale, 9 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const bounceY = action === 'WALK' ? Math.sin(walkFrame * 0.4) * 2.5 : Math.sin(walkFrame * 0.15) * 1;
    const isAttacking = action.startsWith('PUNCH_') || action === 'PISTOL' || action === 'SPECIAL' || action === 'AIR_ATTACK';

    // --- LEGS & BOOTS ---
    const legSwing = action === 'WALK' ? Math.sin(walkFrame * 0.35) * 14 : 0;
    
    // Back Leg
    ctx.fillStyle = '#1e293b'; // Dark trousers
    ctx.fillRect(-12 - legSwing * 0.4, -26 + bounceY, 10, 26);
    // Dark Boots
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-13 - legSwing * 0.4, -6 + bounceY, 12, 6);

    // Front Leg
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(4 + legSwing * 0.4, -26 + bounceY, 10, 26);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4 + legSwing * 0.4, -6 + bounceY, 12, 6);

    // --- PELVIS & GREEN HARAMAKI (BELLY SASH) ---
    ctx.fillStyle = '#15803d';
    ctx.fillRect(-13, -38 + bounceY, 26, 15);
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(-13, -34 + bounceY, 26, 6);
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 1;
    ctx.strokeRect(-13, -38 + bounceY, 26, 15);

    // Three Sword Scabbards on his right hip
    ctx.save();
    ctx.translate(-10, -32 + bounceY);
    ctx.rotate(0.4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, 0, 4, 30);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(2, 0, 4, 30);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6, 0, 4, 30);
    ctx.restore();

    // --- TORSO (WHITE OPEN SHIRT) ---
    const torsoY = -56 + bounceY;
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-12, torsoY, 24, 20);
    ctx.strokeStyle = '#212529';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-12, torsoY, 24, 20);

    // Muscular Chest V-Neck
    ctx.fillStyle = '#ffcca0';
    ctx.beginPath();
    ctx.moveTo(-6, torsoY);
    ctx.lineTo(6, torsoY);
    ctx.lineTo(0, torsoY + 12);
    ctx.closePath();
    ctx.fill();

    // --- HEAD, FACE & BANDANA ---
    const headY = torsoY - 14;
    ctx.fillStyle = '#ffcca0';
    ctx.fillRect(-4, torsoY - 3, 8, 4);

    ctx.beginPath();
    ctx.arc(0, headY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (isAttacking) {
      // Black bandana wrapped tightly on head
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(0, headY - 1, 11, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
      ctx.fillRect(-10, headY - 5, 20, 6);
      ctx.beginPath();
      ctx.moveTo(-10, headY - 2);
      ctx.lineTo(-24, headY - 6);
      ctx.lineTo(-22, headY);
      ctx.closePath();
      ctx.fill();
    } else {
      // Spiky Moss-Green Hair (Marimo)
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(0, headY - 2, 11, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
      for (let i = -8; i <= 8; i += 4) {
        ctx.beginPath();
        ctx.moveTo(i, headY - 6);
        ctx.lineTo(i + 2, headY - 14);
        ctx.lineTo(i + 4, headY - 6);
        ctx.fill();
      }
    }

    // Zoro's Piercing Eyes & Serious Frown
    ctx.fillStyle = '#000000';
    ctx.fillRect(2, headY - 2, 3, 1.5);
    ctx.beginPath();
    ctx.moveTo(1, headY - 4);
    ctx.lineTo(6, headY - 3);
    ctx.stroke();

    // 3 Golden Earrings on Left Ear
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-10, headY + 1, 2, 4);
    ctx.fillRect(-8, headY + 1, 2, 4);
    ctx.fillRect(-6, headY + 1, 2, 4);

    // --- THIRD KATANA IN MOUTH (WADO ICHIMONJI) ---
    ctx.save();
    ctx.translate(2, headY + 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-18, -2, 14, 4);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-4, -4, 3, 8);
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-1, -1.5, 42, 3);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(-1, -1.5, 42, 3);
    ctx.restore();

    // --- ARMS & HANDHELD KATANAS (DYNAMIC ACTIONS) ---
    if (action === 'SPECIAL') {
      // ONI GIRI (Demon Slash) - Crossed Katana Stance / High Speed Blur
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(4, torsoY + 2, 18, 7);
      ctx.fillRect(-6, torsoY + 4, 18, 7);

      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-10, torsoY - 20);
      ctx.lineTo(50, torsoY + 25);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-10, torsoY + 30);
      ctx.lineTo(50, torsoY - 15);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-15, torsoY);
      ctx.lineTo(55, torsoY);
      ctx.stroke();

    } else if (action === 'FINISHER') {
      // SANTORYU OUGI: SANZEN SEKAI!! (Three-katana spinning whirlwind)
      const spin = actionTimer * 30;
      for (let s = 0; s < 3; s++) {
        ctx.save();
        ctx.translate(14, torsoY + 4);
        ctx.rotate(spin + (s * Math.PI * 2) / 3);
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.fillRect(0, -3.5, 90, 7);
        ctx.strokeRect(0, -3.5, 90, 7);
        // Aura
        ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
        ctx.beginPath();
        ctx.arc(45, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // Outer cutting vortex
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(14, torsoY + 4, 85, 0, Math.PI * 2);
      ctx.stroke();

    } else if (action === 'PUNCH_1') {
      // Fast Horizontal Slash with Right Katana
      const slashReach = 45;
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(8, torsoY + 2, 16, 7);
      
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(24, torsoY + 4, slashReach, 3.5);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      ctx.strokeRect(24, torsoY + 4, slashReach, 3.5);

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(35, torsoY + 5, 30, -Math.PI * 0.35, Math.PI * 0.35);
      ctx.stroke();

    } else if (action === 'PUNCH_2') {
      // Upward Diagonal Slash with Left Katana
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(6, torsoY + 2, 14, 7);

      ctx.save();
      ctx.translate(20, torsoY + 5);
      ctx.rotate(-0.7);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, -2, 50, 3.5);
      ctx.restore();

      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(25, torsoY - 5, 32, -Math.PI * 0.5, Math.PI * 0.2);
      ctx.stroke();

    } else if (action === 'PUNCH_3') {
      // SANTORYU CROSS SLASH (Both arms slashed out forward!)
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(8, torsoY - 2, 22, 6);
      ctx.fillRect(8, torsoY + 8, 22, 6);

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(30, torsoY - 8, 48, 3.5);
      ctx.fillRect(30, torsoY + 12, 48, 3.5);

      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(45, torsoY + 5, 42, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();

    } else if (action === 'PISTOL') {
      // FLYING SLASH (Iai / Wind Blade Projectile)
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(6, torsoY + 2, 20, 7);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(26, torsoY + 4, 52, 3.5);

      const projX = 85 + actionTimer * 12;
      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(projX, torsoY + 5, 24, -Math.PI * 0.4, Math.PI * 0.4);
      ctx.stroke();

    } else if (action === 'AIR_ATTACK') {
      // Aerial diving dual blade plunge
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(4, torsoY + 6, 12, 14);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, torsoY + 20, 3.5, 45);
      ctx.fillRect(14, torsoY + 20, 3.5, 45);

    } else if (action === 'DASH') {
      // Slicing dash
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(6, torsoY + 4, 18, 6);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(24, torsoY + 5, 40, 3.5);
    } else {
      // IDLE / WALK: Classic Santoryu Battle Stance
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(8, torsoY + 4, 10, 10);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(16, torsoY + 6, 30, 3);

      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(-8, torsoY + 4, 10, 10);
      ctx.save();
      ctx.translate(-4, torsoY + 6);
      ctx.rotate(-0.5);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-28, -1.5, 30, 3);
      ctx.restore();
    }

    ctx.restore();
  }

  // ==========================================
  // 2C. MARINE GRUNT SPRITE (SHELLS TOWN NAVY SOLDIER)
  // ==========================================
  public static drawMarineGrunt(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    z: number,
    facing: 1 | -1,
    action: string,
    actionTimer: number,
    walkFrame: number,
    isGunner: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y - z);
    ctx.scale(facing, 1);

    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    const bounceY = action === 'WALK' ? Math.sin(walkFrame * 0.4) * 2 : 0;
    const legSwing = action === 'WALK' ? Math.sin(walkFrame * 0.35) * 10 : 0;

    // White Sailor Trousers
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(-10 - legSwing * 0.3, -24 + bounceY, 8, 24);
    ctx.fillRect(2 + legSwing * 0.3, -24 + bounceY, 8, 24);
    // Black Boots
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-11 - legSwing * 0.3, -6 + bounceY, 10, 6);
    ctx.fillRect(2 + legSwing * 0.3, -6 + bounceY, 10, 6);

    // Torso (White Sailor Blouse with Navy Blue Collar Flap)
    const torsoY = -48 + bounceY;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-11, torsoY, 22, 24);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.strokeRect(-11, torsoY, 22, 24);

    // Navy Blue Sailor Collar & Necktie
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(-11, torsoY);
    ctx.lineTo(11, torsoY);
    ctx.lineTo(0, torsoY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-2, torsoY + 8, 4, 8);

    // Head
    const headY = torsoY - 12;
    ctx.fillStyle = '#ffcca0';
    ctx.beginPath();
    ctx.arc(0, headY, 9, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000000';
    ctx.fillRect(2, headY - 2, 2.5, 2);

    // White Sailor Cap with Blue Ribbon ("MARINE")
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, headY - 7, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, headY - 6);
    ctx.lineTo(12, headY - 6);
    ctx.stroke();
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-14, headY - 5, 4, 10);
    ctx.fillRect(-11, headY - 5, 3, 8);

    // Weapon
    if (isGunner) {
      ctx.fillStyle = '#78350f';
      ctx.fillRect(2, torsoY + 4, 34, 4);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(26, torsoY + 3, 22, 3);
      if (action === 'ATTACK') {
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.arc(52, torsoY + 4, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#ffcca0';
      ctx.fillRect(6, torsoY + 4, 8, 8);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(12, torsoY + 2, 3, 10);
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      if (action === 'ATTACK') {
        ctx.fillRect(15, torsoY + 5, 36, 4);
        ctx.strokeRect(15, torsoY + 5, 36, 4);
      } else {
        ctx.fillRect(14, torsoY + 2, 4, 28);
        ctx.strokeRect(14, torsoY + 2, 4, 28);
      }
    }

    ctx.restore();
  }

  // ==========================================
  // 2D. CAPTAIN "AXE-HAND" MORGAN (BOSS)
  // Imposing Giant Navy Captain with Massive Steel Axe Forearm
  // ==========================================
  public static drawMorgan(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    z: number,
    facing: 1 | -1,
    action: string,
    actionTimer: number,
    walkFrame: number
  ) {
    ctx.save();
    ctx.translate(x, y - z);
    ctx.scale(facing * 1.35, 1.35);

    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 32, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    const bounceY = action === 'WALK' ? Math.sin(walkFrame * 0.3) * 3 : Math.sin(walkFrame * 0.15) * 1.5;
    const legSwing = action === 'WALK' ? Math.sin(walkFrame * 0.3) * 12 : 0;

    // Muscular Legs & Dark Navy Boots
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(-14 - legSwing * 0.3, -32 + bounceY, 12, 32);
    ctx.fillRect(4 + legSwing * 0.3, -32 + bounceY, 12, 32);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-15 - legSwing * 0.3, -8 + bounceY, 14, 8);
    ctx.fillRect(4 + legSwing * 0.3, -8 + bounceY, 14, 8);

    // Torso: Imposing Muscular Build & Open Navy Greatcoat
    const torsoY = -68 + bounceY;
    ctx.fillStyle = '#ffcca0';
    ctx.fillRect(-14, torsoY + 6, 28, 30);
    ctx.strokeStyle = '#e07a5f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-10, torsoY + 16);
    ctx.lineTo(10, torsoY + 16);
    ctx.moveTo(0, torsoY + 10);
    ctx.lineTo(0, torsoY + 32);
    ctx.stroke();

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-22, torsoY, 8, 48);
    ctx.fillRect(14, torsoY, 8, 48);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-24, torsoY - 2, 12, 6);
    ctx.fillRect(12, torsoY - 2, 12, 6);

    // Head: Blonde Slicked Hair & STEEL JAW BRACE
    const headY = torsoY - 14;
    ctx.fillStyle = '#ffcca0';
    ctx.beginPath();
    ctx.arc(0, headY, 12, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, headY - 4, 13, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.fillRect(2, headY - 2, 3, 2);

    // Metal Jaw Mask
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-10, headY + 2, 20, 12);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-10, headY + 2, 20, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-1, headY + 4, 2, 8);
    ctx.fillRect(-4, headY + 7, 8, 2);

    // --- MASSIVE STEEL AXE HAND ---
    ctx.fillStyle = '#ffcca0';
    ctx.fillRect(8, torsoY + 4, 12, 12);
    ctx.fillStyle = '#334155';
    ctx.fillRect(18, torsoY + 6, 8, 12);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(20, torsoY + 7, 2, 2);
    ctx.fillRect(20, torsoY + 13, 2, 2);

    if (action === 'SLAM') {
      ctx.save();
      ctx.translate(22, torsoY + 10);
      ctx.rotate(0.9);
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(28, 0, 36, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.lineTo(0, 10);
      ctx.lineTo(0, -10);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(45, 0, 28, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();

    } else if (action === 'SPIN') {
      const spinAngle = actionTimer * 8;
      ctx.save();
      ctx.translate(10, torsoY + 10);
      ctx.rotate(spinAngle);
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(32, 0, 42, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.lineTo(0, 12);
      ctx.lineTo(0, -12);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, torsoY + 10, 60, 0, Math.PI * 2);
      ctx.stroke();

    } else if (action === 'ATTACK') {
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(52, torsoY + 10, 38, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.lineTo(24, torsoY + 20);
      ctx.lineTo(24, torsoY);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

    } else {
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(42, torsoY + 12, 32, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.lineTo(24, torsoY + 20);
      ctx.lineTo(24, torsoY + 4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(48, torsoY + 6, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ==========================================
  // 3. PIRATE MINION SPRITE (ALVIDA'S CREW)
  // Exact match to user screenshot: Pink Bandana, Pink Striped Shirt, Green Pants, Floating Heart!
  // ==========================================
  public static drawPirateGrunt(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    z: number,
    facing: 1 | -1,
    action: string,
    actionTimer: number,
    isBrute: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y - z);
    ctx.scale(facing, 1);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 0, isBrute ? 30 : 22, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    const scale = isBrute ? 1.3 : 1.0;
    ctx.scale(scale, scale);

    // A. PUFFY GREEN PIRATE PANTS & GREEN POINTED SHOES
    // (Exact match: baggy green trousers in screenshot!)
    const pantsColor = isBrute ? '#1b4332' : '#2d6a4f';
    const darkPants = isBrute ? '#081c15' : '#1b4332';
    
    // Left leg
    ctx.fillStyle = pantsColor;
    ctx.beginPath();
    ctx.ellipse(-6, -15, 7, 12, -0.15, 0, Math.PI * 2);
    ctx.fill();
    // Right leg
    ctx.beginPath();
    ctx.ellipse(6, -15, 7, 12, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Dark green pointed pirate shoes
    ctx.fillStyle = '#081c15';
    ctx.beginPath();
    ctx.roundRect(-12, -6, 11, 7, 2);
    ctx.roundRect(3, -6, 11, 7, 2);
    ctx.fill();

    // B. PINK & WHITE STRIPED PIRATE T-SHIRT (Exact match to screenshot!)
    const shirtY = -48;
    const shirtPink = '#ff4081'; // Vibrant pink stripe
    const shirtWhite = '#ffffff';

    ctx.fillStyle = shirtPink;
    ctx.fillRect(-11, shirtY, 22, 28);
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-11, shirtY, 22, 28);

    // Horizontal White Stripes
    ctx.fillStyle = shirtWhite;
    ctx.fillRect(-10, shirtY + 4, 20, 4);
    ctx.fillRect(-10, shirtY + 12, 20, 4);
    ctx.fillRect(-10, shirtY + 20, 20, 4);

    // Dark Leather Belt with Golden Buckle
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(-11, -22, 22, 5);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-3, -22, 6, 5);

    // C. HEAD, PINK BANDANA & EXPRESSIVE ANIME FACE
    const headY = -58;
    ctx.fillStyle = '#ffcca0';
    ctx.beginPath();
    ctx.arc(0, headY, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Pink Bandana wrapping top of head
    ctx.fillStyle = '#ff4081';
    ctx.beginPath();
    ctx.arc(0, headY - 3, 11.5, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.stroke();

    // Bandana knot and flapping tails on back
    ctx.fillStyle = '#ff4081';
    ctx.beginPath();
    ctx.moveTo(-10, headY - 2);
    ctx.lineTo(-20, headY + 2);
    ctx.lineTo(-18, headY + 8);
    ctx.lineTo(-10, headY + 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Goofy pirate eyes with teeth smirk
    ctx.fillStyle = '#111111';
    ctx.beginPath();
    ctx.arc(4, headY - 1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(5, headY - 2, 1, 1);

    // Wide comical grin with teeth
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(2, headY + 4.5, 5.5, 0.1, Math.PI * 0.9);
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.stroke();

    // D. CURVED SHINY CUTLASS (SWORD)
    const weaponSwing = action === 'ATTACK' ? Math.sin(actionTimer * 12) * 25 : 0;
    ctx.save();
    ctx.translate(12, -36);
    ctx.rotate(action === 'ATTACK' ? 0.8 + weaponSwing * 0.05 : -0.25);

    // Golden Hilt & Crossguard
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-3, 0, 9, 6);
    ctx.fillRect(0, -6, 4, 7);

    // Curved Silver Cutlass Blade
    ctx.fillStyle = '#edf2f4';
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(1, -6);
    ctx.lineTo(3, -34);
    ctx.quadraticCurveTo(11, -30, 7, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Blade shine highlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(3, -30, 2, 20);
    ctx.restore();

    // E. FLOATING PINK HEART (Exact detail in user screenshot!)
    // Notice the floating heart above the pirate in the user's uploaded image!
    const heartBounce = Math.sin(actionTimer * 8) * 3;
    ctx.fillStyle = '#ff4081';
    ctx.beginPath();
    ctx.arc(-2, headY - 26 + heartBounce, 4, 0, Math.PI * 2);
    ctx.arc(3, headY - 26 + heartBounce, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-6, headY - 24 + heartBounce);
    ctx.lineTo(7, headY - 24 + heartBounce);
    ctx.lineTo(0.5, headY - 17 + heartBounce);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // ==========================================
  // 4. BOSS: LADY ALVIDA WITH GIANT KANABŌ (IRON MACE)
  // ==========================================
  public static drawAlvida(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    z: number,
    facing: 1 | -1,
    action: string,
    actionTimer: number
  ) {
    ctx.save();
    ctx.translate(x, y - z);
    ctx.scale(facing, 1);

    // Heavy Boss Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 42, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Scale up Alvida for imposing presence
    ctx.scale(1.45, 1.45);

    // Thick Legs & Brown Boots with Gold Buckles
    ctx.fillStyle = '#ffccd5';
    ctx.fillRect(-15, -22, 12, 22);
    ctx.fillRect(3, -22, 12, 22);

    ctx.fillStyle = '#4a2810';
    ctx.fillRect(-17, -9, 14, 10);
    ctx.fillRect(3, -9, 14, 10);
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-12, -7, 4, 4);
    ctx.fillRect(8, -7, 4, 4);

    // Massive Body / Hot Pink Pirate Robe
    ctx.fillStyle = '#e60067';
    ctx.beginPath();
    ctx.ellipse(0, -38, 24, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Gold Waistband / Belt
    ctx.fillStyle = '#ffd166';
    ctx.fillRect(-22, -32, 44, 7);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(-5, -33, 10, 9);

    // Head with Prominent Double Chin
    const headY = -68;
    ctx.fillStyle = '#ffcca0';
    ctx.beginPath();
    ctx.ellipse(0, headY, 17, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Double chin bulge
    ctx.beginPath();
    ctx.arc(0, headY + 11, 8.5, 0, Math.PI);
    ctx.fill();
    ctx.stroke();

    // Alvida's Face: Bright Red Lipstick & Piercing Eyes
    ctx.fillStyle = '#d90429';
    ctx.beginPath();
    ctx.ellipse(4, headY + 6, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Fierce black anime eyes with mascara
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(6, headY - 1, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(3, headY - 5);
    ctx.lineTo(12, headY - 4);
    ctx.stroke();

    // Purple Wide-Brimmed Cowgirl Hat with Big White Plume Feather
    const hatY = headY - 10;
    ctx.fillStyle = '#6a0dad'; // Deep Purple
    ctx.beginPath();
    ctx.ellipse(0, hatY, 30, 9, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillRect(-13, hatY - 13, 26, 13);
    ctx.strokeRect(-13, hatY - 13, 26, 13);

    // Giant White Plume Feather curving back
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(12, hatY - 8);
    ctx.quadraticCurveTo(36, hatY - 26, 44, hatY - 9);
    ctx.quadraticCurveTo(30, hatY - 16, 12, hatY - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // --- GIANT STUDDED IRON MACE (KANABŌ) ---
    ctx.save();
    if (action === 'SLAM') {
      ctx.translate(26, -10);
      ctx.rotate(0.65);
    } else if (action === 'ATTACK_WINDUP') {
      ctx.translate(12, -64);
      ctx.rotate(-1.15);
    } else if (action === 'SPIN') {
      ctx.translate(Math.sin(actionTimer * 20) * 16, -42);
      ctx.rotate(actionTimer * 24);
    } else {
      ctx.translate(18, -44);
      ctx.rotate(0.38);
    }

    // Heavy Black Iron Shaft
    ctx.fillStyle = '#1b1d20';
    ctx.fillRect(-5, -48, 10, 56);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-5, -48, 10, 56);

    // Mace Spiked Head
    ctx.fillStyle = '#111215';
    ctx.fillRect(-9, -52, 18, 30);
    ctx.strokeRect(-9, -52, 18, 30);

    // Gleaming Silver Conical Iron Spikes
    ctx.fillStyle = '#e2e8f0';
    const spikeYs = [-48, -40, -32];
    spikeYs.forEach((sy) => {
      // Left Spikes
      ctx.beginPath();
      ctx.moveTo(-9, sy);
      ctx.lineTo(-16, sy + 3);
      ctx.lineTo(-9, sy + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Right Spikes
      ctx.beginPath();
      ctx.moveTo(9, sy);
      ctx.lineTo(16, sy + 3);
      ctx.lineTo(9, sy + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    ctx.restore();
    ctx.restore();
  }

  // ==========================================
  // 5. OAK BARREL, MEAT & BERRIES
  // ==========================================
  public static drawBarrel(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isCracked: boolean = false
  ) {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wood Barrel Body
    ctx.fillStyle = '#9c6644';
    ctx.beginPath();
    ctx.ellipse(0, -19, 17, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Vertical Plank Seams
    ctx.fillStyle = '#b08968';
    ctx.fillRect(-11, -36, 6, 35);
    ctx.fillRect(5, -36, 6, 35);

    // Metal Iron Hoops
    ctx.fillStyle = '#374151';
    ctx.fillRect(-17, -31, 34, 4);
    ctx.fillRect(-17, -11, 34, 4);

    if (isCracked) {
      ctx.strokeStyle = '#1b110a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-5, -34);
      ctx.lineTo(3, -20);
      ctx.lineTo(-3, -10);
      ctx.stroke();
    }

    ctx.restore();
  }

  public static drawMeat(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    ctx.save();
    const bob = Math.sin(time * 5) * 4;
    ctx.translate(x, y + bob);

    // Golden Sparkle Ring
    ctx.fillStyle = 'rgba(255, 215, 0, 0.35)';
    ctx.beginPath();
    ctx.arc(0, -13, 22, 0, Math.PI * 2);
    ctx.fill();

    // White Bone Knobs
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(-17, -16, 4.5, 0, Math.PI * 2);
    ctx.arc(-17, -10, 4.5, 0, Math.PI * 2);
    ctx.arc(17, -16, 4.5, 0, Math.PI * 2);
    ctx.arc(17, -10, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Bone Shaft
    ctx.fillRect(-17, -15, 34, 4);

    // Roasted Manga Meat Drum (Manga Niku!)
    ctx.fillStyle = '#934b00';
    ctx.beginPath();
    ctx.ellipse(0, -13, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Crispy grill marks
    ctx.fillStyle = '#5c2c00';
    ctx.fillRect(-9, -18, 3, 11);
    ctx.fillRect(0, -19, 3, 13);
    ctx.fillRect(9, -17, 3, 10);

    ctx.restore();
  }

  public static drawCoin(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    ctx.save();
    const bob = Math.sin(time * 6) * 3;
    const spinWidth = Math.abs(Math.cos(time * 4)) * 10 + 2;
    ctx.translate(x, y + bob);

    ctx.fillStyle = '#ffd166';
    ctx.beginPath();
    ctx.ellipse(0, -10, spinWidth, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d48b00';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }

  public static drawCoby(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    ctx.save();
    ctx.translate(x, y);

    const cheerBounce = Math.sin(time * 6) * 4;

    // Pink Hair
    ctx.fillStyle = '#ff758f';
    ctx.beginPath();
    ctx.arc(0, -42 + cheerBounce, 11, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#ffe5d9';
    ctx.beginPath();
    ctx.arc(0, -38 + cheerBounce, 9, 0, Math.PI * 2);
    ctx.fill();

    // Round Glasses
    ctx.strokeStyle = '#212529';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(-3, -38 + cheerBounce, 3.5, 0, Math.PI * 2);
    ctx.arc(4, -38 + cheerBounce, 3.5, 0, Math.PI * 2);
    ctx.stroke();

    // Cheering mouth
    ctx.fillStyle = '#d90429';
    ctx.beginPath();
    ctx.arc(0, -32 + cheerBounce, 2.5, 0, Math.PI);
    ctx.fill();

    // Shirt & Bandana
    ctx.fillStyle = '#0077b6';
    ctx.fillRect(-7, -29 + cheerBounce, 14, 15);
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(-7, -25 + cheerBounce, 14, 3);

    // Hands waving up
    ctx.fillStyle = '#ffe5d9';
    ctx.beginPath();
    ctx.arc(-11, -38 + cheerBounce, 3.5, 0, Math.PI * 2);
    ctx.arc(11, -38 + cheerBounce, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ==========================================
  // 6. GALLEY PROPS (Exact from images_1d8d10f8.png)
  // ==========================================
  // Green Pantry Storage Cabinet with bread, sausages & food
  public static drawPantryCabinet(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);

    const w = 54;
    const h = 95;

    // Green outer frame
    ctx.fillStyle = '#43a047'; // Fresh lime-green
    ctx.fillRect(0, -h, w, h);
    ctx.strokeStyle = '#1b5e20';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, -h, w, h);

    // Inner shelves background (darker green)
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(4, -h + 8, w - 8, h - 12);

    // Shelves (3 dividers)
    const shelfY1 = -h + 28;
    const shelfY2 = -h + 50;
    const shelfY3 = -h + 72;

    ctx.fillStyle = '#81c784';
    ctx.fillRect(4, shelfY1, w - 8, 3.5);
    ctx.fillRect(4, shelfY2, w - 8, 3.5);
    ctx.fillRect(4, shelfY3, w - 8, 3.5);

    // Shelf 1 (Top): 2 Golden Loaves of Bread
    ctx.fillStyle = '#f4a261';
    ctx.beginPath();
    ctx.arc(16, shelfY1 - 7, 7, 0, Math.PI * 2);
    ctx.arc(38, shelfY1 - 7, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#b06526';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Shelf 2: Smoked Sausages
    ctx.fillStyle = '#a0522d';
    for (let s = 10; s <= 44; s += 6) {
      ctx.fillRect(s, shelfY2 - 10, 4, 10);
    }

    // Shelf 3: Storage cans / jars
    ctx.fillStyle = '#e0e1dd';
    ctx.fillRect(12, shelfY3 - 12, 6, 12);
    ctx.fillRect(22, shelfY3 - 14, 7, 14);
    ctx.fillRect(33, shelfY3 - 12, 6, 12);

    // Shelf 4 (Bottom): 2 Large Loaves of Bread
    ctx.fillStyle = '#f4a261';
    ctx.beginPath();
    ctx.arc(18, -4, 7.5, 0, Math.PI * 2);
    ctx.arc(36, -4, 7.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Slatted Wooden Crate with Red Apples
  public static drawFruitCrate(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.save();
    ctx.translate(x, y);

    const w = 46;
    const h = 32;

    // Red Apples piled up in crate
    ctx.fillStyle = '#e53935';
    const applePositions = [
      { ax: 8, ay: -h - 4 },
      { ax: 16, ay: -h - 8 },
      { ax: 24, ay: -h - 6 },
      { ax: 32, ay: -h - 9 },
      { ax: 38, ay: -h - 4 },
      { ax: 12, ay: -h },
      { ax: 22, ay: -h - 1 },
      { ax: 30, ay: -h - 2 },
    ];
    applePositions.forEach((ap) => {
      ctx.beginPath();
      ctx.arc(ap.ax, ap.ay, 4.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Wooden Crate slats
    ctx.fillStyle = '#b08968';
    ctx.fillRect(0, -h, w, h);
    ctx.strokeStyle = '#5d4037';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, -h, w, h);

    // Slats lines
    ctx.fillStyle = '#795548';
    ctx.fillRect(0, -h + 10, w, 2.5);
    ctx.fillRect(0, -h + 20, w, 2.5);

    ctx.restore();
  }

  // Breakable Standalone Wooden Crate
  public static drawCrate(ctx: CanvasRenderingContext2D, x: number, y: number, isCracked: boolean) {
    ctx.save();
    ctx.translate(x, y);

    const size = 36;
    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(size / 2, 0, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wood body
    ctx.fillStyle = '#b08968';
    ctx.fillRect(0, -size, size, size);
    ctx.strokeStyle = '#3e2723';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, -size, size, size);

    // Diagonal Cross Brace
    ctx.strokeStyle = '#795548';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(3, -size + 3);
    ctx.lineTo(size - 3, -3);
    ctx.moveTo(size - 3, -size + 3);
    ctx.lineTo(3, -3);
    ctx.stroke();

    // Iron corner brackets with rivets
    ctx.fillStyle = '#4b5563';
    ctx.fillRect(0, -size, 6, 6);
    ctx.fillRect(size - 6, -size, 6, 6);
    ctx.fillRect(0, -6, 6, 6);
    ctx.fillRect(size - 6, -6, 6, 6);

    if (isCracked) {
      ctx.strokeStyle = '#1b110a';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(size * 0.4, -size + 4);
      ctx.lineTo(size * 0.6, -size * 0.5);
      ctx.lineTo(size * 0.35, -4);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Rolling Barrel with dynamic rotational blur lines
  public static drawRollingBarrel(ctx: CanvasRenderingContext2D, x: number, y: number, rotation: number) {
    ctx.save();
    ctx.translate(x, y);

    // Dynamic ground dust & speed lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-35, -4);
    ctx.lineTo(-15, -4);
    ctx.moveTo(-30, -12);
    ctx.lineTo(-12, -12);
    ctx.stroke();

    // Ground Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rotate Barrel
    ctx.rotate(rotation);

    // Barrel circular side profile (round barrel rolling on its side)
    ctx.fillStyle = '#b08968';
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#263238';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Internal rim & staves
    ctx.strokeStyle = '#7f4f24';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 13, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating wooden cross spokes
    ctx.strokeStyle = '#4a2810';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-17, 0);
    ctx.lineTo(17, 0);
    ctx.moveTo(0, -17);
    ctx.lineTo(0, 17);
    ctx.stroke();

    // Center iron bung
    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Red Apple Item
  public static drawApple(ctx: CanvasRenderingContext2D, x: number, y: number, time: number) {
    ctx.save();
    const bob = Math.sin(time * 6) * 3;
    ctx.translate(x, y + bob);

    // Glow ring
    ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
    ctx.beginPath();
    ctx.arc(0, -10, 14, 0, Math.PI * 2);
    ctx.fill();

    // Apple body
    ctx.fillStyle = '#e63946';
    ctx.beginPath();
    ctx.arc(-4, -10, 7, 0, Math.PI * 2);
    ctx.arc(4, -10, 7, 0, Math.PI * 2);
    ctx.fill();

    // Highlight
    ctx.fillStyle = '#ff85a1';
    ctx.beginPath();
    ctx.arc(-3, -13, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Stem & Leaf
    ctx.strokeStyle = '#38b000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.quadraticCurveTo(4, -20, 6, -18);
    ctx.stroke();

    ctx.restore();
  }

  // ==========================================
  // 12. TRAVELING AERIAL SLASH & MANA EFFECTS
  // ==========================================
  public static drawAirSlash(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    facing: 1 | -1,
    time: number,
    character: 'LUFFY' | 'ZORO' = 'LUFFY'
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);

    const isZoro = character === 'ZORO';
    const mainColor = isZoro ? '#22c55e' : '#ff0055';
    const glowColor = isZoro ? 'rgba(74, 222, 128, 0.45)' : 'rgba(255, 183, 3, 0.45)';
    const coreColor = '#ffffff';

    // 1. Ambient Energy Aura / Motion Blur
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 36, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Trailing Wind Ribbons / Air Displacement
    ctx.strokeStyle = isZoro ? 'rgba(134, 239, 172, 0.6)' : 'rgba(253, 224, 71, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    for (let i = -1; i <= 1; i += 2) {
      const wave = Math.sin(time * 25 + i) * 6;
      ctx.beginPath();
      ctx.moveTo(-10, i * 14);
      ctx.quadraticCurveTo(-26, i * 22 + wave, -42, i * 8);
      ctx.stroke();
    }

    // 3. Razor Crescent Blade (Outer Curve & Inner Hollow)
    ctx.beginPath();
    // Front razor sharp convex arc
    ctx.moveTo(18, -32);
    ctx.bezierCurveTo(34, -14, 34, 14, 18, 32);
    // Back concave body
    ctx.bezierCurveTo(24, 12, 24, -12, 18, -32);
    ctx.fillStyle = mainColor;
    ctx.fill();

    // 4. Ultra-bright White Core Edge
    ctx.beginPath();
    ctx.moveTo(16, -26);
    ctx.bezierCurveTo(28, -10, 28, 10, 16, 26);
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 3;
    ctx.stroke();

    // 5. Slash Wingtips (Sharp energy thorns)
    ctx.fillStyle = coreColor;
    ctx.beginPath();
    ctx.arc(18, -32, 2.5, 0, Math.PI * 2);
    ctx.arc(18, 32, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 6. Flying Spark Flecks
    for (let s = 0; s < 3; s++) {
      const sparkX = -12 - ((time * 80 + s * 14) % 28);
      const sparkY = ((s - 1) * 12) + Math.sin(time * 30 + s) * 4;
      ctx.fillStyle = s % 2 === 0 ? '#ffffff' : mainColor;
      ctx.fillRect(sparkX, sparkY, 3, 2);
    }

    ctx.restore();
  }

  // ==========================================
  // 13. CINEMATIC MANGA SPEED LINES (HIGH COMBO FLOURISH)
  // ==========================================
  public static drawSpeedLines(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    intensity: number = 1.0,
    playerScreenX: number = width / 2,
    playerScreenY: number = height / 2
  ) {
    if (intensity <= 0) return;
    ctx.save();

    // 1. Subtle Golden/Crimson Edge Vignette Pulse
    const vignetteGrad = ctx.createRadialGradient(
      playerScreenX, playerScreenY, Math.min(width, height) * 0.28,
      playerScreenX, playerScreenY, Math.max(width, height) * 0.72
    );
    vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignetteGrad.addColorStop(0.7, `rgba(255, 183, 3, ${0.12 * intensity})`);
    vignetteGrad.addColorStop(1, `rgba(225, 29, 72, ${0.35 * intensity})`);
    ctx.fillStyle = vignetteGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. High-Speed Radial Manga Action Lines
    const numLines = 36;
    const innerRadius = Math.min(width, height) * (0.35 - intensity * 0.08);
    const outerRadius = Math.max(width, height) * 0.85;

    ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * intensity})`;
    ctx.lineWidth = 2.5;

    for (let i = 0; i < numLines; i++) {
      // Deterministic angle with jitter
      const baseAngle = (i / numLines) * Math.PI * 2;
      const jitter = Math.sin(i * 12.9898 + Math.floor(time * 18)) * 0.035;
      const angle = baseAngle + jitter;

      // Varied line start distance for natural hand-drawn manga feel
      const lineLenVariation = (Math.sin(i * 7.5 + time * 12) * 0.5 + 0.5);
      const rStart = innerRadius + lineLenVariation * 50;
      const rEnd = outerRadius + lineLenVariation * 80;

      const x1 = playerScreenX + Math.cos(angle) * rStart;
      const y1 = playerScreenY + Math.sin(angle) * rStart;
      const x2 = playerScreenX + Math.cos(angle) * rEnd;
      const y2 = playerScreenY + Math.sin(angle) * rEnd;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Bold accent speed lines with gold highlight
      if (i % 4 === 0) {
        ctx.strokeStyle = `rgba(255, 214, 10, ${0.7 * intensity})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x1 + Math.cos(angle) * 12, y1 + Math.sin(angle) * 12);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * intensity})`;
        ctx.lineWidth = 2.5;
      }
    }

    ctx.restore();
  }

  // ==========================================
  // 14. ENEMY ATTACK TELEGRAPH WARNING
  // ==========================================
  public static drawTelegraphWarning(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    isBoss: boolean = false,
    isGunner: boolean = false
  ) {
    ctx.save();

    // 1. Red Alert Exclamation Badge above head
    const badgeY = y - (isBoss ? 80 : 58);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(x, badgeY, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('!', x, badgeY + 1);

    // 2. Boss Danger Zone Ground Indicator
    if (isBoss) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.ellipse(x, y, 75, 26, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3. Gunner Aiming Laser Sight
    if (isGunner) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, y - 25);
      ctx.lineTo(x - 240, y - 25);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.restore();
  }
}

