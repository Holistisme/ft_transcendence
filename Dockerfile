# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: alexy <alexy@student.42.fr>                +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/07/10 11:49:51 by alexy             #+#    #+#              #
#    Updated: 2025/07/15 11:35:56 by alexy            ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN  npm ci

COPY . .
RUN  npm run build

# **************************************************************************** #

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN  npm ci --production

COPY --from=builder /app/dist                ./dist
COPY --from=builder /app/src/frontend/views  ./frontend/views
COPY --from=builder /app/src/frontend/assets ./dist/assets

ENV NODE_ENV=production
CMD ["node", "dist/backend/server.js"]