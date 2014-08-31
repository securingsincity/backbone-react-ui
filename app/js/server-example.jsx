/** @jsx React.DOM */
var React = require('react/addons');
var FilterablePageableTable = require('./components/FilterablePageableTable.jsx');
$ = jQuery = global.$  = require('jquery');
global.bootstrap = require('../bower_components/bootstrap/dist/js/bootstrap')
var Backbone = require('backbone');
Backbone.$ = $;
require('backbone.paginator');
var _ = require('lodash');



var testModel = Backbone.Model.extend({
  urlRoot: '/api/users'
});
var testCollection = Backbone.PageableCollection.extend({
  model : testModel,
  url:'/api/users',
  searchType: 'server',
  searchFields: [
    'first_name',
    'last_name'
  ],
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
  },
  queryParams: {
    q: "",
    fields: ""
  },
  parseRecords: function (resp) {
        return resp.data;
      },
  // Facebook's `paging` object is in the exact format
  // `Backbone.PageableCollection` accepts.
  parseLinks: function (resp, xhr) {
    return resp.pagination;
  },
  parseState: function (resp, queryParams, state, options) {
    if(resp.data === null){
      return false;
    }
    return {
      totalRecords: resp.pagination.totalRecords,
      current: resp.pagination.currentPage,
      totalPages: resp.pagination.totalPages,
      order: resp.pagination.order,
      sortKey: resp.pagination.sort_by,
      q: resp.pagination.query,
      fields: resp.pagination.fields
    };
  }
});
var coll = new testCollection([], {
   mode: "server",
   state: {
     pageSize : 3
  },

});
coll.fetch({
  success: function() {
      console.log(coll);
      coll.getFirstPage();
      React.renderComponent(<FilterablePageableTable striped hover condensed initialCollection={coll} maximumPages={5} />, document.getElementById("container"));

  }
});
