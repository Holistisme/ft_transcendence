/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   types.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/08/07 18:05:55 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 14:33:30 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

//TODO: Clean up types and remove unused ones

export interface Camera {
  object:         any;
  radius:      number;
  shadowLight:    any;
};

export interface Table {
  mesh  :    any;
  width : number;
  height: number;
  depth : number;
  center:    any;
};

export interface Ball {
  mesh      :     any;
  position  :     any;
  velocity  :     any;
  radius    :  number;
  lastHitter:  number;
  isMoving  : boolean;
  spin      :  number;
  heightMax :  number;
  heightMin :  number;
  sideLimit :  number;
  lengthLimit: number;
  bounce     : number;
  speed      : number;
};

export interface Pad {
  mesh    :    any;
  position:    any;
  speed   : number;
  height  : number;
  width   : number;
  limit   : number;
};

export interface Player {
  id   : number;
  score: number;
  name : string;
  pad  :    Pad;
};

export interface Game {
  engine       :      any;
  scene        :      any;
  ball         :     Ball;
  table        :    Table;
  players      : Player[];
  camera       :   Camera;
  [key: string]:      any;
};