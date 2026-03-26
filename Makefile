# Makefile для Hexlet Check

install:
	cd frontend && npm install --no-audit --no-fund
	npm install --no-audit --no-fund

start:
	node test-server.js

test:
	npx playwright test

.PHONY: install start test
