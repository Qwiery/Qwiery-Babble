### Keyword analysis

Keywords extraction describes the main topics expressed in a document. Extracting keywords is one of the most important tasks when working with text. Readers benefit from keywords because they can judge more quickly whether the text is worth reading. Website creators benefit from keywords because they can group similar content by its topics. Algorithm programmers benefit from keywords because they reduce the dimensionality of text to the most important features.


#### Languages supported

Keyword detection will work with English, Spanish and German. 

#### Example

The POST endpoint for sentiment analysis is

    http://api.qwiery.com/language/keyword

and can be accessed for example using the terminal like so

    curl --header 'apiKey:Anonymous' --data 'text="t occurred at the Boudouaou station when a train headed for the province of Setif, 300 km (186 miles) east of Algiers, caught up with a train ahead that was headed for the town of Thenia, according to the National Rail Transport Company."' -X POST 'http://api.qwiery.com/language/keywords/'

 > Note that accessing these endpoints via your browser will not work. The GET method used by a browser is not available for all endpoints.

which will return something like

    {
        "original": "\"t occurred at the Boudouaou station when a train headed for the province of Setif....",
        "keywords": [
            [
                {
                    "term": "train",
                    "probability": "9%"
                },
                {
                    "term": "headed",
                    "probability": "9%"
                },
                {
                    "term": "transport",
                    "probability": "5%"
                },
                {
                    "term": "town",
                    "probability": "5%"
                },
                {
                    "term": "thenia",
                    "probability": "5%"
                }
            ]
        ]
    }
    

 

