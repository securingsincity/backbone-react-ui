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
    var self = this;
    if(head.hasClass('sorting')) {
      this.state.collection.setSorting(head.data('field'), 1);
    } else {
      var order = 1
      if(this.state.collection.state.order == 1) {
        order = -1
      }

      this.state.collection.setSorting(head.data('field'), order);
    }
    if(this.state.collection.mode == 'client'){
      this.state.collection.fullCollection.sort()
    } else {
      this.state.collection.fetch().done(function(){
          self.forceUpdate();
      });
    }
    this.forceUpdate();
  },
  render: function () {
    var self = this;
    if(!this.state.collection) return false;
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
            classes = 'sorting_desc';
          } else if (column.field == self.state.collection.state.sortKey){
            classes = 'sorting_asc';
          }

        head.push(
         <th className={classes} onClick={self.sort} data-field={column.field}> {columnName}</th>
       );
      } else {
        head.push(
          <th>{columnName}</th>
        )
      }

    });

    _.each(this.state.collection.models,function(model) {
       var columns = [];
       _.each(self.state.collection.tableFactory, function(column,columnName) {
         if(column.field == 'id') {
           columns.push(
            <td>{model.id}</td>
           );
         } else if(column.display == 'string') {
            columns.push(
              <td>{ model.get(column.field) }</td>
            );
         } else if (column.display == 'button') {
            var icon;
            if(column.icon) {
              icon = <span className={"glyphicon "+column.icon}/>
            }
            columns.push(
              <td><button className={'btn btn-sm '+column.classes + ' ' + column.action} data-id={model.id}>{icon} {columnName}</button></td>
            );
         }

       });
       rows.push(
         <tr>{columns}</tr>
       )
    });
    return (
      <table className={classes}>
        <thead>
          {head}
        </thead>
        <tbody>
        {rows}
        </tbody>
      </table>

    );
  }
});
