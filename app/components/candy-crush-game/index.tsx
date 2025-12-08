'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Sphere, Cone, Torus, Dodecahedron, Cylinder, Center, Icosahedron, Octahedron, Tetrahedron } from '@react-three/drei';
import * as THREE from 'three';
import { Heart, RefreshCw } from 'lucide-react';
import styles from './game.module.css';

const WIDTH = 8;
const PASTEL_COLORS = [
  '#FFB7B2', // Pastel Red
  '#B5EAD7', // Pastel Green
  '#C7CEEA', // Pastel Blue
  '#E2F0CB', // Pastel Yellow/Green
  '#FFDAC1', // Pastel Orange
  '#FF9AA2', // Pastel Pink
];

const randomColor = () => PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];

let idCounter = 0;
const getUniqueId = () => {
  return idCounter++;
};

interface CandyItem {
  id: number;
  color: string;
}

function Candy({ color, targetPosition, isSelected, onClick }: { color: string, targetPosition: THREE.Vector3, isSelected: boolean, onClick: () => void }) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Smooth movement using lerp
      meshRef.current.position.lerp(targetPosition, 15 * delta);
      
      // Pulse effect if selected
      if (isSelected) {
        const scale = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
        meshRef.current.scale.set(scale, scale, scale);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 10 * delta);
      }

      // Subtle floating animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      meshRef.current.rotation.z = Math.cos(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  const materialProps = { 
    color: color, 
    roughness: 0.4, 
    metalness: 0.1,
    flatShading: true 
  };

  const renderShape = () => {
    switch (color) {
      case PASTEL_COLORS[0]: return <Sphere args={[0.35, 7, 7]}><meshStandardMaterial {...materialProps} /></Sphere>;
      case PASTEL_COLORS[1]: return <RoundedBox args={[0.6, 0.6, 0.6]} radius={0.1} smoothness={1}><meshStandardMaterial {...materialProps} /></RoundedBox>;
      case PASTEL_COLORS[2]: return <Cone args={[0.35, 0.7, 8]}><meshStandardMaterial {...materialProps} /></Cone>;
      case PASTEL_COLORS[3]: return <Octahedron args={[0.4]}><meshStandardMaterial {...materialProps} /></Octahedron>;
      case PASTEL_COLORS[4]: return <Dodecahedron args={[0.4]}><meshStandardMaterial {...materialProps} /></Dodecahedron>;
      case PASTEL_COLORS[5]: return <Icosahedron args={[0.4]}><meshStandardMaterial {...materialProps} /></Icosahedron>;
      default: return <Sphere args={[0.35]}><meshStandardMaterial {...materialProps} /></Sphere>;
    }
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: 3D object interaction
    <group position={targetPosition} onClick={(e) => { e.stopPropagation(); onClick(); }} ref={meshRef}>
      {renderShape()}
    </group>
  );
}

