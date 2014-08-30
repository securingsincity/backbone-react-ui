#Backbone-React-ui


[React](http://facebook.github.io/react/) components for use with [Backbone](http://backbonejs.org/), [Bootstrap](http://getbootstrap.com) and [Backbone.Paginator](https://github.com/backbone-paginator/backbone.paginator)

This project is based lightly on [React-bootstrap](https://github.com/react-bootstrap/react-bootstrap) but is focused on incorporating backbone to create a viewmodel system
##Components:
* Paginator  (Based on a Backbone Collection or a Backbone Paginator Collection)
* Table (Based on a Backbone Collection or a Backbone Paginator Collection)
* PageableTable  (Based on a Backbone Collection or a Backbone Paginator Collection)



##Table

At its simplest this is a bootstrap table driven by a backbone collection.

###To use :

* Create a new backbone pageable collection with a table factory object :

```javascript

var testModel = Backbone.Model.extend();
var testCollection = Backbone.Collection.extend({
  model : testModel,
  tableFactory : {
    'ID': {
      field: 'id',
      display: 'string',
      sortable: true
    },
    'First Name' : {
      field:'first_name',
      display: 'string',
      sortable: true
    },
    'Last Name' : {
      field: 'last_name',
      display: 'string',
      sortable: true
    },
    'Edit' : {
      action: 'edit',
      display: 'button',
      classes: 'btn-success'
    },
    'Remove' : {
      action: 'delete',
      display: 'button',
      classes: 'btn-warning',
      icon: 'glyphicon-remove'
    },
  }
});
var coll = new testCollection([], {
   mode: "client",
   comparator: function (model) {
     return model.get("last_name");
   },

});

```

The table factory object is made up of a field, how it should be displayed (for now a string or a button), an action, additional classes and an icon

This builds out the columns of that table

####Notes :
* The sortable functionality is only available to a backbone pageable collection for now
* This is based on bootstrap's use of glyphicons and button functionality
* Sorting should work with both server side and client side pageable collections

To instantiate the table

```javascript
React.renderComponent(<Table striped hover condensed initialCollection={coll} />, document.getElementById("container"));
```

###PageableTable

This combines the paginator and the table functionality.

The only difference is that you would include a Backbone.PageableCollection this would allow the system to know the max number of pages and your current page.

The instantiation would be the same except with this time you could include the `maximumPages` if you have many pages of data
```javascript
React.renderComponent(<PageableTable striped hover condensed initialCollection={coll} maximumPages={5} />, document.getElementById("container"));
```
