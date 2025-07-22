/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rendering.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:08:59 by alexy             #+#    #+#             */
/*   Updated: 2025/07/21 18:33:07 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { initAudio }                    from    "./audio.js";
import { initCamera, initLight }        from   "./camera.js";
import { initControls }                 from "./controls.js";
import { initBall, updateBallPosition } from     "./ball.js";
import { initPads }                     from      "./pad.js";
import { aiPlay }                       from       "./ai.js";

let engine: any;
let scene:  any;

/**
 * Initialize the graphics engine.
 * @param canvasId The ID of the canvas element.
 */
export function initGraphics(canvasId: string): void {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

  if (typeof BABYLON === 'undefined' || !canvas) {
    console.error("BABYLON.js is not loaded or canvas element not found");
    return;
  };

  console.log("Initializing graphics engine...");
  engine = new BABYLON.Engine(canvas, true);
  scene  = new BABYLON.Scene (engine);

  initAudio   ();
  initCamera  (scene, engine);
  initLight   (scene);
  initControls(scene);
  initPads    (scene);
  console.log ("Graphics engine initialized successfully");
};

/**
 * Start the rendering process.
 */
export function startRendering(): void {
  if (!engine || !scene) {
    console.error("Engine or scene not initialized");
    return;
  };

  console.log("Starting rendering loop...");
  try {
    const dome = new BABYLON.PhotoDome("environment", "/assets/textures/background.jpg", {
      resolution: 32,
      size: 1000,
    }, scene);
    dome.rotation.y = Math.PI / 1.33;
    console.log("Dome created for background");
  } catch (error) {
    console.error("Error creating dome for background:", error);
  };

  BABYLON.SceneLoader.ImportMesh("", "/assets/models/table/", "model.glb", scene,
    (meshes: any) => {
      if (!meshes || meshes.length === 0) {
        console.error("Ping pong table model not found or failed to load");
        return;
      };

      console.log("Ping pong table loaded successfully");
      try {
        const table = meshes[0];

        table.position   = new BABYLON.Vector3(0, -400, 0);
        table.rotation   = new BABYLON.Vector3(0,    0, 0);
        table.scaling    = new BABYLON.Vector3(3,    3, 3);
        table.rotation.x = -(Math.PI / 2);

        meshes.forEach((mesh: any) => {
          if (mesh.material) {
            const material                 = new BABYLON.StandardMaterial("tableMaterial",                  scene);
            material.diffuseTexture        = new BABYLON.Texture         ("/assets/models/table/texture.jpg", scene);
            material.diffuseTexture.vScale = -1;
            mesh.material                  = material;
            mesh.receiveShadows            = true;
            console.log("Table material applied successfully");
          };
        });
        table.receiveShadows = true;
        console.log("Ping pong table model processed successfully");

        initBall(scene);
      } catch (error) {
        console.error("Error processing ping pong table model:", error);
      };
    },
  );

  engine.runRenderLoop(() => {
    updateBallPosition();
    scene.render();

    const ball = scene.getMeshByName("ball");
    if (ball) {
      aiPlay(ball);
    } else {
      console.warn("Ball mesh not found in the scene");
    };
  });
  window.addEventListener("resize", () => { engine.resize(); });
  console.log("Rendering loop started");
};