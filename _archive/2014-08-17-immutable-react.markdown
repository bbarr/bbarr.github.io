---
layout: default
title: Building a functional-style web app with Immutable and React - Part 1
tags: javascript FP
category: code
---

This will hopefully be the first of many articles about my experiences learning to 
write web applications in a functional-style. 

I will try to keep these terse and mostly void of explainations as my intended audience is other devs who are already sold on trying this 
novel approach to UI creation, and just need someone to walk ahead of them, blundering along and pre-digesting the inevitable mistakes.

For libraries, I will be using [React.js](http://facebook.github.io/react/index.html) and
[Immutable.js](https://github.com/facebook/immutable-js)\*, but there are plenty of other options 
out there for both immutability ([mori.js](http://swannodette.github.io/mori), [Ancient Oak](https://github.com/brainshave/ancient-oak))
and virtual DOM representations for cheap rendering ([mithril.js](http://lhorie.github.io/mithril/), [mercury](https://github.com/Raynos/mercury)). Also, [Om](https://github.com/swannodette/om)
provides immutability, courtesy of Clojurescript, and relies on React for rendering. It also espouses the architectural pattern I will be naively trying to implement.

As this is part 1, I think it makes sense to just set up the essential "flow" of data through our app. 

```javascript

var React = require('react')
var Immutable = require('immutable')

var App = require('./components/app')

function render(newAppState) {
  React.renderComponent(
    App({ cursors: { root: newAppState.cursor(render) } }),
    document.getElementById('app')
  )
}

// set initial state
render(Immutable.Map())
```

As you can see, our ```render``` function is responsible for kicking off the full rendering of our application. Note that the ```newAppState``` is not passed directly into the root component, 
but is passed as a cursor, which when updated, will simply call this master-of-all-things ```render``` function again with the updated application state. 

Now let's look at a bare-minimum App component that can prove that our "flow" is indeed working:

```javascript
/** @jsx React.DOM */

var React = require('react')

var App = React.createClass({

  render: function() {

    var props = this.props

    setTimeout(function() { 
      props.cursors.root.set('foo', 'bar') 
    }, 1000)

    return (
      <div>
        an app!
        <h1>{ props.cursors.root.get('foo') }</h1>
      </div>
    )
  }
})

module.exports = App

```

Reload. I see "an app!", then approximately 1 second later, "bar" shows up. And there was much rejoicing.

That's all for now. Next, I will start to flesh out some subcomponents using cursors to keep focused on relevant data.


---

<sub>
\* Wouldn't it have been nice if Immutable.js was named something less generic, so we could write about it without worrying if 
people will understand you mean the library versus the concept? Yes, that would have been nice. But it is a fantastic project, so let's just move on.
</sub>

