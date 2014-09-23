/** @jsx React.DOM */
var React = require('react/addons');
$ = jQuery = global.$  = require('jquery');
global.bootstrap = require('../../bower_components/bootstrap/dist/js/bootstrap')
var Backbone = require('backbone');
require('backbone.paginator');
var _ = require('lodash');

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {userInput: '',collection: this.props.initialCollection,searchResults:this.props.initialCollection}
  },
  search: function(e) {
    var self = this;


    if(e && e.target.value && e.target.value !== '') {
        var searchString = e.target.value;
        this.setState({userInput: e.target.value})
        if(this.state.collection.searchType == 'client') {
          if(this.state.collection.unfilteredCollection) this.state.collection.getFirstPage().fullCollection.reset(this.state.collection.unfilteredCollection.models);
          results = _.filter(this.state.collection.fullCollection.models,function(model) {
             var regexTest = new RegExp(searchString,"gi");
             var result = false;
              _.each(self.state.collection.searchFields, function(field) {
                if(regexTest.test(model.get(field))) {
                  result = true;
                }
             });
             return result;
          });
          var state = _.clone( this.state.collection.state);
          if(!this.state.collection.unfilteredCollection) {
            this.state.collection.unfilteredCollection = this.state.collection.fullCollection.clone();
          }

          this.state.collection
          .getFirstPage()
          .fullCollection
          .reset(results);
          this.props.onSearch(this.state.collection);
        } else {
          this.state.collection.state.currentPage = 1;
          this.state.collection.queryParams.q = searchString;
          this.state.collection.queryParams.fields = self.state.collection.searchFields.join();
          this.state.collection.fetch().done(function(){
            self.props.onSearch(self.state.collection);
          });

        }

    } else if(!e||( e.target.value && e.target.value == '')) {
      if(this.state.collection.searchType == 'client') {
        this.clearSearchClientSide()
      } else {
        this.clearSearchServerSide()
      }
    }

  },
  clearSearchClientSide: function() {
    if(this.state.collection.unfilteredCollection){
      this.state.collection.getFirstPage().fullCollection.reset(this.state.collection.unfilteredCollection.models);
      this.props.onSearch(this.state.collection);
    }
  },
  clearSearchServerSide: function() {
    var self = this;
    this.state.collection.state = this.state.collection._initState;
    this.state.collection.queryParams.q = '';
    this.state.collection.queryParams.fields = '';
    this.state.collection.fetch().done(function(){
      self.props.onSearch(self.state.collection);
    });
  },
  clearSearch:function() {
    this.setState({userInput: ''}, function() {
        // This code executes after the component is re-rendered
        this.refs.theInput.getDOMNode().focus();   // Boom! Focused!
        this.search();
      });
  },
  render: function () {
    var self = this;
    var cx = React.addons.classSet;
    var classes = cx({
      'form-group': true,
      'has-success': this.state.success,
      'has-error': this.state.error,
      'col-sm-4': true,
      'pull-right': true
    });

    return (
      <div className={classes}>
        <div className="col-sm-12">
          <label className="control-label col-sm-12">Search: </label>
        </div>
        <div className="col-sm-12">
          <div className=" col-sm-10">
            <input type="search" className="form-control " ref="theInput"
              placeholder="Search" onChange={this.search}/>
          </div>
          <button className="btn btn-info col-sm-2" onClick={this.clearSearch}><span className='glyphicon glyphicon-remove' /></button>
        </div>
      </div>
    );
  }
});
