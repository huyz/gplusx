# GPlusX - Google+ Extension SDK

MINIFY = closure
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
 ****************************************************************************/\n\n\
;(function(window, $$, undefined) { // Semicolon coz https://github.com/mootools/slick/wiki/IIFE\n\n\
// Like jQuery\n\
var document = window.document;\n

GPLUSX_FOOTER = \n}).call(/*<CommonJS>*/(typeof exports != 'undefined') ? exports : /*</CommonJS>*/this, window, jQuery);\n


LIBRARY_TARGET = gplusx.js
DIST_LIBRARY_TARGET = gplusx-min.js
COFFEE_TARGETS := $(patsubst %.coffee,%.js,$(wildcard *.coffee))
TARGETS = $(COFFEE_TARGETS) $(LIBRARY_TARGET)

all: $(LIBRARY_TARGET)

dist: $(DIST_LIBRARY_TARGET)

$(LIBRARY_TARGET): gplusx-class.js gplusx-rules.js
	@if [ -e $@ ]; then chmod +w "$@"; fi
	@echo "cat $^ > $@"
	@(echo "$(GPLUSX_HEADER)"; cat $^; echo "$(GPLUSX_FOOTER)" ) > "$@"
	@chmod -w "$@"

#%.coffee : %.coffeex
#	webxdk/bin/coffeex $< > $@

%.js : %.coffee
	@echo "$(COFFEE) $(COFFEEFLAGS) --print -c $< > $@"
	@(echo "$(COFFEE_HEADER)"; $(COFFEE) $(COFFEEFLAGS) --print -c $<) > "$@" || ( rm -f "$@"; false )

$(DIST_LIBRARY_TARGET) : $(LIBRARY_TARGET)
	$(MINIFY) < $^ > $@

clean:
	rm -f $(TARGETS)


#
# Miscellaneous shortcuts not related to build
#

# Check all JS files except for the combined library
lint: $(COFFEE_TARGETS)
	for i in $(filter-out $(LIBRARY_TARGET), $(wildcard *.js)); do jsl -process $$i; done

beautrules:
	perl -pe 's/\\n/\\\n        /g' gen/gplusx-rules-cache.json | $(JSBEAUTIFIER) - > gen/gplusx-rules-cache.js
