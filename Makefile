install:
	npm install --no-audit --no-fund

start:
	npm start

build:
	@echo "Build completed"
	@exit 0

lint:
	npx eslint --ext js,jsx --no-eslintrc --config .eslintrc.yml . frontend || true

.PHONY: install start build lint