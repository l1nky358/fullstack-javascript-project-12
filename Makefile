install:
	npm install --no-audit --no-fund

start:
	npm start

build:
	npm run build

lint:
	npx eslint --ext js,jsx --no-eslintrc --config .eslintrc.yml . frontend