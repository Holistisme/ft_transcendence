/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ai.ts                                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/21 17:17:35 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 14:20:15 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { movePad } from "./pad.js";

let aiLastUpdate: number = 0;

//TODO: This is only a temporary solution, the AI should be improved later

/**
 * AI player logic
 * @param ball The ball object
 */
export function aiPlay(ball: any): void {
  if (!ball) {
    console.error("Ball not initialized");
    return;
  };

  // ! AI updates every 10 milliseconds
  // ! This is to simulate a more human-like reaction time
  const now = Date.now();
  if (now - aiLastUpdate < 20) {
    return;
  };
  aiLastUpdate = now;
  const ballX = ball.position.x;

  // ! Randomly skip AI movement to simulate human-like behavior
  // ! This adds unpredictability to the AI's performance
  if (Math.random() < 0.25) {
    return;
  };

  const scene = ball.getScene();
  if (!scene) {
    console.error("Scene not found");
    return;
  };

  const pad2 = scene.getMeshByName("pad2");
  if (!pad2) {
    console.error("Pad2 not found");
    return;
  };

  const pad2X      = pad2.position.x;
  let   difference =   ballX - pad2X;
  difference += (Math.random() - 0.5) * 30; // ! Add some randomness to the AI's movement
                                            // ! This simulates a more human-like reaction time

  if (Math.abs(difference) > 10) {
    if (difference > 0) {
      movePad(2, "up");
    } else {
      movePad(2, "down");
    };
  };
};