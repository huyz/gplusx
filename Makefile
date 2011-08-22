# GPlusX - Google+ Extension SDK
#
# Compiles CoffeeScript files into JavaScript

JSBEAUTIFIER = jsbeautifier.py
COFFEE = coffee
COFFEEFLAGS = --bare
COFFEE_HEADER = \n/****************************************************************************\n\
 * GPlusX mapping rules.\n\
 * This section was compiled from CoffeeScript on `date`.\n\
 ****************************************************************************/\n\n

#COFFEEX = coffeex

GPLUSX_HEADER = \n/****************************************************************************\n\
 * GPlusX + WebXDK\n\
 * File was combined by 'make' on `date`.\n\
 ****************************************************************************/\n\n


COFFEE_TARGETS := $(patsubst %.coffee,%.js,$(wildcard *.coffee))
LIBRARY_TARGET = gplusx.js
TARGETS = $(COFFEE_TARGETS) $(LIBRARY_TARGET)

all: $(LIBRARY_TARGET)

$(LIBRARY_TARGET): gplusx-rules.js gplusx-class.js
	@if [ -e $@ ]; then chmod +w "$@"; fi
	@echo "cat $^ > $@"
	@(echo "$(GPLUSX_HEADER)"; cat $^ ) > "$@"
	@chmod -w "$@"

#%.coffee : %.coffeex
#	webxdk/bin/coffeex $< > $@

%.js : %.coffee
	@echo "$(COFFEE) $(COFFEEFLAGS) --print -c $< > $@"
	@(echo "$(COFFEE_HEADER)"; $(COFFEE) $(COFFEEFLAGS) --print -c $<) > "$@" || ( rm -f "$@"; false )

clean:
	rm -f $(TARGETS)


#
# Miscellaneous shortcuts not related to build
#

# Check all JS files except for the combined library
lint: $(COFFEE_TARGETS)
	for i in $(filter-out $(LIBRARY_TARGET), $(wildcard *.js)); do jsl -process $$i; done

beautrules:
	perl -pe 's/\\n/\\\n        /g' gplusx-rules-cache.json | $(JSBEAUTIFIER) - > gplusx-rules-cache.js
