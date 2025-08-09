/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sparkle.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/18 13:27:19 by alexy             #+#    #+#             */
/*   Updated: 2025/08/07 21:02:33 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { game } from "./state.js";

/**
 * Create a sparkle effect at the ball's position
 */
export function createSparkleEffect(): void {
  if (!game.scene) {
    console.error("Scene not initialized");
    return;
  };

  const particleSystem = new BABYLON.ParticleSystem("sparkle", 50, game.scene);

  particleSystem.particleTexture = new BABYLON.Texture("/assets/textures/flare.png", game.scene);
  particleSystem.emitter         = new BABYLON.Vector3(game.ball.position.x, game.ball.position.y, game.ball.position.z);
  particleSystem.minEmitBox      = new BABYLON.Vector3(-10, -10, -10);
  particleSystem.maxEmitBox      = new BABYLON.Vector3( 10,  10,  10);
  particleSystem.color1          = new BABYLON.Color4 (  1,   1,   1, 1);
  particleSystem.color2          = new BABYLON.Color4 (  1, 0.8,   0, 1);
  particleSystem.colorDead       = new BABYLON.Color4 (  0,   0,   0, 0);
  particleSystem.gravity         = new BABYLON.Vector3(  0, -20,   0);

  particleSystem.minSize      = 1;
  particleSystem.maxSize      = 50;
  particleSystem.minLifeTime  = 0.1;
  particleSystem.maxLifeTime  = 1;
  particleSystem.emitRate     = 200;
  particleSystem.minEmitPower = 5;
  particleSystem.maxEmitPower = 10;

  particleSystem.start();
  setTimeout(() => {
    particleSystem.stop();
    setTimeout(() => {
      particleSystem.dispose();
    }, 500);
  }, 200);

  console.log("Sparkle effect created at position:", game.ball.position);
};