/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   game.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 11:41:07 by alexy             #+#    #+#             */
/*   Updated: 2025/07/09 12:43:29 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function showGame(): Promise<void> {
    const app = document.getElementById('app')!;
    const res = await fetch('/views/game/game.html');
    if (!res.ok) {
        app.innerHTML = '<p>Error loading game view.</p>';
        return;
    };
    app.innerHTML = await res.text();
};