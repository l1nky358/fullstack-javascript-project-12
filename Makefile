# Makefile для Hexlet Check

install:
	cd frontend && npm install
	npm install

build:
	cd frontend && npm run build

start:
	npm start

test:
	npx jest

lint:
	cd frontend && npx eslint .

.PHONY: install build start test lint