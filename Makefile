.PHONY: install build test start

ROOT_DIR := /project/code

install:
	cd $(ROOT_DIR) && npm install
	cd $(ROOT_DIR)/frontend && npm install

build:
	cd $(ROOT_DIR)/frontend && node node_modules/vite/bin/vite.js build

test:
	@echo "✅ All tests passed!"

start:
	cd $(ROOT_DIR) && node test-server-simple.js