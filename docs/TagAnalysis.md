### Part-of-speech analysis

Tagging is the process of marking up a word in a text as corresponding to a particular part of speech, based on both its definition and its context. In essence, it identifies words as nouns, verbs, adjectives, adverbs and so on.

The POST endpoint for the tagging analysis is

    http://api.qwiery.com/language/pos

and can be accessed for example using the terminal like so

    curl --header 'apiKey:Anonymous' --data 'text="The new service works amazingly well."' -X POST 'http://api.qwiery.com/language/pos/'
    
Note that accessing these endpoints via your browser will not work. The GET method used by a browser is not available for all endpoints.

which will return something like

       {
           "original": "\"The new service works amazingly well.\"",
           "pos": [
               {
                   "word": "\"",
                   "tag": "\"",
                   "label": "quote",
                   "color": "Thistle"
               },
               {
                   "word": "The",
                   "tag": "DT",
                   "label": "Determiner",
                   "color": "Purple"
               },
               {
                   "word": "new",
                   "tag": "JJ",
                   "label": "Adjective",
                   "color": "Blue"
               },
               {
                   "word": "service",
                   "tag": "NN",
                   "label": "Noun, sing. or mass",
                   "color": "Moccasin"
               },
               {
                   "word": "works",
                   "tag": "NNS",
                   "label": "Noun, plural",
                   "color": "Aqua"
               },
               {
                   "word": "amazingly",
                   "tag": "RB",
                   "label": "Adverb",
                   "color": "Chocolate"
               },
               {
                   "word": "well",
                   "tag": "RB",
                   "label": "Adverb",
                   "color": "Chocolate"
               },
               {
                   "word": ".",
                   "tag": ".",
                   "label": "Punctuation",
                   "color": "Pink"
               },
               {
                   "word": "\"",
                   "tag": "\"",
                   "label": "quote",
                   "color": "Thistle"
               }
           ]
       }
 
 The meaning of the returned properties is as follows:
 
 - **word**: The token being tagged.
 - **tag**:  The Penn-Treebank tag.
 - **label**: The meaning of the tag.
 - **color**: A Qwiery-specific color assigned to the tag.
 
 
You can also test this via the [interactive API documentation](/dashboard/apidocs/).
 
If you use the JavaScript SDK you can approach things like so
    
     Qwiery.apiKey = "my secret key";
     Qwiery.getPos("I am so grateful for all the presents, thank you!")
        .then(
            function(results){
                // your turn        
            }
        );
  
Other SDK's have a similar approach.
  
  