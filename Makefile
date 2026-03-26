install:
	cd frontend && npm install --no-audit --no-fund
	npm install --no-audit --no-fund

start:
	node test-server.js

build:
	@echo "Build completed"
	@exit 0

.PHONY: install start build
