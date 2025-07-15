/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   profile.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 11:41:53 by alexy             #+#    #+#             */
/*   Updated: 2025/07/09 12:46:35 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export async function showProfile(): Promise<void> {
    const app = document.getElementById('app')!;
    const res = await fetch('/views/profile/profile.html');
    if (!res.ok) {
        app.innerHTML = '<p>Error loading profile view.</p>';
        return;
    };
    app.innerHTML = await res.text();
};