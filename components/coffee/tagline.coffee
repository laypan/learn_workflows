$ = require 'jquery'

do fill = (item = 'This is the best ever!!!') ->
	$('.tagline').append "#{item}"
fill