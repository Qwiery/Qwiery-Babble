### Language detection

Qwiery language detection provides a robust way of detecting the language of any text, HTML or web-based content. With language detection, you can easily categorize or filter any content based on the language it was written in.

#### Supported languages

Supported languages are: albanian, arabic, azeri, bengali, bulgarian, cebuano, croatian, czech, danish, dutch, english, estonian, farsi, finnish, french, german, hausa, hawaiian, hindi, hungarian, icelandic, indonesian, italian, kazakh, kyrgyz, latin, latvian, lithuanian, macedonian, mongolian, nepali, norwegian, pashto, pidgin, polish, portuguese, romanian, russian, serbian, slovak, slovene, somali, spanish, swahili, swedish, tagalog, turkish, ukrainian, urdu, uzbek, vietnamese and welsh.

#### Example

The POST endpoint for sentiment analysis is

    http://api.qwiery.com/language/detect

and can be accessed for example using the terminal like so

    curl --header 'apiKey:Anonymous' --data 'text="Praxeanae hic quoque superseminatae, dormientibus multis in simplicitate doctrinae."' -X POST 'http://api.qwiery.com/language/detect/'

 > Note that accessing these endpoints via your browser will not work. The GET method used by a browser is not available for all endpoints.

which will return something like

    {
        "original": "\"Praxeanae hic quoque superseminatae, dormientibus multis in simplicitate doctrinae.\"",
        "languages": [
            {
                "language": "latin",
                "probability": "37%"
            },
            {
                "language": "spanish",
                "probability": "20%"
            },
            {
                "language": "italian",
                "probability": "19%"
            }
        ]
    }
    
The returned probabilities are sorted from most likely to least likely. Unless you have mix of language the first result is the 'correct' one.
 