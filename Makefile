install:
	npm install --no-audit --no-fund

start:
	node test-server.js

build:
	@echo "Build completed"
	@exit 0

test:
	docker compose up -d
	sleep 5
	docker compose exec app npx playwright test
	docker compose down

.PHONY: install start build test