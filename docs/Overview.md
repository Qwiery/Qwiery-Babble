### Overview

Qwiery is a collection of services related to natural language understanding, artificial intelligence, machine learning and intelligent agents. The services are standard REST services and are secured with an API key which you obtain when you register. You can use these REST services from any programming language and we provide for some languages predefined wrapper which make it easy to develop applications.

#### How to use the API key?

The API key should be added to the request header when you send a request. For example, in JavaScript a typical request would look like the following:

    getEntity: function(id) {
        return $.ajax({
            url: Qwiery.serviceURL + '/graph/entity/get/' + id,
            contentType: "application/json;charset=utf-8",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("ApiKey", "your API key here");
            },
            xhrFields: {
                withCredentials: true
            },
            type: "GET",
            timeout: 5000
        });
    }
#### Interactive API documentation

The API documentation can be found [here](/dashboard/apidocs/) and is fully interactive. You can test the services with the Anonymous account or use your own personal API key to fetch your own data and customized responses.

<a class="btn btn-primary" href="/dashboard/apidocs/" target="_blank">Interactive API documentation</a>

#### Swagger

The [swagger yml is available](http://dashboard.qwiery.com/swagger.json) and describes in detail the REST API. You can use it to mock the services, to generate a stub for your language and much more. 
See the [Swagger](http://swagger.io/) documentation and the Swagger output here for more information.

<a class="btn btn-primary" href="/api-docs.json" target="_blank">Swagger YML</a>

#### What are the service limitations? 

Very few. Currently the services are in beta and free to use. Some services are protected with special priviledges and some are protected with anti-spam algorithms (e.g. bots will not answer vulgar language).

#### What about privacy?

Some services infer things about you (e.g. your psychological profile), some services gather data from the input. Every user owns 

- a semantic network which grows with the input provided. This network is a web of entities (tasks, thoughts, appointments...) and helps to answer questions in a more personalized fashion.
- a collection of preferences. If you tell Qwiery you like 'pizza' then 'pizza' will be remembered as one of your preferences.
- a collection of personality traits which are inferred from the input. The traits collectively define your psychological profile.

All of this data can be managed, altered or deleted. You own this data. It's collected solely for the purpose of improving the services.


