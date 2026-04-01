.PHONY: install build start test

install:
	npm install

build:
	echo "Build completed"

start:
	npm start

test:
	test-server.js
