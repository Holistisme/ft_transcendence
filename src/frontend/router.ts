/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   router.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 11:39:56 by alexy             #+#    #+#             */
/*   Updated: 2025/07/15 13:27:38 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { showGame }    from       './views/game/game.js';
import { showHome }    from       './views/home/home.js';
import { showLogin }   from     './views/login/login.js';
import { showProfile } from './views/profile/profile.js';

const routes: Record<string, () => Promise<void>> = {
    '/'       :    showHome,
    '/game'   :    showGame,
    '/login'  :   showLogin,
    '/profile': showProfile,
};

function showNotFound(): Promise<void> {
    const app = document.getElementById('app')!;
    app.innerHTML = '<h1>404 Not Found</h1>';
    return Promise.resolve();
};

async function render(path: string): Promise<void> {
    const app = document.getElementById('app');
    if (!app)
        return;

    document.querySelectorAll('a[data-link]').forEach((link) => {
        const href = (link as HTMLAnchorElement).getAttribute('href');
        link.classList.toggle('active', href === path);
    });

    app.innerHTML = '';
    app.className = 'wip-page';

    const route = routes[path];
    if (route) {
        route().catch((error) => {
            console.error(`Error preloading route ${path}:`, error);
        });
    };

    const handler = route ?? showNotFound;
    try {
        await handler();
    } catch (error) {
        console.error(`Error rendering route ${path}:`, error);
        app.innerHTML = '<h1>Error loading page</h1>';
    };
};

export function initRouter(): void {
    document.body.addEventListener('click', (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('a[data-link]');
        if (target) {
            e.preventDefault();

            const href = target.getAttribute('href');
            if (!href)
                return;

            history.pushState({}, '', href);
            render(href);
        };
    });

    window.addEventListener('popstate', () => {
        render(window.location.pathname);
    });

    render(window.location.pathname);
};