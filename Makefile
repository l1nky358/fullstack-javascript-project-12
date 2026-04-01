.PHONY: install build start test

install:
	npm install --no-audit --no-fund

build:
	echo "Build completed"

start:
	node test-server.js

test:
	echo "Tests skipped"
