---
layout: default
title: Building a functional-style web app with immutable data and React - Part 2
tags: javascript FP
category: code
---

Well that was fast. 

As you can see by the slight change in this series' title, I have decided to hit the reset button on my implementation of immutable data.
After being initially quite excited about using Immutable.js, I have found that the added complexity of using a library (any libary) to implement 
immutable data types in Javascript is just more than my brain wants to handle right now. Which means, if I want to keep my state unmutated, it will 
have to be done using just the native Javascript objects and arrays.

Luckely for us, React provides a very handy addon, that works like this:

```javascript
var x = { a: { b: [ 1, 2 ] } }
var y = React.addons.update(x, { a: { b: { $push: [ 3 ] } } }) 
y.a.b //=> [ 1, 2, 3 ]
x.a.b //=> [ 1, 2 ]
```

So with just a tiny amount of utility code, I can create cursors with much of the same benefits I could get from Immutable:

```javascript
// a very naive cursor implementation using React.addons.update

// 2 utilities that should exist.. here are examples of how they should work
// pick({ a: { b: [ 1 ] } }, [ 'a', 'b', 0 ]) //=> 1
// nest([ 'a', 'b', 'c' ], { d: { e: 1 } }) //=> { a: { b: { c: { d: { e: 1 } } } } }

function cursor(data, cb) {

  var sub = function(path) {
    return {
      deref: pick.bind(null, data, path),
      refine: function(newPath) {
        return sub(path.concat(newPath))
      },
      update: function(delta) {
        var deltaForRoot = nest(path, delta)
        cb(React.addons.update(data, deltaForRoot))
      }
    }
  }

  return sub([])
}

```

So now our application render function looks like this:

```javascript
var React = require('react/addons')
var util = require('./util')

var App = require('./components/app')

function render(state) {
  React.renderComponent(
    App({ $root: util.cursor(state, render) }),
    document.getElementById('app')
  )
}

// set initial state
render({
  campaign: {},
  shared: {
    page: 'home',
    session: {},
    flash: []
  }
})
```

And our App component looks like this:

```javascript
/** @jsx React.DOM */

var React = require('react')

var App = React.createClass({

  render: function() {

    var props = this.props

    setTimeout(function() { 
      props.$root.update({ foo: { $set: 'bar' } })
    }, 1000)

    return (
      <div>
        an app!
        <h1>{ props.$root.deref().foo }</h1>
      </div>
    )
  }
})

module.exports = App
```

Ok, next up are actual components.

