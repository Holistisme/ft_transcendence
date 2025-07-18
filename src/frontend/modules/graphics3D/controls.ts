/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   controls.ts                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:11:17 by alexy             #+#    #+#             */
/*   Updated: 2025/07/17 18:49:21 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { hitBallToPlayer1, hitBallToPlayer2 } from "./ball.js";

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

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnKeyDownTrigger,
    (evt: any) => {
      if (evt.sourceEvent.key === 'a' || evt.sourceEvent.key === 'A') {
        hitBallToPlayer2();
      };
    },
  ));
  console.log("Controls initialized for hitting ball to player 2");

  scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(
    BABYLON.ActionManager.OnKeyDownTrigger,
    (evt: any) => {
      if (evt.sourceEvent.key === 'l' || evt.sourceEvent.key === 'L') {
        hitBallToPlayer1();
      };
    },
  ));
  console.log("Controls initialized for hitting ball to player 1");
  console.log("Controls setup complete");
};