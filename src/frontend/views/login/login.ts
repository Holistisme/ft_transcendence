/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   login.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 11:41:45 by alexy             #+#    #+#             */
/*   Updated: 2025/07/09 12:45:54 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function showLogin(): Promise<void> {
    const app = document.getElementById('app')!;
    const res = await fetch('/views/login/login.html');
    if (!res.ok) {
        app.innerHTML = '<p>Error loading login view.</p>';
        return;
    };
    app.innerHTML = await res.text();
};