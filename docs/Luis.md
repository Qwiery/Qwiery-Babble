### Language understanding service


The language understanding service implements the intent/utterance paradigm and is capable of detecting intents based on parametrized definitions. For a general understanding of the paradigm see for example the paper ["Artificial conversations for customer service chatter bots: Architecture, algorithms, and evaluation metrics"](http://www.sciencedirect.com/science/article/pii/S0957417415003097) by Chakrabarti and Luger.

Let's take a simple example to highlight the idea. The following question

    I need to know the current temperature.

corresponds to the intention to look up the current weather. The question is called an utterance and the intent is simply 'weather' or 'weather lookup' or similar.
There are however many ways to ask the same question:

    I wish to know the humidity.
    What is the current temperature?
    
and so on. So, in order to embrace as many alternatives as possible one parametrizes the utterances

    I $parameter_verb to know the temperature.

which instructs to match input with the placeholder being a verb. Various data types are recognized by Qwiery; dates, times, verbs, nouns and more. In addition, Qwiery is capable of detecting semantic affinity based on word embeddings. So, the word 'temperature' will also match 'weather', 'humidity' and so on.

The language understanding service should be used to capture intents together with intent-specific parameters. For example, if you want to capture intents related to to the amount of products sold in a given month an utterance could be

    What is the volume of $P_noun in $M_month?
    
with an intent

    {
        intent: "volume"
        month: $M,
        product: $P
    }

and Qwiery will return to you the intent with the parameters given by the input. The defined intent can also have default if the deduced intent could not catch a parameter:


    {
            intent: "volume"
            month: $M:March,
            product: $P:shoes
    }
    
How you use the returned from here on is up to you, the language understanding service only extracts intents with the required parameters.


### Wizard


The wizard guides you through the creation of a language understanding service. The result of this is a JSON descriptor and you are free to post such descriptors directly via the Qwiery API. The wizard is only a convenient way to build up a descriptor but the JSON approach offers more flexibility.

The wizard consists of four simple steps:

- give a name to your new service (no special characters allowed or spaces)
- define the intents; these are the names or outputs returned by the service if a successful match was found
- define the utterances; what utterance leads to an intent
- commit, validate the new service

The new service is immediately available after it's been created. Your personal dashboard allows you to manager your services and also gives you usage statistics. 

#### Step 1

- give a name to your service
- optional: a description of the service

![Step 1](http://www.qwiery.com/wp-content/uploads/2016/09/LuisStep1.png)

#### Step 2

This intermediate interface allows you to start adding intents. In a future version this will also give you the option to import data from CSV or JSON.

![Step 2](http://www.qwiery.com/wp-content/uploads/2016/09/LuisStep2.png)

Upon clicking the "add a new intent" button you need to define:

- the name or output of the intent; this should define what you will do once the intent has been returned by Qwiery. The name should be unique within a single service but can the same across multiple services.
- an utterance for this intent. You can add additional or alter utterances in the next wizard step. This facility is there to make the creation of a simple utterance-intent pair as simple as possible.
- parameters are optional and depend on how you wish to use the intent in your application. For example, if you wish to lookup the weather in a particular location you will need the location parameter extracted from the utterance.  

![Step 3](http://www.qwiery.com/wp-content/uploads/2016/09/LuisStep3.png)

The parameter definition consists of:

- the name of the parameter should correspond to the parameter you (optionally) have in your utterances.
- the default value is used if Qwiery is unable to find a value for the parameter
- the type is a restriction on the matching process, it means that in addition Qwiery will ensure that the value found is of the specified type (date, string, verb etc.)


![Step 4](http://www.qwiery.com/wp-content/uploads/2016/09/LuisStep4.png)

#### Step 3

This step allows you to add more utterance-intent pairs or to alter existing one

![Step 5](http://www.qwiery.com/wp-content/uploads/2016/09/LuisStep5.png)

![Step 6](http://www.qwiery.com/wp-content/uploads/2016/09/LuisStep6.png)

#### Step 4

In this step you get an overview of the new service before submitting it.

![Step 7](http://www.qwiery.com/wp-content/uploads/2016/09/LuisStep7.png)

Qwiery will validate the given service descriptor and return either a list of issues to fix or the Id and URL of the new service. An example of how to use the service with JavaScript is shown but any other language could be used as well. 

![Step 8](http://www.qwiery.com/wp-content/uploads/2016/09/LuisStep8.png)