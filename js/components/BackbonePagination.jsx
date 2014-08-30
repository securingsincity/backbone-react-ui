/** @jsx React.DOM */
var React = require('react/addons');
$ = jQuery = global.$  = require('jquery');
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
    return {
      collection: this.props.initialCollection,
      currentPage: this.props.currentPage,
      totalPages: this.props.totalPages
    }
  },
  nextPage: function() {
    this.state.collection.getNextPage();
    this.props.onChangePage(this.state.collection);
    this.forceUpdate();
  },
  previousPage: function() {
    this.state.collection.getPreviousPage();
    this.props.onChangePage(this.state.collection);
    this.forceUpdate();
  },
  changePage: function(e) {
    var pageNumber = $(e.currentTarget).data('page');
    this.state.collection.getPage(pageNumber);
    this.props.onChangePage(this.state.collection);
    this.forceUpdate();
  },
  renderNext: function() {
    if(this.state.currentPage < this.state.totalPages){
       return(React.DOM.li(null, React.DOM.a( {href:"#", onClick:this.nextPage}, "»")));
    } else {
      return(React.DOM.li( {className:"disabled"}, React.DOM.a( {href:"#"} , "»")));
    }
  },
  renderPages: function(){
    var pages = [];
    var starterPage = 1;
    if(this.state.currentPage >= 4) {
      starterPage = this.state.currentPage - 2;
    }

    if(this.props.maximumPages > this.state.totalPages) {
      for(page = 1; page <= this.state.totalPages; page++){
        if(page !== this.state.currentPage) {
          pages.push(React.DOM.li(null, React.DOM.a( {href:"#", onClick:this.changePage, 'data-page':page, className:""}, page)));
        } else {
          pages.push(React.DOM.li( {className:"active"}, React.DOM.a( {href:"#"}  , page)));
        }
      }
    } else {
      if(this.state.currentPage >= 4) {
        pages.push(React.DOM.li( {className:""}, React.DOM.a( {href:"#",  onClick:this.changePage, 'data-page':1}, 1)));
        pages.push(React.DOM.li( {className:"disabled"}, React.DOM.a( {href:"#"}  , "...")));
      }
      for(page = starterPage; page <= this.state.totalPages; ++page) {
        if((starterPage + this.props.maximumPages) < page) {
          pages.push(React.DOM.li( {className:"disabled"}, React.DOM.a( {href:"#"}  , "...")));
          pages.push(React.DOM.li( {className:""}, React.DOM.a( {href:"#",  onClick:this.changePage, 'data-page':this.state.totalPages}, this.state.totalPages)));
          break;
        } else if (page !== this.state.currentPage){
          pages.push(React.DOM.li(null, React.DOM.a( {href:"#", onClick:this.changePage, 'data-page':page, className:""}, page)));
        } else {
          pages.push(React.DOM.li( {className:"active"}, React.DOM.a( {href:"#"}  , page)));
        }
      }
    }
    return pages;

  },
  renderPrevious : function() {
    if(this.state.currentPage > 1){
      return(React.DOM.li(null, React.DOM.a( {href:"#", onClick:this.previousPage}, "«")));
    }else {
      return(React.DOM.li( {className:"disabled"}, React.DOM.a( {href:"#"} , "«")));
    }
  },

  render: function () {
    var self = this;
    var cx = React.addons.classSet;
    if(this.state.collection) {
      this.state.currentPage = this.state.collection.state.currentPage;
      this.state.totalPages = this.state.collection.state.totalPages;
    }
    var next = this.renderNext();
    var pages = this.renderPages();
    var previous = this.renderPrevious();
    return(
    React.DOM.ul( {className:"pagination"},
      previous,
      pages,
      next
    )
    )
  }
});
