/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ball.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/15 17:06:59 by alexy             #+#    #+#             */
/*   Updated: 2025/07/22 10:03:20 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { playHitSound, playBounceSound, playGoalSound } from   "./audio.js";
import { createSparkleEffect }                          from "./sparkle.js";

let ball:               any;
let ballStartHeight =   -25;
let ballLowHeight   =  -175;
let isGameActive    = false;
let lastPlayer      =     0;

let ballVelocity = { x: 0, z: 0, y: 0 };

const sideLimit = 220;

let shadowGenerator: any;

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
        ball      = meshes[0];
        ball.name = "ball";

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

        initBallShadow(scene);
        serveBall();
      };
    },
  );
  console.log("Ball initialized successfully");
};

/**
 * Initialize the ball's shadow
 * @param scene The Babylon.js scene
 */
function initBallShadow(scene: any): void {
  if (!ball) {
    console.error("Ball not initialized");
    return;
  };

  console.log("Initializing ball shadow...");
  const shadowLight = scene.getLightByName("shadowLight");
  if (!shadowLight) {
    console.error("Shadow light not found");
    return;
  };

  console.log("Creating shadow generator...");
  shadowGenerator = new BABYLON.ShadowGenerator(1024, shadowLight);
  shadowGenerator.addShadowCaster(ball);
  shadowGenerator.useExponentialShadowMap = true;
  console.log("Ball shadow initialized");
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
  ballVelocity.z = 4;
  ballVelocity.x = 0;
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
  ballVelocity.z = -4;
  ballVelocity.x =  0;
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
  ball.position.x += ballVelocity.x;

  if (ball.position.x > sideLimit || ball.position.x < -sideLimit) {
    ballVelocity.x *= -1;
    playBounceSound();
    createSparkleEffect(ball.getScene(), ball.position);
  };

  checkPadCollisions();

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
 * Check for collisions between the ball and the pads
 */
function checkPadCollisions(): void {
  const scene = ball.getScene();
  if (!scene) {
    console.error("Scene not found");
    return;
  };

  const pad1 = scene.getMeshByName("pad1");
  const pad2 = scene.getMeshByName("pad2");

  if (!pad1 || !pad2) {
    console.error("Pads not found");
    return;
  };

  if (ballVelocity.z < 0 && ball.position.z <= -350) {
    if (isCollidingWithPad(ball.position, pad1.position)) {
      ballVelocity.z = Math.abs(ballVelocity.z);

      const offsetX  = ball.position.x - pad1.position.x;
      ballVelocity.x = offsetX * 0.1;

      playHitSound();
      createSparkleEffect(scene, ball.position);
      lastPlayer = 1;
      console.log("Ball hit by player 1");
    };
  } else if (ballVelocity.z > 0 && ball.position.z >= 350) {
    if (isCollidingWithPad(ball.position, pad2.position)) {
      ballVelocity.z = -Math.abs(ballVelocity.z);

      const offsetX  = ball.position.x - pad2.position.x;
      ballVelocity.x = offsetX * 0.1;

      playHitSound();
      createSparkleEffect(scene, ball.position);
      lastPlayer = 2;
      console.log("Ball hit by player 2");
    };
  };
};

/**
 * Check if the ball is colliding with a pad
 * @param ballPos The position of the ball
 * @param padPos The position of the pad
 * @returns Whether the ball is colliding with the pad
 */
function isCollidingWithPad(ballPos: any, padPos: any): boolean {
  const PAD_WIDTH   = 100;
  const PAD_HEIGHT  =  20;
  const BALL_RADIUS =   5;

  const deltaX = Math.abs(ballPos.x - padPos.x);
  const deltaZ = Math.abs(ballPos.z - padPos.z);

  return deltaX <= (PAD_WIDTH / 2 + BALL_RADIUS) &&
    deltaZ <= (PAD_HEIGHT / 2 + BALL_RADIUS);
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

  playGoalSound();
  ball.position.x = 0;
  ball.position.z = 0;

  serveBall();
};

/**
 * Serve the ball at the start of the game or after a point
 */
export function serveBall(): void {
  if (!ball) {
    console.warn("Ball not initialized");
    return;
  };

  console.log("Serving ball...");
  ball.position.x = 0;
  ball.position.z = 0;
  ball.position.y = ballStartHeight;
  ballVelocity    = { x: 0, z: 0, y: 0 };

  isGameActive = false;
  lastPlayer   = 0;

  Math.random() < 0.5 ? hitBallToPlayer1() : hitBallToPlayer2();
  console.log("Ball served");
};