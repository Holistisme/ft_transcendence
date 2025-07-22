/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pad.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/18 13:56:52 by alexy             #+#    #+#             */
/*   Updated: 2025/07/22 10:04:55 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

let pad1 : any;
let pad2 : any;
let pos1 =   0;
let pos2 =   0;

const PAD_HEIGHT =  20;
const PAD_WIDTH  = 100;
const PAD_SPEED  =   3;
const PAD_LIMIT  = 200;

/**
 * Initialize the pads in the scene
 * @param scene The Babylon.js scene
 */
export function initPads(scene: any): void {
  if (!scene) {
    console.error("Scene not initialized");
    return;
  };

  console.log("Initializing pads...");
  pad1 = BABYLON.MeshBuilder.CreateGround("pad1", {
    width:  PAD_WIDTH,
    height: PAD_HEIGHT,
  }, scene);
  pad1.position = new BABYLON.Vector3(0, -155, -395);

  pad2 = BABYLON.MeshBuilder.CreateGround("pad2", {
    width:  PAD_WIDTH,
    height: PAD_HEIGHT,
  }, scene);
  pad2.position = new BABYLON.Vector3(0, -155, 395);

  const material1         = new BABYLON.StandardMaterial("pad1Material", scene);
  const material2         = new BABYLON.StandardMaterial("pad2Material", scene);
  material1.diffuseColor  = new BABYLON.Color3(0.2, 0.2, 0.8);
  material2.diffuseColor  = new BABYLON.Color3(0.8, 0.2, 0.2);
  material1.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.8);
  material2.emissiveColor = new BABYLON.Color3(0.8, 0.2, 0.2);
  material1.alpha         = 0.8;
  material2.alpha         = 0.8;
  pad1.material           = material1;
  pad2.material           = material2;

  console.log("Pads initialized successfully");
};

/**
 * Move the pad in the specified direction
 * @param pad The pad number (1 or 2)
 * @param direction The direction to move the pad ("up" or "down")
 */
export function movePad(pad: number, direction: string): void {
  if (pad !== 1 && pad !== 2) {
    console.error("Invalid pad number");
    return;
  };

  if (direction !== "up" && direction !== "down") {
    console.error("Invalid direction");
    return;
  };

  const padMesh = pad === 1 ? pad1 : pad2;
  const pos     = pad === 1 ? pos1 : pos2;
  const delta   = direction === "up" ? PAD_SPEED : -PAD_SPEED;
  const newPos  = pos + delta;

  if (newPos - PAD_WIDTH / 4 < -PAD_LIMIT || newPos + PAD_WIDTH / 4 > PAD_LIMIT) {
    console.warn("Pad movement out of bounds");
    return;
  };

  padMesh.position.x += delta;
  if (pad === 1) {
    pos1 = newPos;
  } else {
    pos2 = newPos;
  };

  console.log(`Pad ${pad} moved ${direction} to position:`, padMesh.position);
};