/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ball.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/15 17:06:59 by alexy             #+#    #+#             */
/*   Updated: 2025/07/18 10:12:37 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { playHitSound, playBounceSound } from "./audio.js";

let ball:               any;
let ballStartHeight =   -25;
let ballLowHeight   =  -175;
let isGameActive    = false;
let lastPlayer      =     0;

let ballVelocity = { x: 0, z: 0, y: 0 };

/**
 * Initialize the ball in the scene
 * @param scene The Babylon.js scene
 */
export function initBall(scene: any): void {
  if (!scene) {
    console.error("Scene not initialized");
    return;
  };

  console.log("Initializing ball...");
  BABYLON.SceneLoader.ImportMesh("", "/assets/models/", "ball.glb", scene,
    (meshes: any) => {
      if (meshes.length > 0) {
        ball = meshes[0];

        ball.position = new BABYLON.Vector3(  0, ballStartHeight,   0);
        ball.scaling  = new BABYLON.Vector3(0.2,             0.2, 0.2);

        meshes.forEach((mesh: any) => {
          if (mesh.material) {
            const material     = mesh.material;
            const ballMaterial = new BABYLON.StandardMaterial("ballMaterial", scene);
            ballMaterial.diffuseColor  = new BABYLON.Color3(  1,   1,   1);
            ballMaterial.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
            ballMaterial.specularPower = 128;
            mesh.material = ballMaterial;
          };
        });
      };
    },
  );
  console.log("Ball initialized successfully");
};

/**
 * Hit the ball towards player 2
 */
export function hitBallToPlayer2(): void {
  if (!ball || isGameActive || lastPlayer === 1) {
    console.warn("Ball already in play or last player was player 1");
    return;
  };

  playHitSound();
  ballVelocity.z = 5;
  isGameActive   = true;
  lastPlayer     = 1;
  console.log("Ball hit towards player 2");
};

/**
 * Hit the ball towards player 1
 */
export function hitBallToPlayer1(): void {
  if (!ball || isGameActive || lastPlayer === 2) {
    console.warn("Ball already in play or last player was player 2");
    return;
  };

  playHitSound();
  ballVelocity.z = -5;
  isGameActive   = true;
  lastPlayer     = 2;
  console.log("Ball hit towards player 1");
};

/**
 * Update the ball's position based on its velocity
 */
export function updateBallPosition(): void {
  if (!ball || !isGameActive) {
    console.warn("Ball not initialized or game not active");
    return;
  };

  ball.position.z += ballVelocity.z;

  let bounce = ballVelocity.z > 0 ? 200 : -200;
  let distance, traveled, height;

  if (ballVelocity.z > 0) {
    if (ball.position.z <= bounce) {
      distance = 600;
      traveled = ball.position.z + 400;
      height   = 1 - (traveled / distance);
      if (ball.position.z === bounce - 30) {
        playBounceSound();
      };
    } else {
      distance = 200;
      traveled = ball.position.z - bounce;
      height   = traveled / distance;
    };
  } else {
    if (ball.position.z >= bounce) {
      distance = 600;
      traveled = 400 - ball.position.z;
      height   = 1 - (traveled / distance);
      if (ball.position.z === bounce + 30) {
          playBounceSound();
      };
    } else {
      distance = 200;
      traveled = Math.abs(ball.position.z - bounce);
      height   = traveled / distance;
    };
  };

  ball.position.y = ballLowHeight + Math.max(0, Math.min(1, height)) * (ballStartHeight - ballLowHeight);

  if (ball.position.z > 400 || ball.position.z < -400) {
    stopBall();
  };
};

/**
 * Stop the ball and reset its position
 */
export function stopBall(): void {
  if (!ball) {
    console.warn("Ball not initialized");
    return;
  };

  ballVelocity    = { x: 0, z: 0, y: 0 };
  isGameActive    = false;
  ball.position.y = ballStartHeight;
  console.log("Ball stopped");
};