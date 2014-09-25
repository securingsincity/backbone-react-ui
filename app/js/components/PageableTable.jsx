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
  /**
   * Change page handler for collections
   * @param {collection} newCollection The updated collection upon changing pages
   */
  changePage: function(newCollection) {
    this.setState({collection: newCollection})
  },
  render: function () {
    var self = this;
    var maximumPages = this.props.maximumPages  ? this.props.maximumPages : 10;
    return(
      <div>
        <Table striped={this.props.striped} bordered={this.props.bordered} condensed={this.props.condensed} hover={this.props.hover} initialCollection={this.state.initialCollection} />
        <BackbonePagination initialCollection={this.state.initialCollection} onChangePage={this.changePage} maximumPages={maximumPages} />
     </div>)
  }
});
