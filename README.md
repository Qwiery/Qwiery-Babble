![Qwiery](http://www.qwiery.com/QwieryLogoSmall.png)

A framework for [artificial narrow intelligence (ANI)](https://en.wikipedia.org/wiki/Weak_AI) through language understanding, semantic networks and more. Qwiery is an AI framework written with simplicity and extensibility in mind. It’s a service which can be

- integrated into web, mobile and desktop applications
- connected to external data sources and services to resolve questions
- extended with custom answers, custom processing and modules
- easily deployed. No big dependencies.

The Qwiery Template Language (QTL) are plain JSON files processing input and performing diverse tasks; personalization lookups, triggers state-machines, stores acquired knowledge into entity graphs and more. QTL generates knowledge in a semantic network and this network generates answers. The ‘thinking’ is a modular and pluggable pipeline which can be extended without a steep learning curve, knowledge of natural language processing or machine learning.

The framework does not use big data, advanced machine learning or large scale infrastructure, nor does it depend on external services. The framework is deliberately simple to invite experimentation. It’s written in JavaScript/NodeJS and comes with a default HTML client based (mainly) on ReactJS.

Qwiery is a lightweight, open source version of a much larger (enterprise-level) effort developed over a span of ten years. Qwiery contains most of the ideas of the larger sibling  but isn’t written with scalability and security in mind. The enterprise version is written in C# with a proprietary NoSQL backend together with Python machine-learning extensions.

You can find more information, tutorials and more on [the official Qwiery website](http://www.qwiery.com).

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