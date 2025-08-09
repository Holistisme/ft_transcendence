/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   pad.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/18 13:56:52 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 09:48:42 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { game } from "./state.js";

/**
 * Initialize the pads in the scene
 */
export function initPads(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!game.scene) {
      console.error("Scene not initialized");
      reject("Scene not initialized");
      return;
    };

    game.players[0].pad.height   = game.players[1].pad.height   = game.table.depth / 30;
    game.players[0].pad.width    = game.players[1].pad.width    = game.table.width / 10;
    game.players[0].pad.position = game.players[1].pad.position = game.table.depth / 2 - game.players[0].pad.height / 1.5;
    game.players[0].pad.limit    = game.players[1].pad.limit    = game.table.width / 2 * 0.95 - game.players[0].pad.width;
    game.players[0].pad.speed    = game.players[1].pad.speed    = game.players[0].pad.width / 10;

    console.log("Initializing pads...");
    game.players[0].pad.mesh = BABYLON.MeshBuilder.CreateGround("pad1", {
      width:  game.players[0].pad.width,
      height: game.players[0].pad.height,
    }, game.scene);
    game.players[0].pad.mesh.position = new BABYLON.Vector3(0, game.table.center.y + game.table.height * 0.84, game.players[0].pad.position);

    game.players[1].pad.mesh = BABYLON.MeshBuilder.CreateGround("pad2", {
      width:  game.players[1].pad.width,
      height: game.players[1].pad.height,
    }, game.scene);
    game.players[1].pad.mesh.position = new BABYLON.Vector3(0, game.table.center.y + game.table.height * 0.84, -game.players[1].pad.position);

    const material1         = new BABYLON.StandardMaterial("pad1Material", game.scene);
    const material2         = new BABYLON.StandardMaterial("pad2Material", game.scene);
    material1.diffuseColor  = new BABYLON.Color3(0.2, 0.2, 0.8);
    material2.diffuseColor  = new BABYLON.Color3(0.8, 0.2, 0.2);
    material1.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.8);
    material2.emissiveColor = new BABYLON.Color3(0.8, 0.2, 0.2);
    material1.alpha         = 0.8;
    material2.alpha         = 0.8;
    game.players[0].pad.mesh.material = material1;
    game.players[1].pad.mesh.material = material2;

    console.log("Pads initialized successfully");
    resolve();
  });
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

  const padMesh = pad       === 1    ? game.players[0]      .pad.mesh            :  game.players[1]      .pad.mesh;
  const pos     = pad       === 1    ? game.players[0]      .pad.mesh.position.x :  game.players[1]      .pad.mesh.position.x;
  const delta   = direction === "up" ? game.players[pad - 1].pad.speed           : -game.players[pad - 1].pad.speed;
  const newPos  = pos + delta;

  if (newPos < -game.players[pad - 1].pad.limit || newPos > game.players[pad - 1].pad.limit) {
    console.warn("Pad movement out of bounds");
    return;
  };

  padMesh.position.x += delta;
  game.players[pad === 1 ? 0 : 1].pad.position = newPos;
};