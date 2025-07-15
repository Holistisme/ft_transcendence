/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   main.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/09 11:38:50 by alexy             #+#    #+#             */
/*   Updated: 2025/07/15 13:17:45 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { initRouter } from './router.js';

document.addEventListener('DOMContentLoaded', () => {
    const link = document.createElement('link');
    link.rel   = 'stylesheet';
    link.href  = '/assets/wip.css';
    document.head.appendChild(link);

    initRouter();
});