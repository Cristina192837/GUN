import React from 'react';
import { WEAPONS } from '@/lib/gameData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Check, ShoppingCart, Zap, Target, Timer, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeaponShop({ gameState, onBuy, onSelect, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">Weapon Shop</h2>
        <Button variant="outline" onClick={onClose} className="font-body">Back</Button>
      </div>

      <div className="grid gap-4">
        {WEAPONS.map((weapon, i) => {
          const owned = gameState.ownedWeapons.includes(weapon.id);
          const selected = gameState.selectedWeapon === weapon.id;
          const canAfford = gameState.money >= weapon.price;

          return (
            <motion.div
              key={weapon.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`relative border rounded-xl p-5 transition-all ${
                selected
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : owned
                  ? 'border-border bg-card hover:border-primary/50'
                  : 'border-border bg-card/50'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: weapon.color, boxShadow: `0 0 12px ${weapon.color}` }}
                    />
                    <h3 className="font-heading text-lg font-bold text-foreground">{weapon.name}</h3>
                    {selected && <Badge className="bg-primary text-primary-foreground font-heading text-xs">EQUIPPED</Badge>}
                    {owned && !selected && <Badge variant="outline" className="font-body text-xs">OWNED</Badge>}
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-3">{weapon.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs font-body">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-muted-foreground">DMG</span>
                      <span className="font-bold text-foreground">{weapon.damage}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Timer className="w-3.5 h-3.5 text-accent" />
                      <span className="text-muted-foreground">RATE</span>
                      <span className="font-bold text-foreground">{weapon.fireRate}ms</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-primary" />
                      <span className="text-muted-foreground">SPREAD</span>
                      <span className="font-bold text-foreground">{(weapon.spread * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-400" />
                      <span className="text-muted-foreground">AMMO</span>
                      <span className="font-bold text-foreground">{weapon.ammo}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {weapon.price > 0 && (
                    <span className="font-heading text-lg font-bold text-accent">${weapon.price}</span>
                  )}
                  {weapon.price === 0 && (
                    <span className="font-heading text-sm text-muted-foreground">FREE</span>
                  )}
                  
                  {!owned && (
                    <Button
                      size="sm"
                      disabled={!canAfford}
                      onClick={() => onBuy(weapon.id)}
                      className="font-heading text-xs"
                    >
                      {canAfford ? (
                        <><ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> BUY</>
                      ) : (
                        <><Lock className="w-3.5 h-3.5 mr-1.5" /> LOCKED</>
                      )}
                    </Button>
                  )}
                  {owned && !selected && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onSelect(weapon.id)}
                      className="font-heading text-xs"
                    >
                      <Check className="w-3.5 h-3.5 mr-1.5" /> EQUIP
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
