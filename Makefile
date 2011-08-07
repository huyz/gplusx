# GPlusX - Google+ Extension SDK
#
# Compiles CoffeeScript files into JavaScript

COFFEE = coffee
COFFEEFLAGS =

COFFEE_TARGETS := $(patsubst %.coffee,%.js,$(wildcard *.coffee))

all: $(COFFEE_TARGETS)

%.js : %.coffee
	$(COFFEE) $(COFFEEFLAGS) -c $<
