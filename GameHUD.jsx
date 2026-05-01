import React, { useState, useEffect } from 'react';
import { Heart, Crosshair, DollarSign, Skull } from 'lucide-react';

export default function GameHUD({ gameStateRef }) {
  const [hudData, setHudData] = useState({
    hp: 100, maxHp: 100, ammo: 12, maxAmmo: 12,
    kills: 0, reloading: false, weaponName: 'Pistol',
    botsAlive: 0, totalBots: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const s = gameStateRef.current;
      if (!s) return;
      setHudData({
        hp: s.player.hp,
        maxHp: s.player.maxHp,
        ammo: s.player.weapon.currentAmmo,
        maxAmmo: s.player.weapon.ammo,
        kills: s.kills,
        reloading: s.player.reloading,
        weaponName: s.player.weapon.name,
        botsAlive: s.bots.filter(b => b.alive).length,
        totalBots: s.bots.length,
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameStateRef]);

  const hpPercent = (hudData.hp / hudData.maxHp) * 100;

  return (
    <div className="absolute top-3 left-3 right-3 flex justify-between items-start pointer-events-none z-10">
      {/* Left: HP & Weapon */}
      <div className="space-y-2">
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 flex items-center gap-3">
          <Heart className="w-5 h-5 text-destructive" />
          <div className="w-32 h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{
                width: `${hpPercent}%`,
                backgroundColor: hpPercent > 50 ? '#22c55e' : hpPercent > 25 ? '#f59e0b' : '#ef4444'
              }}
            />
          </div>
          <span className="font-heading text-sm font-bold text-foreground">{Math.ceil(hudData.hp)}</span>
        </div>
        
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 flex items-center gap-3">
          <Crosshair className="w-5 h-5 text-primary" />
          <span className="font-heading text-sm font-bold text-foreground">{hudData.weaponName}</span>
          <span className="font-body text-sm text-muted-foreground">
            {hudData.reloading ? (
              <span className="text-accent animate-pulse">RELOADING...</span>
            ) : (
              `${hudData.ammo} / ${hudData.maxAmmo}`
            )}
          </span>
        </div>
      </div>

      {/* Right: Kills & Enemies */}
      <div className="space-y-2">
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 flex items-center gap-3">
          <Skull className="w-5 h-5 text-accent" />
          <span className="font-heading text-sm font-bold text-foreground">{hudData.kills} Kills</span>
        </div>
        <div className="bg-background/80 backdrop-blur-sm border border-border rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="font-body text-sm text-foreground">{hudData.botsAlive} / {hudData.totalBots} enemies</span>
        </div>
      </div>
    </div>
  );
}
