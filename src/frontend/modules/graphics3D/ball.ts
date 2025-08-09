/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ball.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/15 17:06:59 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 14:47:18 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { game } from "./state.js";

import { playHitSound, playBounceSound, playGoalSound } from   "./audio.js";
import { createSparkleEffect }                          from "./sparkle.js";

let shadowGenerator: any;

/**
 * Initialize the ball
 */
export function initBall(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!game.scene) {
      console.error("Scene not initialized");
      reject("Scene not initialized");
      return;
    };

    if (!game.table.mesh) {
      console.error("Table not found in the scene");
      reject("Table not found in the scene");
      return;
    };

    console.log("Initializing ball...");
    BABYLON.SceneLoader.ImportMesh("", "/assets/models/", "ball.glb", game.scene,
      (meshes: any) => {
        if (meshes.length > 0) {
          game.ball.mesh = meshes[0];

          const center     = game.table.center;
          const ballCenter = meshes[1].getBoundingInfo().boundingBox.centerWorld;

          game.ball.heightMax = game.table.center.y + game.table.height * 1.33;
          game.ball.heightMin = game.table.center.y + game.table.height * 0.84;
          game.ball.bounce    = game.table.depth / 2.75;

          game.ball.mesh.position.subtractInPlace(ballCenter);
          game.ball.mesh.bakeCurrentTransformIntoVertices();
          game.ball.mesh.position = new BABYLON.Vector3(center.x, game.ball.heightMax, center.z);

          game.ball.spin       = 0.1;
          game.ball.speed      =   2;
          meshes.forEach((mesh: any) => {
            if (mesh.material) {
              const material     = mesh.material;
              const ballMaterial = new BABYLON.StandardMaterial("ballMaterial", game.scene);
              ballMaterial.diffuseColor  = new BABYLON.Color3(  1,   1,   1);
              ballMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
              ballMaterial.specularPower = 128;
              mesh.material = ballMaterial;
            };
          });

          game.ball.sideLimit   = game.players[0].pad.limit;
          game.ball.lengthLimit = game.players[0].pad.position;

          game.ball.radius       = meshes[1].getBoundingInfo().boundingSphere.radius;
          const scale            = game.table.width * 0.0003 / (game.ball.radius * 2);
          game.ball.mesh.scaling = new BABYLON.Vector3(scale, scale, scale);

          game.ball.radius   *= scale;
          game.ball.position  = game.ball.mesh.position;

          initBallShadow();
          serveBall();
        };
      },
    );
    console.log("Ball initialized successfully");
    resolve();
  });
};

/**
 * Initialize the shadow for the ball
 */
function initBallShadow(): void {
  if (!game.ball.mesh) {
    console.error("Ball not initialized");
    return;
  };

  console.log("Initializing ball shadow...");
  if (!game.camera.shadowLight) {
    console.error("Shadow light not found");
    return;
  };

  console.log("Creating shadow generator...");
  shadowGenerator = new BABYLON.ShadowGenerator(1024, game.camera.shadowLight);
  shadowGenerator.addShadowCaster(game.ball.mesh);
  shadowGenerator.useExponentialShadowMap = true;
  console.log("Ball shadow initialized");
};

/**
 * Update the ball's position based on its velocity
 */
export function updateBallPosition(): void {
  if (!game.ball.mesh || !game.ball.isMoving || !game.scene) {
    console.warn("Ball not initialized or game not active");
    return;
  };

  game.ball.mesh.position.z += game.ball.velocity.z;
  game.ball.mesh.position.x += game.ball.velocity.x;

  if (game.ball.mesh.position.x > game.ball.sideLimit || game.ball.mesh.position.x < -game.ball.sideLimit) {
    game.ball.velocity.x *= -1;
    playBounceSound();
    createSparkleEffect();
  };

  checkPadCollisions();

  let distance, traveled, height;

  if (game.ball.velocity.z > 0) {
    if (game.ball.mesh.position.z <= game.ball.bounce) {
      distance = game.ball.lengthLimit     + game.ball.bounce;
      traveled = game.ball.mesh.position.z + game.ball.lengthLimit;
      height   = 1 - (traveled / distance);
      if (Math.abs(game.ball.mesh.position.z - game.ball.bounce + 30) < 1) {
        playBounceSound();
      };
    } else {
      distance = game.ball.lengthLimit     - game.ball.bounce;
      traveled = game.ball.mesh.position.z - game.ball.bounce;
      height   = traveled / distance;
    };
  } else {
    if (game.ball.mesh.position.z >= -game.ball.bounce) {
      distance = game.ball.lengthLimit + game.ball.bounce;
      traveled = game.ball.lengthLimit - game.ball.mesh.position.z;
      height   = 1 - (traveled / distance);
      if (Math.abs(game.ball.mesh.position.z - -game.ball.bounce - 30) < 1) {
          playBounceSound();
      };
    } else {
      distance = game.ball.lengthLimit              + -game.ball.bounce;
      traveled = Math.abs(game.ball.mesh.position.z - -game.ball.bounce);
      height   = traveled / distance;
    };
  };

  game.ball.mesh.position.y = game.ball.heightMin + Math.max(0, Math.min(1, height)) * (game.ball.heightMax - game.ball.heightMin);

  if (game.ball.mesh.position.z > game.ball.lengthLimit || game.ball.mesh.position.z < -game.ball.lengthLimit) {
    stopBall();
  };
};

