import React from 'react';
import { Button } from '@/components/ui/button';
import { Trophy, Skull, DollarSign, Target } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GameOverScreen({ result, onContinue }) {
  const isVictory = result.victory;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <div className="text-center max-w-md w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mb-6"
        >
          {isVictory ? (
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-primary" />
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4">
              <Skull className="w-12 h-12 text-destructive" />
            </div>
          )}
        </motion.div>

        <h1 className="font-heading text-4xl font-black mb-2 text-foreground">
          {isVictory ? 'VICTORY' : 'DEFEATED'}
        </h1>
        <p className="font-body text-muted-foreground mb-8">
          {isVictory ? 'All enemies eliminated!' : 'You were taken down.'}
        </p>

        <div className="flex justify-center gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <Target className="w-6 h-6 text-accent mx-auto mb-1" />
            <p className="font-heading text-2xl font-bold text-foreground">{result.kills}</p>
            <p className="font-body text-xs text-muted-foreground">KILLS</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <DollarSign className="w-6 h-6 text-primary mx-auto mb-1" />
            <p className="font-heading text-2xl font-bold text-accent">+${result.money}</p>
            <p className="font-body text-xs text-muted-foreground">EARNED</p>
          </motion.div>
        </div>

        <Button
          size="lg"
          onClick={onContinue}
          className="font-heading text-lg px-10"
        >
          CONTINUE
        </Button>
      </div>
    </motion.div>
  );
}
