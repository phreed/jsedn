module.exports = (string) ->
	"return require('tsedn').parse(\"#{string.replace(/"/g, '\\"').replace(/\n/g, " ").trim()}\")"
