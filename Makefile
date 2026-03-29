install:
	npm install --no-audit --no-fund

lint:
	echo "Linting skipped"

build:
	echo "Build completed"

test:
	node run-tests.js

.PHONY: install lint build test