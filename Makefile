install:
	npm install

start:
	npx nodemon test-server.js

start-frontend:
	cd frontend && npm run dev

build:
	cd frontend && npm install && npm run build

test:
	npx playwright test