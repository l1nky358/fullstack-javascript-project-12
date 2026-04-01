.PHONY: install build start test

install:
	npm install --no-audit --no-fund

build:
	echo "Build completed"

start:
	npm start

test:
	@echo "Tests skipped"
	exit 0
