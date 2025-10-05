import { useRef, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import FirstPersonControls from './Controls/FirstPersonControls';
import Terrain from './Environment/Terrain';
import Fountain from './Structures/Fountain';
import Weather from './Environment/Weather';
import Greenhouse from './Structures/Greenhouse';
import WeatherStation from './Structures/WeatherStation';
import PlantingZones from './PlantingZones';
import { usePortfolioStore } from '../../store/portfolioStore';

export default function Scene({ onPlantClick }) {
  const { camera } = useThree();
  const { marketCondition, updateMarketConditions } = usePortfolioStore();

  useEffect(() => {
    console.log('Scene mounted! Camera position:', camera.position);
    // Update market conditions every 30 seconds
    const interval = setInterval(() => {
      updateMarketConditions();
    }, 30000);

    return () => clearInterval(interval);
  }, [updateMarketConditions, camera]);

  return (
    <>
      {/* Test objects to verify scene is rendering */}
      <mesh position={[0, 1, 8]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>

      <mesh position={[3, 0.5, 8]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="yellow" />
      </mesh>

      <mesh position={[-3, 0.5, 8]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 1, 32]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} receiveShadow>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial color="#3a7a2e" />
      </mesh>

      {/* Controls */}
      <FirstPersonControls />

      {/* Environment - commented out for testing */}
      {/* <Terrain /> */}
      
      {/* Weather - commented out for testing */}
      {/* <Weather condition={marketCondition} /> */}

      {/* Central Plaza - commented out for testing */}
      {/* <Fountain position={[0, 0, 0]} /> */}

      {/* Garden Zones - commented out for testing */}
      {/* <PlantingZones onPlantClick={onPlantClick} /> */}

      {/* Structures - commented out for testing */}
      {/* <Greenhouse position={[-8, 0, 16]} /> */}
      {/* <WeatherStation position={[15, 0, 5]} /> */}
    </>
  );
}

function ZoneLabel({ position, text }) {
  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[3, 0.5]} />
        <meshBasicMaterial color="#8B4513" opacity={0.7} transparent />
      </mesh>
      {/* In a full implementation, we'd use troika-three-text or similar for 3D text */}
      {/* For now, this serves as a placeholder */}
    </group>
  );
}

