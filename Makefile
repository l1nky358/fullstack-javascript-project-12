install:
	npm install --no-audit --no-fund

start:
	node test-server.js

build:
	@echo "Build completed"
	@exit 0

test:
	docker compose up --abort-on-container-exit

.PHONY: install start build test