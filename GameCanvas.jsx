import React, { useRef, useEffect, useCallback } from 'react';
import { createGameState, updateGame } from '@/lib/gameEngine';
import { renderGame } from '@/lib/gameRenderer';

export default function GameCanvas({ map, weaponId, onGameEnd, gameStateRef }) {
  const canvasRef = useRef(null);
  const inputRef = useRef({
    keys: {},
    mouseX: 0,
    mouseY: 0,
    mouseDown: false,
  });
  const animFrameRef = useRef(null);

  const getCanvasMousePos = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;
    
    // Add camera offset
    const state = gameStateRef.current;
    if (state) {
      const camX = Math.max(0, Math.min(state.player.x - canvas.width / 2, state.map.width - canvas.width));
      const camY = Math.max(0, Math.min(state.player.y - canvas.height / 2, state.map.height - canvas.height));
      return { x: canvasX + camX, y: canvasY + camY };
    }
    return { x: canvasX, y: canvasY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = Math.min(1200, window.innerWidth);
    canvas.height = Math.min(800, window.innerHeight - 100);
    
    gameStateRef.current = createGameState(map, weaponId);
    
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      inputRef.current.keys[key] = true;
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(key)) {
        e.preventDefault();
      }
    };
    
    const handleKeyUp = (e) => {
      inputRef.current.keys[e.key.toLowerCase()] = false;
    };
    
    const handleMouseMove = (e) => {
      const pos = getCanvasMousePos(e);
      inputRef.current.mouseX = pos.x;
      inputRef.current.mouseY = pos.y;
    };
    
    const handleMouseDown = (e) => {
      if (e.button === 0) {
        inputRef.current.mouseDown = true;
        const pos = getCanvasMousePos(e);
        inputRef.current.mouseX = pos.x;
        inputRef.current.mouseY = pos.y;
      }
    };
    
    const handleMouseUp = (e) => {
      if (e.button === 0) inputRef.current.mouseDown = false;
    };
    
    const handleResize = () => {
      canvas.width = Math.min(1200, window.innerWidth);
      canvas.height = Math.min(800, window.innerHeight - 100);
    };

    // Prevent right-click context menu on canvas
    const handleContextMenu = (e) => e.preventDefault();
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('contextmenu', handleContextMenu);
    
    let gameEnded = false;
    
    const loop = () => {
      const state = gameStateRef.current;
      if (!state) return;
      
      updateGame(state, inputRef.current, 16);
      renderGame(ctx, state, canvas.width, canvas.height);
      
      if (state.gameOver && !gameEnded) {
        gameEnded = true;
        setTimeout(() => {
          onGameEnd({
            victory: state.victory,
            kills: state.kills,
            money: state.moneyEarned,
          });
        }, 1500);
      }
      
      animFrameRef.current = requestAnimationFrame(loop);
    };
    
    animFrameRef.current = requestAnimationFrame(loop);
    
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [map, weaponId, onGameEnd, getCanvasMousePos]);

  return (
    <div className="relative w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="border border-border rounded-lg cursor-crosshair block"
        style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 100px)' }}
      />
    </div>
  );
}
