/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   camera.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/17 18:10:03 by alexy             #+#    #+#             */
/*   Updated: 2025/07/17 18:46:44 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//TODO: Lock camera on the Y axis and disable zoom.

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

  // TODO: Uncomment to lock the camera on the Y axis.
  // camera.lowerBetaLimit = Math.PI / 2.5;
  // camera.upperBetaLimit = Math.PI / 2.5;

  // TODO: Uncomment to disable zoom.
  // camera.inputs.attached.mousewheel.detachControl();

  // TODO: Uncomment to lock the camera distance.
  // camera.lowerRadiusLimit = 450;
  // camera.upperRadiusLimit = 450;

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

  return new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
};