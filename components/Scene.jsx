import { Human } from '@/models/Human';
import { CameraControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { BackSide } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

function Scene() {

    const cameraRef = useRef();
    const boxRef = useRef();

    useEffect(() => {
        cameraRef.current.lookAt(0, 0, 0);
      } , []); // bu kısım sayfa yüklendiğinde çalışır ve kamerayı 0,0,0 noktasına bakacak şekilde ayarlar.

    useFrame(() => {
        if (boxRef.current) {
          boxRef.current.rotation.y += 0.01;
        }
      });

    return (
        <>
            <Environment preset='forest' background/>
            <Human />
            <CameraControls
                maxPolarAngle={degToRad(90)}
                maxAzimuthAngle={degToRad(90)}
                minAzimuthAngle={degToRad(-90)}
             />
            <PerspectiveCamera makeDefault position={[0, 2, 3]} ref={cameraRef} />
            <mesh ref={boxRef} position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[1, 1]} />
                <meshStandardMaterial color='blue' />
            </mesh>
            <mesh rotation={[degToRad(90), 0, 0]} receiveShadow>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color='green' side={BackSide} />
            </mesh>
            <ambientLight intensity={1} />
            <spotLight position={[-1, 2, 0]} intensity={30} castShadow />
        </>
    )
}

export default Scene

// CameraShake helperi ile kamera sallanabilir.   
// Environment componenti ile çevre oluşturulabilir.  
// PerspectiveCamera componenti ile kamera oluşturulabilir. 
// CameraControls componenti ile kamera kontrolü sağlanabilir ve kamera hareketleri yapılabilir.    