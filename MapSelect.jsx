import React from 'react';
import { MAPS } from '@/lib/gameData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock, Users, DollarSign, ChevronRight, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MapSelect({ gameState, onSelectMap, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-foreground">Select Map</h2>
        <Button variant="outline" onClick={onBack} className="font-body">Back</Button>
      </div>

      <div className="grid gap-4">
        {MAPS.map((map, i) => {
          const unlocked = gameState.level >= map.requiredLevel;
          const completed = gameState.levelsCompleted.includes(map.id);

          return (
            <motion.div
              key={map.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative border rounded-xl overflow-hidden transition-all ${
                unlocked
                  ? 'border-border bg-card hover:border-primary/50 cursor-pointer'
                  : 'border-border/50 bg-card/30 opacity-60'
              }`}
              onClick={() => unlocked && onSelectMap(map)}
            >
              <div className="flex items-center gap-5 p-5">
                {/* Map preview */}
                <div
                  className="w-20 h-20 rounded-lg flex-shrink-0 relative overflow-hidden"
                  style={{ backgroundColor: map.floorColor }}
                >
                  {map.walls.slice(0, 6).map((w, wi) => (
                    <div
                      key={wi}
                      className="absolute"
                      style={{
                        left: `${(w.x / map.width) * 100}%`,
                        top: `${(w.y / map.height) * 100}%`,
                        width: `${Math.max((w.w / map.width) * 100, 3)}%`,
                        height: `${Math.max((w.h / map.height) * 100, 3)}%`,
                        backgroundColor: map.wallColor,
                      }}
                    />
                  ))}
                  {!unlocked && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                      <Lock className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                  {completed && (
                    <div className="absolute top-1 right-1">
                      <Trophy className="w-4 h-4 text-accent" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-heading text-lg font-bold text-foreground">{map.name}</h3>
                    {completed && <Badge className="bg-accent/20 text-accent border-accent/30 font-heading text-xs">CLEARED</Badge>}
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-2">{map.description}</p>
                  <div className="flex gap-4 text-xs font-body">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-destructive" />
                      <span className="text-muted-foreground">{map.botCount} enemies</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-accent" />
                      <span className="text-muted-foreground">${map.reward} reward</span>
                    </div>
                    {!unlocked && (
                      <span className="text-muted-foreground">Requires Level {map.requiredLevel}</span>
                    )}
                  </div>
                </div>

                {unlocked && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
