/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   controls.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:11:17 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 14:56:34 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { game }    from "./state.js";
import { movePad } from   "./pad.js";

const keysPressed: {[key: string]: boolean} = {};

/**
 * Initialize controls for the game
 */
export function initControls(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!game.scene) {
      console.error("Scene not initialized");
      reject("Scene not initialized");
      return;
    } else console.log("Initializing controls...");

    game.scene.actionManager = new BABYLON.ActionManager(game.scene);

    window.addEventListener('keydown', (event) => {
      keysPressed[event.key.toLowerCase()] = true;
    });

    window.addEventListener('keyup', (event) => {
      keysPressed[event.key.toLowerCase()] = false;
    });

    game.scene.registerBeforeRender(() => { updatePadMovement(); });
    console.log("Controls setup complete");
    resolve();
  });
};

/**
 * Update pad movement based on key presses.
 */
function updatePadMovement(): void {
  if (keysPressed['a'])  movePad(1,   'up');
  if (keysPressed['q'])  movePad(1, 'down');
  if (keysPressed['p'])  movePad(2,   'up');
  if (keysPressed['m'])  movePad(2, 'down');
};