export default function CandyCrushGame() {
  const [grid, setGrid] = useState<CandyItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const createBoard = useCallback(() => {
    const newGrid: CandyItem[] = [];
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      newGrid.push({ id: getUniqueId(), color: randomColor() });
    }
    setGrid(newGrid);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setIsProcessing(false);
    setSelected(null);
  }, []);

  useEffect(() => {
    createBoard();
  }, [createBoard]);

  const checkForMatches = useCallback((currentGrid: CandyItem[]) => {
    const matches: number[] = [];

    // Check rows
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      if (i % WIDTH < WIDTH - 2) {
        const rowThree = [i, i + 1, i + 2];
        const decidedColor = currentGrid[i]?.color;
        if (!decidedColor) continue;

        if (rowThree.every(index => currentGrid[index]?.color === decidedColor)) {
          matches.push(...rowThree);
        }
      }
    }

    // Check columns
    for (let i = 0; i < WIDTH * (WIDTH - 2); i++) {
      const colThree = [i, i + WIDTH, i + WIDTH * 2];
      const decidedColor = currentGrid[i]?.color;
      if (!decidedColor) continue;

      if (colThree.every(index => currentGrid[index]?.color === decidedColor)) {
        matches.push(...colThree);
      }
    }

    return Array.from(new Set(matches));
  }, []);

  const moveCandiesDown = useCallback((currentGrid: CandyItem[]) => {
    const newGrid = [...currentGrid];
    let moved = false;

    // Move down
    for (let i = 0; i < WIDTH * (WIDTH - 1); i++) {
      // If cell below is empty (null in our logic, but we filter them out usually, here we use placeholders?)
      // Actually, let's assume we remove items and shift down.
      // But to keep grid structure, we usually mark as null then shift.
      // Let's stick to the previous logic: empty string was used. Now we can use null or a special flag.
      // Let's use null for empty spots.
    }
    
    // Re-implementing move logic for objects
    // We need to work column by column
    for (let col = 0; col < WIDTH; col++) {
      let emptySlots = 0;
      for (let row = WIDTH - 1; row >= 0; row--) {
        const index = row * WIDTH + col;
        if (newGrid[index].color === '') {
          emptySlots++;
        } else if (emptySlots > 0) {
          // Move current candy down
          newGrid[index + emptySlots * WIDTH] = newGrid[index];
          newGrid[index] = { id: -1, color: '' }; // Mark as empty
          moved = true;
        }
      }
      
      // Fill top with new candies
      for (let row = 0; row < emptySlots; row++) {
        const index = row * WIDTH + col;
        newGrid[index] = { id: getUniqueId(), color: randomColor() };
        moved = true;
      }
    }

    return { newGrid, moved };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    
    const timer = setInterval(() => {
      if (isProcessing) return; // Don't run loop if we are handling a user swap animation manually

      const matches = checkForMatches(grid);
      
      if (matches.length > 0) {
        const newGrid = [...grid];
        matches.forEach(index => {
          newGrid[index] = { ...newGrid[index], color: '' }; // Mark as empty
        });
        setGrid(newGrid);
        setScore(prev => prev + matches.length * 10);
        // We don't set isProcessing here, we let the next tick handle the move down
      } else {
        // Check if we need to move down
        const hasEmpty = grid.some(c => c.color === '');
        if (hasEmpty) {
            const { newGrid, moved } = moveCandiesDown(grid);
            if (moved) {
                setGrid(newGrid);
            }
        }
      }
    }, 200);

    return () => clearInterval(timer);
  }, [grid, checkForMatches, moveCandiesDown, isProcessing, gameOver]);

  const handleCandyClick = async (index: number) => {
    if (isProcessing || gameOver) return;

    if (selected === null) {
      setSelected(index);
    } else {
      if (selected === index) {
        setSelected(null);
        return;
      }

      const isAdjacent = 
        index === selected - 1 && Math.floor(index / WIDTH) === Math.floor(selected / WIDTH) || 
        index === selected + 1 && Math.floor(index / WIDTH) === Math.floor(selected / WIDTH) || 
        index === selected - WIDTH || 
        index === selected + WIDTH;

      if (isAdjacent) {
        setIsProcessing(true);
        
        // Perform swap
        const newGrid = [...grid];
        const temp = newGrid[index];
        newGrid[index] = newGrid[selected];
        newGrid[selected] = temp;
        
        setGrid(newGrid);
        setSelected(null);

        // Check matches
        const matches = checkForMatches(newGrid);
        
        if (matches.length === 0) {
          // Invalid swap
          setTimeout(() => {
            // Swap back
            setGrid(grid); // Revert to old grid
            setLives(prev => {
              const newLives = prev - 1;
              if (newLives <= 0) setGameOver(true);
              return newLives;
            });
            setIsProcessing(false);
          }, 500);
        } else {
          // Valid swap, let the loop handle clearing
          setTimeout(() => {
            setIsProcessing(false);
          }, 300);
        }
      } else {
        setSelected(index);
      }
    }
  };

  return (
    <div className={styles.gameContainer}>
      <div className={styles.header}>
        <div className={styles.livesContainer}>
          {[...Array(3)].map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static list of hearts
            <Heart 
              key={i} 
              className={`${styles.heartIcon} ${i >= lives ? styles.heartLost : ''}`} 
              fill={i < lives ? "#ff6b6b" : "#ddd"}
            />
          ))}
        </div>
        <div className={styles.scoreContainer}>
          <span className={styles.scoreLabel}>Score</span>
          <span className={styles.scoreValue}>{score}</span>
        </div>
      </div>

      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 12], fov: 45 }} shadows>
          <color attach="background" args={['#f0f0f0']} />
          <ambientLight intensity={0.7} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1} 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffd1dc" />
          
          <Center>
            <group>
              {grid.map((item, index) => {
                if (item.color === '') return null; // Don't render empty slots (they will be filled)
                const x = (index % WIDTH) * 1.0;
                const y = -(Math.floor(index / WIDTH)) * 1.0;
                return (
                  <Candy
                    key={item.id}
                    color={item.color}
                    targetPosition={new THREE.Vector3(x, y, 0)}
                    isSelected={selected === index}
                    onClick={() => handleCandyClick(index)}
                  />
                );
              })}
            </group>
          </Center>
          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI * 2 / 3} minAzimuthAngle={-Math.PI / 4} maxAzimuthAngle={Math.PI / 4} />
        </Canvas>
        
        {gameOver && (
          <div className={styles.gameOverModal}>
            <h2 className={styles.gameOverTitle}>Game Over</h2>
            <p className={styles.gameOverScore}>Final Score: {score}</p>
            <button type="button" className={styles.button} onClick={createBoard}>
              <RefreshCw size={20} />
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button type="button" className={styles.button} onClick={createBoard}>
          <RefreshCw size={16} />
          Reset
        </button>
      </div>
    </div>
  );
}

