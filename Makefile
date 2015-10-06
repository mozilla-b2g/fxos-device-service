JS = $(shell find src/ -name "*.js")
ES5 = $(patsubst src/%.js, build/%.js, $(JS))

.PHONY: all
all: $(ES5)

build/%.js: src/%.js
	@mkdir -p "$(@D)"
	./node_modules/.bin/babel $< -o $@
