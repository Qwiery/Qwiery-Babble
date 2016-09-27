![Qwiery](http://www.qwiery.com/QwieryLogoSmall.png)

#### About

The Babble application is an HTML/JavaScript single-page chat-like app which makes use of [the Qwiery platform](http://www.qwiery.com). It demonstrates a whole lot of features and things you can do with Qwiery.
 
Qwiery is an assembly of services related to natural language understanding and question-answering. The services can be used independently (the [sentiment analysis service](http://dashboard.qwiery.com/Dashboard/sentiment) for instance) or can be combined into an intelligents pipeline. The Babble app in this code repository uses such a pipeline and is just an example of how things can be assembled. Qwiery can be used in many ways and there are also many ways in which the platform can be augmented with modules and business insights.
 
This Babble chatty app is not a full-fledged chatbot though it could be pushed to handle quite a bit. See [the language manual](https://github.com/Qwiery/Qwiery-Babble/blob/master/docs/LanguageManual.md) for example to see the many ways you can interact. Some of the unique features of Babble are:

- personalization; Qwiery remembers what you said and builds up a semantic network of thoughts around your exchanges
- psychological profiling: Qwiery uses MBTI-profiling to tune its output
- workflows and state-machines: Qwiery instantiates on the spot state-machines to handle question/answer topic which belong together
- emotional state: Qwiery has emotions and react in different ways to different topics. By default the backend favors topics like science, music and art. It's called a da-vinci type of personality.

and some more modules which are still in beta. Not all services of Qwiery are yet available but have been put inline in this Babble backend.

![Dashboard of favorites](http://www.qwiery.com/wp-content/uploads/2016/07/Favorites.png)


---

#### Setup

If you run 

    npm install
    npm start

this will install the necessary modules, transpile the React components, do some Gulp work and launch your browser.
This is equivalent to 

    npm install
    gulp
    node Server/server

and opening the page [http://localhost:4789](http://localhost:4789).

The http-server serves a single HTML-page and some documentation. All interaction happens via ajax between the Qwiery API-service and the HTML page. The Qwiery endpoint is at [http://api.qwiery.com](http://api.qwiery.com). You can [register and fetch an API-key at qwiery.com/login](http://qwiery.com/login). The chat interface will work without a login but it will be more constrained and your personalization will be mixed with whoever else is using Qwiery anonymously. In addition, the Anonymous fallback will likely be switched off after the beta-period.


---

#### Usage 

If you wish to login and use your own account to chat with Qwiery, just use

    login

in the input and you will be presented with an option to login via Facebook, Google or Twitter OAuth.

To log off simply use

    logout

and the interface will switch back to Anonymous. There are tons of commands and things you can do and there is [a fairly complete and comprehensive overview online](http://www.qwiery.com/overview/language-manual/). The same manual is also availe by means of the command

    help: how




---

#### Documentation

You can find various types of info here:
  
  - [comprehensive documentation](http://dashboard.qwiery.com/Dashboard/documentation)
  - [a Swagger specification](http://api.qwiery.com/swagger.json)
  - [interactive API docs](http://dashboard.qwiery.com/dashboard/apidocs/)
  - [tutorial and integrations](http://www.qwiery.com/integration/)
 
 
![Qwiery Integrations](https://cloud.githubusercontent.com/assets/2377906/18861505/0f66ec5a-8486-11e6-98e1-e966753ea097.png)

---

#### Support

You can get in touch via

- [Twitter](http://twitter.com/qwiery)
- [info@qwiery.com](mailto:info@qwiery.com)
- [Github issues](http://github.com/qwiery)