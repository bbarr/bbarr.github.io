
var vol = {}


vol.hub = _.extend({}, Backbone.Event)


rivets.adapters[':'] = {
  subscribe: function(obj, keypath, callback) {
    obj.on('change:' + keypath, callback)
  },
  unsubscribe: function(obj, keypath, callback) {
    obj.off('change:' + keypath, callback)
  },
  read: function(obj, keypath) {
    return obj.get(keypath)
  },
  publish: function(obj, keypath, value) {
    obj.set(keypath, value)
  }
}

rivets.formatters.last = function(arr) {
  return _.last(arr)
}

rivets.formatters.models = function(coll) {
  return coll.models
}

rivets.formatters.get = function(model, key) {
  return model.get(key)
}

rivets.formatters.invert = function(a) {
  return !a
}

rivets.formatters.ternary = function(cond, a, b) {
  return cond ? a : b
}

rivets.formatters.eql = function(a, b) {
  return a == b
}

rivets.formatters.confirm = function(fn) {
  var words = [].slice.call(arguments, 1)
  return function() {
    var args = arguments
    var self = this
    var answer = confirm(words.join(' '))
    if (answer) fn.apply(self, arguments)
  }
}

rivets.formatters.count = function(arr) {
  return (arr) ? (arr.length || 0) : 0
}

rivets.formatters.default = function(a, b) {
  return a || b
}

rivets.formatters.preventDefault = function(fn) {
  return function(e) {
    e.preventDefault()
    fn.apply(this, arguments)
  }
}

rivets.configure({
  handler: function(target, event, binding) {
    this.call(binding.model, event, target, binding)
  }
})

rivets.binders['widget-*'] = {

  block: true,

  bind: function(el) {
    if (this.marker) return

    this.marker = document.createComment('rivets: widget')
    
    var attr = [ this.view.config.prefix, this.type ].join('-').replace('--', '-')
    el.removeAttribute(attr)

    el.parentNode.insertBefore(this.marker, el)
    el.parentNode.removeChild(el)

    el.setAttribute('rv-show', this.args[0] + ':visible')

    this.widget = vol.widgets[this.args[0]](el)

    this.widget.on('change:enabled', this.binder.routine.bind(this, el))
  },

  unbind: function(el) {
    if (this.widget && this.widget.view) {
      this.widget.view.unbind()
      this.widget.destroy()
    }
  },

  routine: function(el, val) {

    if (this.widget.get('enabled')) {
      var frag = this.widget.get('fragment')
      el.innerHTML = ''
      el.appendChild(frag.cloneNode(true))

      var models = _.extend({}, this.view.models)
      models[this.args[0]] = this.widget
      var options = {
        binders: this.view.binders,
        formatters: this.view.formatters,
        adapters: this.view.adapters,
        config: this.view.config
      }

      this.widget.view = rivets.bind(el, models, options)
      this.marker.parentNode.insertBefore(el, this.marker.nextSibling)
    } else {
      this.binder.unbind(el)
    }
  }
}



;(function() {

  function argsAsArray(args) {
    return _.flatten(_.toArray(args))
  }
 
  var Widget = Backbone.Model.extend({

    initialize: function() {

      // when we get html, create a fragment
      this.on('change:html', function() {
        var child
        var frag = document.createDocumentFragment()
        var tmp = document.createElement('body')
        tmp.innerHTML = this.get('html')
        while (child = tmp.firstChild) frag.appendChild(child)
        this.set('fragment', frag)
      }, this)

      // when we get a fragment, consider the widget enabled
      this.on('change:fragment', function() {
        this.set('enabled', this.get('fragment'))
      }, this)

      this.on('change:enabled', function() {
        this.set('visible', this.get('enabled'))
      }, this)

      // try to get bootstrapped HTML
      if (this.get('el').childNodes.length) {
        this.set('html', this.get('el').innerHTML)
      }

      this.configurer.call(this, this)
    },

    html: function(url) {
      var self = this
      $.ajax({
        type: 'GET',
        accept: 'text/html',
        url: url,
        success: function(html) {
          self.set('html', html)
        }
      })
      return this
    },

    css: function() {
      var urls = argsAsArray(arguments)
      var head = document.getElementsByTagName('head')[0]
      urls.forEach(function(url) {
        var link = document.createElement('link')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', url)
        head.appendChild(link)
      })
      return this
    },

    js: function() {
      var urls = argsAsArray(arguments)
      var head = document.getElementsByTagName('head')[0]
      urls.forEach(function(url) {
        var script = document.createElement('script')
        script.setAttribute('src', url)
        head.appendChild(script)
      })
      return this
    },

    // todo
    destroy: function() {
      return this
    }
  })

  vol.widgets = {}
  vol.widget = function(name, fn) {
    
    var Extended = Widget.extend({
      name: name,
      configurer: fn
    })

    return vol.widgets[name] = function(el) {
      return window[name] = new Extended({ el: el })
    }
  }

})()
