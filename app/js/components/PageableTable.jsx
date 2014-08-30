/** @jsx React.DOM */
var React = require('react/addons');
$ = jQuery = global.$  = require('jquery');
var Table = require('./Table.jsx');
var BackbonePagination = require('./BackbonePagination.jsx');
global.bootstrap = require('../../bower_components/bootstrap/dist/js/bootstrap')
var Backbone = require('backbone');
require('backbone.paginator');
var _ = require('lodash');

/*
Options:

initialCollection : a backbone pageable collection
maximumPages : the number of pages to display before using an ellipsis, defaults to 10

*/

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {initialCollection: this.props.initialCollection}
  },
  changePage: function(newCollection) {
    this.setState({collection: newCollection})
  },
  render: function () {
    var self = this;
    var cx = React.addons.classSet;
    var classes = cx({
      'table-striped': this.props.striped,
      'table-bordered': this.props.bordered,
      'table-condensed': this.props.condensed,
      'table-hover': this.props.hover
    });

    var maximumPages = this.props.maximumPages  ? this.props.maximumPages : 10;
    return(
      <div>
        <Table striped hover initialCollection={this.state.initialCollection} />
        <BackbonePagination initialCollection={this.state.initialCollection} onChangePage={this.changePage} maximumPages={maximumPages} />
     </div>)
  }
});
