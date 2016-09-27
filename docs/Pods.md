### Pods
Pods are container of information of a specific type.

Qwiery returns an answer in form of a pod collection (together with some metadata). The default web client handles the rendering of pods but you can use the pod contents in any way you like.

**Example** 

A typical plain-text answer is wrapped in a `SimpleContent` pod:

    {
        DataType: "SimpleContent",
        Content: "Some plain text"        
    }

Qwiery always returns an answer as part of a pod-collection:

    Answer:[
        {
            DataType: "SimpleContent",
            Content: "Some plain text"        
        }
    ]
    
This answer array (of pods) sits in the session object returned when using the `Qwiery.ask` method:

    {
        Input: ...
        Output:{
            ...
            Answer:[
                    {
                        DataType: "SimpleContent",
                        Content: "Some plain text"        
                    }
                ]            
        }
    }


