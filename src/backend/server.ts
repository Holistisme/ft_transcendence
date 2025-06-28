/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: aheitz <aheitz@student.42.fr>              +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/06/28 09:54:20 by aheitz            #+#    #+#             */
/*   Updated: 2025/06/28 10:39:29 by aheitz           ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

// A simple Fastify server that responds with "Hello Pong!" on the root path.

import 'dotenv/config';
import fastify from "fastify";
import helmet from "@fastify/helmet";
import cors from "@fastify/cors";

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = fastify({logger: true});

app.register(helmet);
app.register(cors, {origin: true});

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