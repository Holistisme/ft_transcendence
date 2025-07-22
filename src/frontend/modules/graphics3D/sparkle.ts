/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   sparkle.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/18 13:27:19 by alexy             #+#    #+#             */
/*   Updated: 2025/07/22 10:11:45 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

/**
 * Creates a sparkle effect at the specified position in the scene.
 * @param scene The Babylon.js scene to add the effect to.
 * @param position The position where the sparkle effect should be created.
 */
export function createSparkleEffect(scene: any, position: any): void {
  if (!scene) {
    console.error("Scene not initialized");
    return;
  };

  const particleSystem = new BABYLON.ParticleSystem("sparkle", 50, scene);

  particleSystem.particleTexture = new BABYLON.Texture("/assets/textures/flare.png", scene);
  particleSystem.emitter         = new BABYLON.Vector3(position.x, position.y, position.z);
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

  console.log("Sparkle effect created at position:", position);
};