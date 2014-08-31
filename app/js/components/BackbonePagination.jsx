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
    var self = this;
    if(this.state.collection.mode == 'client'){
      this.state.collection.getNextPage();
      this.props.onChangePage(this.state.collection);
      this.forceUpdate();
    } else {
      this.state.collection.getNextPage().done(function () {
        self.props.onChangePage(self.state.collection);
      });
    }
  },
  previousPage: function() {
    var self = this;
    if(this.state.collection.mode == 'client'){
      this.state.collection.getPreviousPage();
      this.props.onChangePage(this.state.collection);
      this.forceUpdate();
    } else {
      this.state.collection.getPreviousPage().done(function () {
        self.props.onChangePage(self.state.collection);
      });
    }
  },
  changePage: function(e) {
    var pageNumber = $(e.currentTarget).data('page');

    var self = this;
    if(this.state.collection.mode == 'client'){
      this.state.collection.getPage(pageNumber);
      this.props.onChangePage(this.state.collection);
      this.forceUpdate();
    } else {
      this.state.collection.getPage(pageNumber).done(function () {
        self.props.onChangePage(self.state.collection);
      });
    }
  },
  renderNext: function() {
    if(this.state.currentPage < this.state.totalPages){
       return (<li className=""><a href="#" onClick={this.nextPage}>&raquo;</a></li>)
    } else {
      return (<li className="disabled"><a href="#">&raquo;</a></li>)
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
          pages.push(<li><a href="#" onClick={this.changePage} data-page={page} className="">{page}</a></li>)
        } else {
          pages.push(<li className="active"><a href="#" >{page}</a></li>)

        }
      }
    } else {
      if(this.state.currentPage >= 4) {
        pages.push(<li><a href="#" onClick={this.changePage} data-page={1} className="">{1}</a></li>)
        pages.push(<li className="disabled"><a href="#">&hellip;</a></li>)

      }
      for(page = starterPage; page <= this.state.totalPages; ++page) {
        if((starterPage + this.props.maximumPages) < page) {
          pages.push(<li className="disabled"><a href="#">&hellip;</a></li>)
          pages.push(<li><a href="#" onClick={this.changePage} data-page={this.state.totalPages} className="">{this.state.totalPages}</a></li>)
          break;
        } else if (page !== this.state.currentPage){
          pages.push(<li><a href="#" onClick={this.changePage} data-page={page} className="">{page}</a></li>)
        } else {
          pages.push(<li className="active"><a href="#" >{page}</a></li>)

        }
      }
    }
    return pages;

  },
  renderPrevious : function() {
    if(this.state.currentPage > 1){
      return (<li className=""><a href="#" onClick={this.previousPage}>&laquo;</a></li>)

    }else {
      return (<li className="disabled"><a href="#" >&laquo;</a></li>)
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
    <ul className="pagination">
      {previous}
      {pages}
      {next}
    </ul>)
  }
});
