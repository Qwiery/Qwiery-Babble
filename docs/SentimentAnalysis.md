### Sentiment Analysis

The POST endpoint for sentiment analysis is

    http://api.qwiery.com/language/sentiment

and can be accessed for example using the terminal like so

    curl --header 'apiKey:Anonymous' --data 'text="The new service works amazingly well."' -X POST 'http://api.qwiery.com/language/sentiment/'

 > Note that accessing these endpoints via your browser will not work. The GET method used by a browser is not available for all endpoints.

which will return something like

    {
        "score": 0,
        "comparative": 0,
        "tokens": [
            "the",
            "new",
            "service",
            "works",
            "amazingly",
            "well"
        ],
        "words": [],
        "positive": [],
        "negative": [],
        "original": "\"The new service works amazingly well.\""
    }
 
 The meaning of the returned properties is as follows:
 
 - **score**: The sentiment score corresponding to the sum of scores of the contributing words.
 - **comparative**: The ratio of the score versus the amount of words.
 - **tokens**: The words recognized in the given text.
 - **words**: The words contributing to the sentiment score.
 - **positive**: The words contributing to a positive score.
 - **negative**: The words contributing to a negative score.
 - **original**: The text which was analyzed.
 
You can also test this via the [interactive API documentation](/dashboard/apidocs/).
 
If you use the JavaScript SDK you can approach things like so
    
     Qwiery.apiKey = "my secret key";
     Qwiery.getSentiment("I am so grateful for all the presents, thank you!")
        .then(
            function(results){
                // your turn        
            }
        );
  
Other SDK's have a similar approach.
  
  
  
  