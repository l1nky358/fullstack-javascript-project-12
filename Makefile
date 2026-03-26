# Makefile для Hexlet Check

install:
	cd frontend && npm install --no-audit --no-fund
	npm install --no-audit --no-fund

build:
	cd frontend && npm run build

start:
	node test-server.js

test:
	npx playwright test

.PHONY: install build start test
