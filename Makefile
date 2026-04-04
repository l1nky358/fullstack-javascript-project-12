install:
	cd frontend && npm install
	npm install

build:
	cd frontend && npm run build

start:
	cd frontend && npm run dev

lint:
	cd frontend && npx eslint --ext js,jsx src
