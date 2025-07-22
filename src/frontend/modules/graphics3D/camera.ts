/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   camera.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:10:03 by alexy             #+#    #+#             */
/*   Updated: 2025/07/21 18:25:49 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

/**
 * Initializes the camera for the scene.
 * @param scene The scene to attach the camera to.
 * @param engine The engine to use for rendering.
 * @returns The initialized camera.
 */
export function initCamera(scene: any, engine:any): any {
  if (!scene || !engine) {
    console.error("Scene or engine not initialized");
    return null;
  };

  console.log("Initializing camera...");
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5,
    450, BABYLON.Vector3.Zero(), scene);

  // TODO: Comment to unlock the camera on the Y axis.
  camera.lowerBetaLimit = Math.PI / 2.5;
  camera.upperBetaLimit = Math.PI / 2.5;

  // TODO: Comment to able zoom.
  camera.inputs.attached.mousewheel.detachControl();

  // TODO: Comment to unlock the camera distance.
  camera.lowerRadiusLimit = 550;
  camera.upperRadiusLimit = 550;

  camera.attachControl(engine.getRenderingCanvas(), true);
  console.log("Camera initialized successfully");

  return camera;
};

/**
 * Initializes a light for the scene.
 * @param scene The scene to attach the light to.
 * @returns The initialized light.
 */
export function initLight(scene: any): any {
  if (!scene) {
    console.error("Scene not initialized");
    return null;
  };

  console.log("Initializing light...");
  const ambientLight     = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
  ambientLight.intensity = 0.6;
  console.log("Ambient light initialized successfully");

  console.log("Initializing shadow light...");
  const shadowLight     = new BABYLON.DirectionalLight("shadowLight", new BABYLON.Vector3(0, -1, 0), scene);
  shadowLight.position  = new BABYLON.Vector3(0, 100, 0);
  shadowLight.intensity = 0.8;
  console.log("Light initialized successfully");
  return { ambientLight, shadowLight };
};