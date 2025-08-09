/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   camera.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:10:03 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 14:26:38 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { game } from "./state.js";

/**
 * Initializes the camera for the 3D scene.
 */
export function initCamera(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!game.scene || !game.engine || !game.table.mesh) {
      if (!game.scene)       console.error("Scene not initialized");
      if (!game.engine)      console.error("Engine not initialized");
      if (!game.table.mesh)  console.error("Table mesh not initialized");
      reject();
      return;
  } else console.log("Initializing camera...");

    game.camera.radius =                Math.max(game.table.width, game.table.depth) * 1;
    const beta         = Math.PI / 2 - Math.atan(game.table.height / game.camera.radius);

    game.camera.object = new BABYLON.ArcRotateCamera("camera", Math.PI, beta, game.camera.radius, new BABYLON.Vector3(0, game.table.center.y + game.table.height, 0), game.scene);

    game.camera.object.lowerAlphaLimit  = game.camera.object.upperAlphaLimit  = Math.PI;
    game.camera.object.lowerBetaLimit   = game.camera.object.upperBetaLimit   = beta;
    game.camera.object.lowerRadiusLimit = game.camera.object.upperRadiusLimit = game.camera.radius;
    game.camera.object.inputs.attached.mousewheel.detachControl();
    game.camera.object.inputs.attached.pointers  .detachControl();
    game.camera.object.inputs.attached.keyboard  .detachControl();

    game.camera.object.attachControl(game.engine.getRenderingCanvas(), true);

    console.log("Camera initialized successfully at:", game.camera.object.position);
    resolve();
  });
};

/**
 * Initializes the lights for the 3D scene.
 */
export function initLight(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!game.scene) {
      console.error("Scene not initialized");
      reject();
      return;
    } else console.log("Initializing lights...");

    const ambientLight     = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), game.scene);
    ambientLight.intensity = 0.6;
    console.log("Ambient light initialized successfully");

    game.camera.shadowLight           = new BABYLON.DirectionalLight("shadowLight", new BABYLON.Vector3(0, -1, 0), game.scene);
    game.camera.shadowLight.position  = new BABYLON.Vector3(0, 100, 0);
    game.camera.shadowLight.intensity = 0.8;
    console.log("Shadow light initialized successfully");

    console.log("Light initialized successfully");
    resolve();
  });
};