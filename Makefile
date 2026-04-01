install:
	npm install --no-audit --no-fund

build:
	echo "Build completed"

test:
	npx playwright test