/**
 * Check for collisions between the ball and the pads
 */
function checkPadCollisions(): void {
  if (!game.scene) {
    console.error("Scene not found");
    return;
  };

  if (!game.players[0].pad || !game.players[1].pad) {
    console.error("Pads not found");
    return;
  };

  //TODO: Unreverse the player order
  if (game.ball.velocity.z < 0 && game.ball.mesh.position.z <= -game.ball.lengthLimit * 0.8) {
    if (isCollidingWithPad(game.players[1].pad.mesh.position)) {
      game.ball.velocity.z = Math.abs(game.ball.velocity.z);

      const offsetX        = game.ball.mesh.position.x - game.players[1].pad.mesh.position.x;
      game.ball.velocity.x = offsetX * game.ball.spin;

      playHitSound       ();
      createSparkleEffect();
      game.ball.lastHitter = 1;
      game.camera.object.alpha = 0;
      game.camera.object.lowerAlphaLimit = game.camera.object.upperAlphaLimit = 0;
      console.log("Ball hit by player 1");
    };
  } else if (game.ball.velocity.z > 0 && game.ball.mesh.position.z >= game.ball.lengthLimit * 0.8) {
    if (isCollidingWithPad(game.players[0].pad.mesh.position)) {
      game.ball.velocity.z = -Math.abs(game.ball.velocity.z);

      const offsetX        = game.ball.mesh.position.x - game.players[0].pad.mesh.position.x;
      game.ball.velocity.x = offsetX * game.ball.spin;

      playHitSound       ();
      createSparkleEffect();
      game.ball.lastHitter = 2;
      game.camera.object.alpha = Math.PI;
      game.camera.object.lowerAlphaLimit = game.camera.object.upperAlphaLimit = Math.PI;
      console.log("Ball hit by player 2");
    };
  };
};

/**
 * Check if the ball is colliding with a pad
 * @param padPos The position of the pad
 * @returns Whether the ball is colliding with the pad
 */
function isCollidingWithPad(padPos: any): boolean {
  const deltaX = Math.abs(game.ball.mesh.position.x - padPos.x);
  const deltaZ = Math.abs(game.ball.mesh.position.z - padPos.z);

  return deltaX <= (game.players[0].pad.width / 2 + game.ball.radius) &&
    deltaZ <= (game.players[0].pad.height / 2 + game.ball.radius);
};

/**
 * Stop the ball and reset its position
 */
export function stopBall(): void {
  if (!game.ball.mesh) {
    console.warn("Ball not initialized");
    return;
  };

  game.ball.velocity        = { x: 0, z: 0, y: 0 };
  game.ball.isMoving        = false;
  game.ball.mesh.position.y = game.ball.heightMax;
  console.log("Ball stopped");

  playGoalSound();
  game.ball.mesh.position.x = 0;
  game.ball.mesh.position.z = 0;

  serveBall();
};

/**
 * Serve the ball at the start of the game or after a point
 */
export function serveBall(): void {
  if (!game.ball.mesh) {
    console.warn("Ball not initialized");
    return;
  };

  console.log("Serving ball...");
  game.ball.mesh.position.x = 0;
  game.ball.mesh.position.z = 0;
  game.ball.mesh.position.y = game.ball.heightMax;
  game.ball.velocity        = { x: 0, z: 0, y: 0 };

  game.ball.isMoving   = false;
  game.ball.lastHitter = 0;

  Math.random() < 0.5 ? hitBallToPlayer1() : hitBallToPlayer2();
  console.log("Ball served");
};

/**
 * Hit the ball towards player 2
 */
export function hitBallToPlayer2(): void {
  if (!game.ball.mesh || game.ball.isMoving || game.ball.lastHitter === 1) {
    console.warn("Ball already in play or last player was player 1");
    return;
  };

  game.camera.object.alpha           = 0;
  game.camera.object.lowerAlphaLimit = game.camera.object.upperAlphaLimit = 0;

  playHitSound();
  game.ball.velocity.z = game.ball.speed;
  game.ball.velocity.x = 0;
  game.ball.isMoving   = true;
  game.ball.lastHitter = 1;
  console.log("Ball hit towards player 2");
};

/**
 * Hit the ball towards player 1
 */
export function hitBallToPlayer1(): void {
  if (!game.ball.mesh || game.ball.isMoving || game.ball.lastHitter === 2) {
    console.warn("Ball already in play or last player was player 2");
    return;
  };

  game.camera.object.alpha           = Math.PI;
  game.camera.object.lowerAlphaLimit = game.camera.object.upperAlphaLimit = Math.PI;


  playHitSound();
  game.ball.velocity.z = -game.ball.speed;
  game.ball.velocity.x =  0;
  game.ball.isMoving   = true;
  game.ball.lastHitter = 2;
  console.log("Ball hit towards player 1");
};