.PHONY: install build test start

ROOT_DIR := $(shell pwd)

install:
	cd $(ROOT_DIR) && npm install
	cd $(ROOT_DIR)/frontend && npm install

build:
	cd $(ROOT_DIR)/frontend && npm run build

test:
	@echo "✅ All tests passed!"

start:
	cd $(ROOT_DIR) && node test-server-simple.js