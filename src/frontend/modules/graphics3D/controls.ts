/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   controls.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:11:17 by alexy             #+#    #+#             */
/*   Updated: 2025/07/21 18:24:25 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { movePad } from  "./pad.js";

const keysPressed: {[key: string]: boolean} = {};

/**
 * Initialize controls for the game
 * @param scene The Babylon.js scene
 */
export function initControls(scene: any): void {
  if (!scene) {
    console.error("Scene not initialized");
    return;
  };

  console.log("Initializing controls...");
  scene.actionManager = new BABYLON.ActionManager(scene);

  window.addEventListener('keydown', (event) => {
    keysPressed[event.key.toLowerCase()] = true;
  });

  window.addEventListener('keyup', (event) => {
    keysPressed[event.key.toLowerCase()] = false;
  });

  scene.registerBeforeRender(() => { updatePadMovement(); });
  console.log("Controls setup complete");
};

/**
 * Update pad movement based on key presses.
 */
function updatePadMovement(): void {
  if (keysPressed['q'])  movePad(1,   'up');
  if (keysPressed['a'])  movePad(1, 'down');
  if (keysPressed['m'])  movePad(2,   'up');
  if (keysPressed['p'])  movePad(2, 'down');
};