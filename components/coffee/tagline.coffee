$ = require 'jquery'

do fill = (item = '這是全世界最富有創意的想法') ->
	$('.tagline').append "#{item}"
fill