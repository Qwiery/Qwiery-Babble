
## Babble



The information below applies to the Babble application and reflects to some extend the Qwiery platform. The Babble application is an HTML/JavaScript single-page app which makes use of the Qwiery platform. It demonstrates a whole lot of features and things you can do with Qwiery.

<a href="https://github.com/Qwiery/Qwiery-Babble" target="_blank" class="btn btn-primary">Downloaded from Github.</a>

### Intro


You can ask Qwiery anything you like but there are also specific commands which instruct Qwiery to handle a question in a particular way. Below is a summary of these commands. There are in general **multiple ways to get the same result** and Qwiery knows quite a bit about synonyms and equivalent formulations, so the list below is not exhaustive but rather some guidelines.

The user interface is **text and command based**. This means that all of the many types of information available are not accessed via a classsic set of buttons and widgets but only via text input. Whether you want to log in, manage user permissions or see a pie chart of Qwiery's emotional state, all of this goes via natural language or some keywords.

Qwiery has also **a server-side language**, the Qwiery Template Language or QTL, which defines how Qwiery thinks and handles requests. [More information about QTL can be found here.](http://www.qwiery.com/overview/qwiery-template-language/)

---
### Login and logout

Qwiery uses Twitter, Google or Facebook for authentication, you can pick one or all of them to login. Simply use the `login` command to get started:

> [`login`](/?q=login)

If you are already logged in this will show your existing account as well as the API key with which you access Qwiery:

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/Login.png" class="activeThumb"/>

To log out you can use `log out` or `logoff`:

> [`logout`](/?q=logout)


---

###  Sentiment analysis 
This identifies and categorizes opinions expressed in a piece of text, it can be triggered explicitly by means of the `sentiment` command:

> [sentiment: I feel awesome today](/?q=sentiment:%20I%20feel%20awesome%20today)

Qwiery performs sentiment analysis on any input and uses it internally but this command allows you to see the results of this analysis. The input can also be a URL:

> [sentiment: http://www.bbc.co.uk](/?q=sentiment:http://bbc.co.uk)

---

### English grammatics, dictionary and thesaurus
You can lookup words using the `define` or `lookup` command:

> [define: deipnosophist](/?q=define:%20deipnosophist)

Synonyms can be asked in a similar fashion:

> [synonyms: delight](/?q=synonyms:%20delight)

If you would like some inspiration, you can ask Qwiery to produce random (but real) English words:

> [random words](/?q=random%20words)

Part of speech (POS) analysis will return the grammatical structure of the given input:

> [pos: You can type anything here to analyze its grammatical structure.](/?q=pos:%20You%20can%20type%20anything%20here%20to%20analyze%20its%20grammatical%20structure.)

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/POS.png" class="activeThumb"/>

---

### Maths and conversions

Qwiery understands some maths and will try to resolve anything you throw at it. For example, using the `plot` command with a function definition will result in:

> [plot Gamma(x)](/?q=plot%20Gamma(x))

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/GammaPlot.png" class="activeThumb"/>

Note that there is (see below) another plot command `plot:` with a semi-column which uses a different type processing (one based on the R statistics package).

Standard calculations will return the result:

> [2.3*8/7.01/log(88/7)](/?q=2.3*8/7.01/log(88/7))

There are also various more intelligent mathematical operations possible like

> [10 inch to cm](/?q=10%20inch%20to%20cm)

> [1.7 liter to gallon](/?q=1.7%20liter%20to%20gallon)

---

### Entity creation

Entities (ideas, tasks, appointments...) can be added explicitly to Qwiery by means of the `add` command like so

> [`add:` apple cake](/?q=add:%20apple%20cake)

> [add task: pickup the kids tonight](/?q=add%20task:%20pickup%20the%20kids%20tonight)

Entities are automatically deduced from conversations and stored in the semantic network. They are used as knowledge and inference.

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/AddIdea.png" class="activeThumb"/>

---

### Notebooks<a name="notebooks"></a>

Newly created entities are stored in the active notebook and if you wish to change the current notebook you can do so via the `set:space:` command:

> [`set:space:` default](/?q=set:space:default)

> The workspace entitled 'default' is now your active space.

At any moment only one notebook is active. Note that you don't need to specify the full name of the notebook, only an identifying portion is sufficient. In the example above the full name is in fact 'Default workspace'.

To see the list of notebooks use

> [notebooks:](/?q=notebooks:) or [spaces:](/?q=spaces)


<img src="http://www.qwiery.com/wp-content/uploads/2016/07/Spaces.png" class="activeThumb"/>

Notebooks collect entities in the semantic network and can be seen as either a security boundary or a semantic boundary or both. Notebooks can be shared with other users and made public.

Use the `add:space:` command to add and activate a new notebook:

> [`add:space:` genetics](/?q=add:space:genetics)

---
 

### Inline help
the documentation of topic and commands can be obtained via the `help` command:

> [help:login](/?q=help:login)

---

### Search

you can tell Qwiery to search things explicitly by means of the `search` command:

> [search: Peking](/?q=search:peking)

If you rather use a specific service like Wolfram Alpha you can use

> [search: alpha: coffee](/?q=search:alpha:coffee)

Note that search results can be easily saved as semantic entities in your own personal graph by means of the plus-sign next to the search results.

To search your notebooks (aka graph) you can use

> [search: graph: j*](/?q=search:graph:j*)

Searching for images can go like this

> [images of manifold learning](/?q=images%20of%20manifold%20learning)

or using the `search:pics:` (you can also use `search:images:` or `search:pictures:`

> [search: pics: coffee grinder](/?q=search:pics:coffee%20grinder)

To search the news you can use similar constructs:

> [search:news: MacBook](/?q=search:news:macbook)

or simply something like

> [news about the new MacBook](/?q=news%20about%20the%20new%20macbook)

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/ImagesOf.png" class="activeThumb"/>

---

### Tags

tags are labels you can attach to entities which help to organize your info. Some tags are automatically created and you can see all your tags by means of the `get:tags:` command:

> [get: tags:](/?q=get:tags:) or simply [tags:](/?q=tags:)

You can add a tag by means of

> [add:tag: MyNewTag](/?q=add:tag:MyNewTag)


<img src="http://www.qwiery.com/wp-content/uploads/2016/07/DragDropTag.png" class="activeThumb"/>

At any time you can access a mosaic of your stuff via various commands, e.g. `ideas` will display something like the following

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/ShowMyStuff.png" class="activeThumb"/>

You click the elements in the mosaic and you will get an editor for the specific type (i.e. the editor depends on whether you display a person, an idea etc.):

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/IdeaReader.png" class="activeThumb"/>

Independently of the element being edited, you have some common elements:

- you can add the entity to your favorites by clicking on the star0cion
- delete it 
- edit it via the icon in the upper-right corner
- the "Related" section is droppable area where you can dragdrop other entities to create relations, drop image which will be uploaded and linked to the current entity and so on. To remove a related item you can simply click on the remove-icon which appears upon hovering over the links.

To delete a tag you can use

> [delete: tag: music](/?q=delete:tag:music) or [delete tag: music](/?q=delete%20tag:music)

Finally, if you want to see all concepts (aka entities) with a specific tag just enter

> [get:tag:music](/?q=get:tag:music)

The various commands related to tags examplify the general pattern, you can use similar command for tasks, appointments and so on:

- `get:` followed by a type will fetch data
- `delete:` followed by a type removes data
- `add:` followed by a type adds data

Updating things is possible after you have fetched a particular type. 

The `favorites' tag is a special tag which gets attached to an entity when you click on the star-icon (see above). If you use the `favorites` command you get a mosaic of your ideas, tasks and so on which you marked as favorite:

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/Favorites.png" class="activeThumb"/>

---

### Client-specific commands

The default web-client of Qwiery is a dynamic interface which can be manipulated with commands as well. Note that these commands have no meaning or effect if you use Qwiery in your own integrations, they are purely client-side JavaScript handlers.


> [show all](/?q=show%20all)


> [hide all](/?q=hide%20all)

> [clear](/?q=clear)

The individual components can be all shown or hidden in a similar fashion

> [show trail](/?q=show%20trail)

> [hide trail](/?q=hide%20trail)

You can provide feedback about Qwiery or the answers via the `feedback` command:

> [feedback](?q=feedback)

---

### Admin and management

If you have an admin role you can access various dashboards and use commands which alter the behavior of Qwiery.

> [admin: users](/?q=admin:users)

> [admin: usage](/?q=admin:usage)

---

### Send mail (aka workflows)

Workflows are a powerful concept in Qwiery. They capture a series of question and answers around a particular topic. You can notice that you are inside a workflow if Qwiery insists on returning an answer regarding something. For example, Qwiery can insist that you answer with yes-like (yes, OK, sure, duh...) or no-like (nope, nah, nada...) before moving on.

The 'send mail' is a workflow which captures the info necessary to send a mail:

> [send mail](/?q=send%20mail)

If a workflow is interrupted it can be saved or discarded. If you opt to save the flow it will appear as a task in your task list (which you can access using `tasks`) and Qwiery also reminds you of it now-and-then. 
This reminder mechanism is configurable and has a random component as well.

---

### History

Qwiery remembers what you said and uses various algorithms on your history. You can see your recent input via the trail component in the interface (if not visible use `show trail`) or the whole history via

> [history](/?q=history)

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/History.png" class="activeThumb"/>

This history can also be accessed via the badge number (the number left of the current input) or by clicking on your avatar. The history is part of a bigger set of user data which you see via the `profile` command.

---

### Profile

All of your data is accessible to you and can be altered or deleted. You own the data. To access everything Qwiery knows about you simply type `profile` or click on your avatar:

> [profile](/?q=profile)
 
<img src="http://www.qwiery.com/wp-content/uploads/2016/07/Profile.png" class="activeThumb"/>

---

### Ask an agent

Qwiery hosts multiple agents and by default you will be answered by the default bot. If you wish to ask e.g. the cooking bot `Chef` about vanilla crean you can do so using the Twitter-like tag:

> [@chef vanilla cream](/?q=@chef%20vanilla%20cream)
> _Chef's answer about vanilla ice cream or similar_

Chef's answers are based on the [Seasoned Advice](http://cooking.stackexchange.com) data. Qwiery uses various data sources and an offline copy of some [StackExchange](http://stackexchange.com) networks are accessible to Qwiery. 

If you ask @Einstein the physics agent about water evaporation you get an answer from the [physics stack](http://physics.stackexchange.com):

> [@Einstein Why can water evaportate?]()


---

### Website summary

you can ask Qwiery to fetch the summary of a website like so

> [summary: http://www.qwiery.com](/?q=summary:%20http://www.qwiery.com)

---

### Keywords and tagging

you can ask Qwiery about the most important keywords in a website

> [keywords: http://www.cnbc.com](/?q=keywords:%20http://www.cnbc.com)

---

### Rich data presentation

Various questions engender some data visualization like this one:

> [What is the GDP of India?](/?q=What%20is%20the%20GDP%20of%20India)

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/LineChart.png" class="activeThumb"/>

There is also a link to the R statistical package which makes it possible to plot given data or use R-functions. For example, the following plots the 100 random values taken from a Poisson distribution (lambda=3):

> [plot:rpois(100,3)](/?q=plot:rpois(100,3))

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/RPlot.png" class="activeThumb"/>

Video, images and sound are presented if possible. If you provide e.g. a YouTube URL it will be automatically tagged with the 'Video' and 'YouTube' tags and an entity will be created in your current notebook. 

> [https://www.youtube.com/watch?v=hAWyex1GKRU](/?q=https://www.youtube.com/watch?v=hAWyex1GKRU)

If you request a video entity you will see for instance the video embedded in Qwiery:

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/Video.png" class="activeThumb"/>



---

### Time, agenda and appointments

Qwiery tries hard to make sense of dates and time in your input. The standard question will be answered:

> [What date is today?](/?q=What%20date%20is%20today?)

>[Time](/?q=time)

Every user has an agenda which Qwiery uses to keep track of appointments and events:

> [Next Wednesday](/?q=Next%20Wednesday)

Appointments are automatically recorded within the accuracy given:

> [I need to go to Wimbledon next month.](/?q=I need to go to Wimbledon next month)

If you are more specific you will get this:

> [I need to go to Wimbledon next month on the 23rd.](/?q=I need to go to Wimbledon next month on the 23rd)

and so on. You agenda is, like all of your data, accessible via your profile or via the `agenda` command:

> [agenda](/?q=agenda)

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/Agenda.png" class="activeThumb"/>

---
### How does Qwiery feel (about you)?

Qwiery has an emotional module which affects the way it responds. The emotions are triggered by the aims it has (which are defined through a personality profile) and you can ask how it feels:

> [How do you feel?](/?q=How%20do%20you%20feel)

The aims shown in the second part are based on a predefined personality of the underlyind agent. The default agent (@qwiery or @default) has a Da Vinci personality which combines preferences for science and art topics. This means that topics like sports or entertainment have a negative effect on Qwiery's emotions while maths, science and art have a positive impact.


<img src="http://www.qwiery.com/wp-content/uploads/2016/07/Emotions.png" class="activeThumb"/>

---
### Feedback

You can provide feedback about Qwiery or the answers returned via the 'feedback' link in the bottom-right of each answer-box:

<img src="http://www.qwiery.com/wp-content/uploads/2016/07/Feedback.png" class="activeThumb"/>

You can also use the `feedback` command in the input-box:

> [feedback](?q=feedback)

---
### Terms and conditions

You can access the Terms and Conditions, EULA (End User License Agreemend) via

> [terms](?q=terms) or [help:eula](?q=help:eula)




