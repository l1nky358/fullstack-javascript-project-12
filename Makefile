install:
	cd frontend && npm install
	npm install

build:
	cd frontend && npm run build

start:
	npm start

lint:
	cd frontend && npx eslint --ext js,jsx src

test:
	exit 0

.PHONY: install build start lint test
