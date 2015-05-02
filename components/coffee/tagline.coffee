$ = require 'jquery'

do fill = (item = '這是全世界最厲害的!!!') ->
	$('.tagline').append "#{item}"
fill