# Makefile для Hexlet Check

install:
	cd frontend && npm install --no-audit --no-fund
	npm install --no-audit --no-fund

build:
	cd frontend && chmod +x node_modules/.bin/vite 2>/dev/null || true
	cd frontend && npm run build

start:
	node test-server.js

.PHONY: install build start
