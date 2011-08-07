# GPlusX - Google+ Extension SDK
#
# Compiles CoffeeScript files into JavaScript

COFFEE = coffee
COFFEEFLAGS = --bare
COFFEE_HEADER = \n\
/****************************************************************************\n\
 * GPlusX mapping rules.\n\
 * File was generated from CoffeeScript.\n\
 ****************************************************************************/\n\n

GPLUSX_HEADER = \n\
/****************************************************************************\n\
 * GPlusX + WebXDK\n\
 * File was combined from multiple input files.\n\
 ****************************************************************************/\n\n


COFFEE_TARGETS := $(patsubst %.coffee,%.js,$(wildcard *.coffee))
LIBRARY_TARGET = gplusx.js
TARGETS = $(COFFEE_TARGETS) $(LIBRARY_TARGET)

all: $(LIBRARY_TARGET)

gplusx.js: webxdk/webx.js gplusx-rules.js gplusx-class.js
	@(echo "$(GPLUSX_HEADER)"; cat $^ )> gplusx.js


%.js : %.coffee
	@(echo "$(COFFEE_HEADER)"; $(COFFEE) $(COFFEEFLAGS) --print -c $<) > $@

clean:
	rm $(TARGETS)
