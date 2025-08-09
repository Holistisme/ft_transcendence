/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   table.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/07 21:26:07 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 14:31:41 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { game } from "./state.js";

const scale = {
  width : 2.5,
  height: 4,
  depth : 2.25,
};

/**
 * Initializes the ping pong table in the 3D scene.
 */
export function initTable(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!game.scene) {
      console.error("Scene not initialized");
      reject("Scene not initialized");
      return;
    };

    console.log("Initializing table...");
    BABYLON.SceneLoader.ImportMesh("", "/assets/models/table/", "model.glb", game.scene,
      (meshes: any) => {
        if (!meshes || meshes.length === 0) {
          console.error("Ping pong table model not found or failed to load");
          return;
        } else console.log("Ping pong table loaded successfully");

        const table          = meshes[0];
        table.rotation       = new BABYLON.Vector3(-(Math.PI / 2), 0, 0);
        table.receiveShadows = true;
        table.scaling        = new BABYLON.Vector3(scale.width, scale.depth, scale.height);

        meshes.forEach((mesh: any) => {
          if (mesh.material) {
            const material                 = new BABYLON.StandardMaterial("tableMaterial",                    game.scene);
            material.diffuseTexture        = new BABYLON.Texture         ("/assets/models/table/texture.jpg", game.scene);
            material.diffuseTexture.vScale = -1;
            mesh.material                  = material;
            mesh.receiveShadows            = true;
          };
        });

        let boundingInfo  = meshes[1].getBoundingInfo();
        game.table.mesh   = table;
        game.table.width  = boundingInfo.boundingBox.extendSize.x * 2 * scale.width;
        game.table.height = boundingInfo.boundingBox.extendSize.z * 2 * scale.height;
        game.table.depth  = boundingInfo.boundingBox.extendSize.y * 2 * scale.depth;

        table.position    = new BABYLON.Vector3(0, -game.table.height * 1.33, 0);
        game.table.center = table.position;

        console.log("Ping pong table model processed successfully");
        resolve();
      },
    );
  });
};