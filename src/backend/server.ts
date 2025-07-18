/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: alexy <alexy@student.42.fr>                +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/10 13:16:23 by alexy             #+#    #+#             */
/*   Updated: 2025/07/18 09:30:19 by alexy            ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import                       'dotenv/config';
import { userRoutes } from  './routes/users';
import fastify        from         'fastify';
import helmet         from '@fastify/helmet';
import cors           from   '@fastify/cors';
import path           from            'path';
import staticPlugin   from '@fastify/static';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST         || '0.0.0.0';

const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize:      true,
        translateTime: 'HH:MM:ss.l',
        ignore:        'pid,hostname',
        levelFirst:    true,
        messageFormat: '{msg}\n',
        crlf:          true,
        timestampKey:  'time',
        hideObject:    true,
        quoteString:   false,
        errorLikeObjectKeys: ['err', 'error'],
      },
    },
  },
});

app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"                   ],
      scriptSrc:  ["'self'", "'unsafe-eval'"  ],
      styleSrc:   ["'self'", "'unsafe-inline'"],
      imgSrc:     ["'self'", "data:", "blob:" ],
      mediaSrc:   ["'self'", "data:", "blob:" ],
      connectSrc: ["'self'"                   ],
      fontSrc:    ["'self'"                   ],
      objectSrc:  ["'none'"                   ],
      frameSrc:   ["'none'"                   ],
    },
  },
});

app.register(cors, {origin: true});

app.register(staticPlugin, {
  root:          path.join(__dirname, '../../dist/assets'),
  prefix:        '/assets/',
  wildcard:      true,
  decorateReply: false,
});

app.register(staticPlugin, {
  root:          path.join(__dirname, '../../dist/frontend/views'),
  prefix:        '/views/',
  wildcard:      true,
  decorateReply: false,
});

app.register(staticPlugin, {
  root:          path.join(__dirname, '../../dist/frontend/modules/graphics3D'),
  prefix:        '/graphics3D/',
  wildcard:      true,
  decorateReply: false,
});

app.register(staticPlugin, {
  root:          path.join(__dirname, '../../dist/frontend/modules'),
  prefix:        '/modules/',
  wildcard:      true,
  decorateReply: false,
});

app.register(staticPlugin, {
  root:          path.join(__dirname, '../../dist/frontend'),
  prefix:        '/frontend/',
  wildcard:      true,
  decorateReply: true,
});

app.get('/', (req, reply) => {
  reply.sendFile('index.html', path.join(__dirname,'../../dist'))
});

app.route({
  method: ['GET','HEAD'],
  url: '/*',
  handler(req, reply) {
    const url = req.raw.url || ''
    if (
      url.startsWith('/user') ||
      url.startsWith('/assets/') ||
      url.startsWith('/views/') ||
      url.startsWith('/frontend/') ||
      url.startsWith('/modules/') ||
      url.startsWith('/graphics3D/') ||
      /\.\w+$/.test(url)
    ) {
      return reply.callNotFound()
    };
    reply.sendFile('index.html', path.join(__dirname,'../../dist'))
  },
});

app.listen({port: PORT, host: HOST})
  .then(() => app.log.info(`Server listening on http://${HOST}:${PORT}`))
  .catch(err => {
    app.log.error(err);
    process.exit(1);
  });