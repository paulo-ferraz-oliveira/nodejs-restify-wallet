## Variables.

APP=wallet

## Main target.

.PHONY: all
all: clean update

## Clean targets.

clean:
	rm -rf ./node_modules

## Install targets.

update:
	npm install

## Main.

run:
	node ./lib/index.js

## Checks.

checks:
	jslint ./lib/index.js
	jslint ./lib/db.js
