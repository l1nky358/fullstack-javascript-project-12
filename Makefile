lint-frontend:
	make -C frontend lint
install:
	npm install --no-audit --no-fund
start-frontend:
	make -C frontend start
start-backend:
	npx start-server -s ./frontend/dist
start:
	node test-server.js
deploy:
	git push heroku main
develop:
	make -j 2 start-backend start-frontend
build:
	rm -rf frontend/dist
	npm run build
test:
	npm test

.PHONY: install start-backend start-frontend deploy start develop build test lint-frontend
