
;(function() {
  
  var Widget = Backbone.Model.extend({
    
    template: function(tmpl) {

    },

    scripts: function() {

    },

    styles: function() {
      
    }
  })

  vol.widget = function(selector, fn) {
    var widget = new Widget
    fn.call(widget, widget)
    return widget
  }
})()
