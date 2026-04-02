.PHONY: install build start test

install:
	npm install

build:
	npm run build

start:
	npm start

test:
	@echo "Starting app without tests"
	docker compose up
