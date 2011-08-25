/// survey.js --- a simple form-based survey

// Reads the questions from a .json file, and writes the output to
// another .json file -- just trying to get a little js experience

// Copyright (C) 2011  Eric Schulte

/// License:

// This program is free software/ you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation/ either version 3, or (at your option)
// any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY/ without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with GNU Emacs/ see the file COPYING.  If not, write to the
// Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
// Boston, MA 02110-1301, USA.

/// Code:
require.paths.unshift('./node_modules')
var sys = require('sys')
var fs = require('fs')
var express = require('express')


/// utility
var map = function(list, func){
  var i
  var accum = []
  for(i=0; i<list.length; i+=1)
    accum.push(func(list[i]))
  return accum
}

// allow a more compact method of writing the question specs in json
var decode = function(specs){
  var out = []
  map(specs,function(spec){
    out.push(spec.question)
    if (spec.choices)
      map(spec.choices, function(choice){
        out.push({type: 'radio',
                  name:  spec.name,
                  value: choice.toLowerCase().replace(/ /g,"_"),
                  body:  choice})})
    else if (spec.options)
      map(spec.options, function(option){
        out.push({type: 'checkbox',
                  name:  spec.name,
                  value: option.toLowerCase().replace(/ /g,"_"),
                  body:  option})})
    else if (typeof specs[2].text)
      out.push({type: 'text',
                name: spec.name,
                value: spec.text})
  })
  return out
}

// convert an object to an input element
var input = function(spec){
  var name
  var out='<input'
  for(name in spec)
    if(name !== 'body')
      out = out+' '+name+'="'+spec[name]+'"'

  if(spec.body)
    out=out+'>'+spec.body+'</input>'
  else
    out=out+'/>'
  return out+'<br/>\n'
}

// turn a list of specs into a single form
var to_form = function(specs){
  var out=''
  map(specs, function(spec){
    if (typeof spec === 'string') { out=out+'<p>'+spec+'</p>\n' }
    else                          { out=out+input(spec) } })
  out=out+input({type: 'submit', value: 'submit'})
  return '<form method="post">\n'+out+'</form>\n'
}


/// application
var app = express.createServer()
var log = fs.createWriteStream('answers.json', {'flags': 'a'});

// application configuration from
// https://github.com/visionmedia/express/tree/master/examples/form
app.use(express.bodyDecoder())
app.use(express.methodOverride())
app.use(express.cookieDecoder())

// read the questions from an external .json file
var specs = JSON.parse(fs.readFileSync('questions.json', 'utf8'))

// first page of the survey
app.get('/', function(req, res){ res.send(to_form(decode(specs))) })

// recieve the form, and save to a file with the submitter's url
app.post('/', function(req, res){
  var answer = req.body
  answer.ip = req.header('x-forwarded-for') || req.connection.remoteAddress
  answer.time = Date.now()
  log.write(JSON.stringify(answer)+'\n')
  res.redirect('/complete')
})

// Thank the participant
app.get('/complete', function(req, res){ res.send("Thanks for participating.") })

// Run the application
app.listen(3693)
console.log('Surveying on port 3693')

/// survey.js ends here
