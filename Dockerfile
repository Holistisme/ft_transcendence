# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Dockerfile                                         :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: aheitz <aheitz@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/06/28 14:49:21 by aheitz            #+#    #+#              #
#    Updated: 2025/06/28 15:43:40 by aheitz           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Dockerfile for a Node.js application with multi-stage build

###############################################################################

# Stage 1: Build the application

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN  npm ci

COPY . .
RUN  npm run build

# Stage 2: Production image

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN  npm ci --production

COPY --from=builder /app/dist   ./dist
# COPY --from=builder /app/public ./public //TODO: Should be uncommented when public folder is used.

ENV NODE_ENV=production

CMD ["node", "dist/backend/server.js"]