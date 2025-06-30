/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: adesille <adesille@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/28 09:54:20 by aheitz            #+#    #+#             */
/*   Updated: 2025/06/30 12:49:37 by adesille         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// A simple Fastify server that responds with "Hello Pong!" on the root path.

import 'dotenv/config';
import fastify from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";
import { userRoutes } from './routes/users';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = fastify({logger: true});

// Register plugins
app.register(helmet);
app.register(cors, { origin: true });

// Register routes
app.register(userRoutes);

// Default route
app.get("/", async () => 'Hello Pong!');

const start = async () => {
    try {
        await app.listen({port: PORT, host: HOST});
        app.log.info(`Server listening on http://${HOST}:${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    };
};

start();