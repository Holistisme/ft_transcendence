/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   home.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 11:41:35 by alexy             #+#    #+#             */
/*   Updated: 2025/07/15 13:27:53 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function showHome(): Promise<void> {
    const app = document.getElementById('app')!;
    const res = await fetch('/views/home/home.html');
    if (!res.ok) {
        app.innerHTML = '<p>Error loading home view.</p>';
        return;
    };
    app.innerHTML = await res.text();
};