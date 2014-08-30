/** @jsx React.DOM */
var React = require('react/addons');
$ = jQuery = global.$  = require('jquery');
global.bootstrap = require('../../bower_components/bootstrap/dist/js/bootstrap')
var Backbone = require('backbone');
require('backbone.paginator');
var _ = require('lodash');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {collection: this.props.initialCollection}
  },
  sort: function(e) {
    var head = $(e.currentTarget);

    if(head.hasClass('sorting')) {
      this.state.collection.setSorting(head.data('field'), 1);
    } else {
      var order = -1
      if(this.state.collection.state.order == 1) {
        order = -1
      } else {
        order = 1
      }
      this.state.collection.setSorting(head.data('field'), order);
    }
    this.state.collection.fullCollection.sort();
    this.forceUpdate();
  },
  render: function () {
    var self = this;
    var cx = React.addons.classSet;
    var classes = cx({
      'table': true,
      'dataTable': true,
      'table-striped': this.props.striped,
      'table-bordered': this.props.bordered,
      'table-condensed': this.props.condensed,
      'table-hover': this.props.hover
    });
    var head = [];
    var rows = [];
    _.each(this.state.collection.tableFactory, function(column,columnName) {
      if(column.sortable) {
          var classes = 'sorting';
          if(column.field == self.state.collection.state.sortKey && self.state.collection.state.order == 1) {
            classes = 'sorting_asc';
          } else if (column.field == self.state.collection.state.sortKey){
            classes = 'sorting_desc';
          }

        head.push(
          React.DOM.th( {className:classes, onClick:self.sort, 'data-field':column.field}, columnName)
        )
      } else {
        head.push(
          React.DOM.th(null, columnName)
        )
      }

    });

    _.each(this.state.collection.models,function(model) {
       var columns = [];
       _.each(self.state.collection.tableFactory, function(column,columnName) {
         if(column.field == 'id') {
           columns.push(
             React.DOM.td(null, model.id)
           );
         }else if(column.display == 'string') {
            columns.push(
              React.DOM.td(null, model.get(column.field))
            );
         } else if (column.display == 'button') {
            var icon;
            if(column.icon) {
              icon = React.DOM.span( {className:"glyphicon "+column.icon})
            }
            columns.push(
              React.DOM.td(null, React.DOM.button( {className:'btn btn-sm '+column.classes + ' ' + column.action, 'data-id':model.id}, icon, " ", columnName))
            );
         }

       });
       rows.push(
         React.DOM.tr(null, columns)
       )
    });
    return (
      React.DOM.table( {className:classes},
        React.DOM.thead(null,
        head
        ),
        React.DOM.tbody(null,
          rows
        )
      )
    );
  }
});
