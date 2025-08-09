/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 11:41:07 by alexy             #+#    #+#             */
/*   Updated: 2025/08/09 14:47:40 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { initGraphics, startRendering } from "../../modules/graphics3D/rendering.js";

export async function showGame(): Promise<void> {
    const app = document.getElementById('app')!;
    const res = await fetch('/views/game/game.html');
    if (!res.ok) {
        app.innerHTML = '<p>Error loading game view.</p>';
        return;
    };
    app.innerHTML = await res.text();

    document.getElementById('start-game')!.addEventListener('click', async () => {
        await initGraphics('game-canvas');
        startRendering    ();
    });
};