survey.js --- a very simple form-based survey
---------------------------------------------

### about & usage

Reads the questions from a `.json` file, and writes the output to
another `.json` file -- just trying to get a little experience with js
and node...

An example `questions.json` file could contain the following

    [{"name":"os",
      "question":"Which computer system would you prefer?",
      "choices":["Linux", "Windows", "Mac"]},
     {"name":"hardware",
      "question":"How should hardware monies be spent",
      "choices":["RAM", "CPU", "Screens", "Comfortable Keyboards"]},
     {"name":"os-why",
      "question":"Why is that",
      "text":""}]

### requirements & instillation

* [node.js](http://nodejs.org/) with `npm`
  (see [installing node and npm](http://joyeur.com/2010/12/10/installing-node-and-npm/))
  
* [express](http://expressjs.com/) which may be installed with `npm`
