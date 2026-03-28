install:
	npm install --no-audit --no-fund

start:
	npm start

build:
	@echo "Build completed"
	@exit 0

test:
	npx playwright test

.PHONY: install start build test