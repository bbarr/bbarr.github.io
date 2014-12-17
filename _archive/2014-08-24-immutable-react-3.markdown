---
layout: default
title: Building a functional-style web app with immutable data and React - Part 3
tags: javascript FP
category: code
---

This post makes use of react-pointer.js, which was introduced in [this post](/code/2014/10/13/pointer-js.html)

Let's start with a container for our application:

```html
<div id="todos"></div>
```

Now, we need an Application component:

```javascript
var App = React.createClass({

  render: function() {
    return (
      <div id="app-component">
        <h1>Todos!</h1>
      </div>
    )
  }
})
```

Great, now we can bootstrap things:

```javascript

// our root pointer
var $root = Pointer({ todos: [] }, render)

function render() {
  React.renderComponent(App({ $root: util.cursor }), document.getElementById('todos'))
}

