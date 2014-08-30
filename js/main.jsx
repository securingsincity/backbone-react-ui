/** @jsx React.DOM */
var React = require('react/addons');
var PageableTable = require('./components/PageableTable.jsx');
$ = jQuery = global.$  = require('jquery');
global.bootstrap = require('../bower_components/bootstrap/dist/js/bootstrap')
var Backbone = require('backbone');
require('backbone.paginator');
var _ = require('lodash');



var testModel = Backbone.Model.extend();
var testCollection = Backbone.PageableCollection.extend({
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
   state: {
     pageSize : 10
  },
  });
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
for(i = 0; i < 300; i++) {
  var a = new testModel({first_name: makeid(), last_name: makeid()});
  coll.add(a);
}
coll.getFirstPage();
React.renderComponent(PageableTable( {striped:true, hover:true, condensed:true, initialCollection:coll, maximumPages:5}), document.getElementById("container"));
