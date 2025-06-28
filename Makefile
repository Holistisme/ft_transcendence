# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: aheitz <aheitz@student.42.fr>              +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2025/06/28 15:31:51 by aheitz            #+#    #+#              #
#    Updated: 2025/06/28 15:45:08 by aheitz           ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

# Makefile for ft_transcendence project

IMAGE        := ft_transcendence
COMPOSE      := docker-compose.yml
NODE_MODULES := node_modules

.PHONY: all build run stop clean install dev docker-build compose-up fclean re help

all: build

build: install
	@echo "Building the project..."
	@npm run build

install:
	@echo "Installing dependencies..."
	@npm ci

dev:
	@echo "Starting the development server..."
	@npm run dev

docker-build:
	@echo "Building Docker image..."
	@docker build -t $(IMAGE) .

run:
	@echo "Running the Docker container..."
	@docker run --rm -p 3000:3000 $(IMAGE)

compose-up:
	@echo "Starting the application using Docker Compose..."
	@docker-compose -f $(COMPOSE) up -d

stop:
	@echo "Stopping the Docker container..."
	@docker stop $(shell docker ps -q --filter ancestor=$(IMAGE))

clean:
	@echo "Cleaning up..."
	@rm -rf dist/ $(NODE_MODULES) public/*.html

fclean: clean
	@echo "Removing Docker image..."
	@docker rmi $(IMAGE) || true
	@rm -rf public/ dist/

re: fclean all
	@echo "Rebuilding the project..."

help:
	@echo "Makefile commands:"
	@echo "  all          - Build the project"
	@echo "  build        - Build the project and install dependencies"
	@echo "  run          - Run the Docker container"
	@echo "  stop         - Stop the Docker container"
	@echo "  clean        - Clean up build artifacts"
	@echo "  fclean       - Clean up and remove Docker image"
	@echo "  re           - Rebuild the project"
	@echo "  install      - Install dependencies"
	@echo "  dev          - Start the development server"
	@echo "  docker-build - Build the Docker image"
	@echo "  compose-up   - Start the application using Docker Compose"
	@echo "  help         - Show this help message"