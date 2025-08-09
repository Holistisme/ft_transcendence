/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   rendering.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:08:59 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 14:29:53 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { initAudio }                    from      "./audio.js";
import { initCamera, initLight }        from     "./camera.js";
import { initControls }                 from   "./controls.js";
import { initBall, updateBallPosition } from       "./ball.js";
import { initPads }                     from        "./pad.js";
import { aiPlay }                       from         "./ai.js";
import { initTable }                    from      "./table.js";
import { game }                         from      "./state.js";

/**
 * Initialize the graphics engine.
 * @param canvasId The ID of the canvas element.
 */
export async function initGraphics(canvasId: string): Promise<void> {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;

  if (typeof BABYLON === 'undefined' || !canvas) {
    if (typeof BABYLON === 'undefined')  console.error("BABYLON.js is not loaded");
    if (!canvas)                         console.error("Canvas element not found");
    return;
  };

  console.log("Initializing graphics engine...");
  game.engine = new BABYLON.Engine(canvas, true);
  game.scene  = new BABYLON.Scene (game.engine);

  try {
    await initTable   ();
    await initCamera  ();
    await initLight   ();
    await initBall    ();
    await initPads    ();
    await initControls();
    await initAudio   ();
  } catch (error) {
    console.error("Error initializing graphics engine:", error);
  };

  console.log("Graphics engine initialized successfully");
};

/**
 * Start the rendering process.
 */
export function startRendering(): void {
  if (!game.engine || !game.scene) {
    if (!game.engine)  console.error("Engine not initialized");
    if (!game.scene)   console.error("Scene not initialized");
    return;
  };

  console.log("Starting rendering loop...");
  try {
    const dome = new BABYLON.PhotoDome("environment", "/assets/textures/background.jpg", {
      resolution: 32,
      size: game.camera.radius * 1.75,
    }, game.scene);
    dome.rotation.y = Math.PI / 1.33;
    console.log("Dome created for background");
  } catch (error) {
    console.error("Error creating dome for background:", error);
  };

  game.engine.runRenderLoop(() => {
    updateBallPosition();
    game.scene.render();

    if (game.ball.mesh) {
      aiPlay(game.ball.mesh);
    };
  });
  window.addEventListener("resize", () => { game.engine.resize(); });
  console.log("Rendering loop started");
};