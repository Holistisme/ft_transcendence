/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   state.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/07 20:43:07 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 14:30:16 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

declare const BABYLON: any;

import { Game } from "./types.js";

export const game: Game = {
  engine   :  null,
  scene    :  null,
  camera   : {
    object:      null,
    radius:         0,
    shadowLight: null,
  },
  ball     : {
    mesh       :  null,
    position   :  null,
    velocity   :  null,
    radius     :     0,
    lastHitter :     0,
    isMoving   : false,
    spin       :     0,
    heightMax  :     0,
    heightMin  :     0,
    sideLimit  :     0,
    lengthLimit:     0,
    bounce     :     0,
    speed      :     0,
  },
  table: {
    mesh  : null,
    width :    0,
    height:    0,
    depth :    0,
    center: null,
  },
  players: [
    {
      id   :          1,
      score:          0,
      name : "Player 1",
      pad  : {
        mesh    : null,
        position: null,
        speed   :    0,
        height  :    0,
        width   :    0,
        limit   :    0,
      },
    },
    {
      id   :          2,
      score:          0,
      name : "Player 2",
      pad  : {
        mesh    : null,
        position: null,
        speed   :    0,
        height  :    0,
        width   :    0,
        limit   :    0,
      },
    },
  ],
};