// Import React and useEffect hook
import React, { useEffect } from "react";
// Import ThreeJS and react-three-fiber components
import * as THREE from "three";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
// import { extend } from "@react-three/fiber";
// Import OrbitControls component
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// Extend OrbitControls to make it available as a JSX element
extend({ OrbitControls });

// Create a custom component for the globe
function Globe() {
  // Get the scene and camera from useThree hook
  const { scene, camera } = useThree();
  // Create a ref for the globe mesh
  const globeRef = React.useRef();

  // Use useEffect hook to load the globe texture and add it to the scene
  useEffect(() => {
    // Create a texture loader
    const loader = new THREE.TextureLoader();
    // Load the globe image from the public folder
    loader.load("/3.jpg", (texture) => {
      // Create a sphere geometry for the globe
      const geometry = new THREE.SphereGeometry(3, 50, 50);
      // Create a material for the globe using the texture
      const material = new THREE.MeshBasicMaterial({ map: texture });
      // Create a mesh for the globe using the geometry and material
      const globe = new THREE.Mesh(geometry, material);
      // Assign the globe mesh to the ref
      globeRef.current = globe;
      // Add the globe mesh to the scene
      scene.add(globe);
    });
  }, [scene]);

  // Use useFrame hook to animate the globe rotation
  useFrame(() => {
    // Check if the globe mesh exists
    if (globeRef.current) {
      // Rotate the globe mesh on its y-axis
      globeRef.current.rotation.y += 0.01;
    }
  });

  return null;
}

// Create a custom component for the orbit controls
function Controls() {
  // Get the camera and gl from useThree hook
  const { camera, gl } = useThree();
  // Create a ref for the orbit controls
  const controlsRef = React.useRef();
  // Use useFrame hook to update the orbit controls
  useFrame(() => {
    // Check if the orbit controls exist
    if (controlsRef.current) {
      // Update the orbit controls
      controlsRef.current.update();
    }
  });
  return (
    // Render the orbit controls element using JSX syntax
    <orbitControls
      // Assign the orbit controls to the ref
      ref={controlsRef}
      // Pass the camera and gl as props
      args={[camera, gl.domElement]}
      // Enable auto rotation of camera around target object (globe)
      autoRotate={true}
      // Set auto rotation speed (in radians per second)
      autoRotateSpeed={0.2}
    />
  );
}

// Export a default function component that will render the canvas element with Globe and Controls components as children
export default function GlobeAnimation() {
  return (
    <Canvas camera={{ position: [0, 0, 10], zoom: 2 }}>
      <Globe/>
      <Controls />
    </Canvas>
  );
}
