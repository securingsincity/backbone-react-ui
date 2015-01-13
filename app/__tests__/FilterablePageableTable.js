/** @jsx React.DOM */
jest.dontMock('../js/components/FilterablePageableTable.jsx');
jest.dontMock('react/addons');
var React = require('react/addons');
var FilterablePageableTable = require('../js/components/FilterablePageableTable.jsx');
var FilterSearch = require('../js/components/FilterSearch.jsx');
var TestUtils = React.addons.TestUtils;
$ = jQuery = global.$  = require('jquery');
global.bootstrap = require('../bower_components/bootstrap/dist/js/bootstrap')
var Backbone = require('backbone');
require('backbone.paginator');
var _ = require('lodash')
var self = this;


describe('Filterable Pageable Table tests - client side', function() {

  beforeEach(function() {
    var testModel = Backbone.Model.extend();
    var testCollection = Backbone.PageableCollection.extend({
      model : testModel,
      searchType: 'client',
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
      }
    });
    var allUsers = [
      { id : 1, first_name: 'james', last_name : 'hrisho'},
      { id : 2, first_name: 'jerry', last_name : 'seinfeld'},
      { id : 3, first_name: 'elaine', last_name : 'bennis'},
      { id : 4, first_name: 'cosmo', last_name : 'kramer'},
      { id : 5, first_name: 'george', last_name : 'costanza'},
      { id : 6, first_name: 'barney', last_name : 'stinson'},
      { id : 7, first_name: 'ted', last_name : 'mosby'},
      { id : 8, first_name: 'marshall', last_name : 'erickson'},
      { id : 9, first_name: 'robin', last_name : 'scherbatsky'},
      { id : 10, first_name: 'lily', last_name : 'aldrin'}
    ];

    self.coll = new testCollection(allUsers, {
       mode: "client",
       comparator: function (model) {
         return model.get("last_name");
       },
       state: {
         pageSize : 2
      },
    });



  });
  it('the table renders correctly', function() {

    var table = FilterablePageableTable({ initialCollection : self.coll, maximumPages: 5});
    //page length vs full collection
    expect(self.coll.length).toBe(2);
    expect(self.coll.fullCollection.length).toBe(10);
    var DOM = TestUtils.renderIntoDocument(table);

    // var renderedTable = TestUtils.findRenderedComponentWithType(
    //   DOM, Table);

    var renderedTable = TestUtils.findRenderedDOMComponentWithTag(
      DOM, 'table');
    expect(renderedTable.getDOMNode().className).toEqual("table dataTable");
    var renderedRows = TestUtils.scryRenderedDOMComponentsWithTag(DOM,'tr');
    var renderedPaginator = TestUtils.findRenderedDOMComponentWithClass(DOM,'pagination');
    var renderedInput = TestUtils.findRenderedDOMComponentWithClass(DOM,'form-group');
    // should be 2
    expect(renderedRows.length).toEqual(self.coll.state.pageSize);
    //should be the id
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('10');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('lily')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('aldrin')
    //expect(renderedPaginator.getDOMNode().textContent).toEqual("");
    expect($(renderedPaginator.getDOMNode()).find('li').first().text()).toEqual('«');
    expect($(renderedPaginator.getDOMNode()).find('li').first().hasClass('disabled')).toBe(true);
    expect($(renderedPaginator.getDOMNode()).find('li:nth-child(2)').hasClass('active')).toBe(true);
    expect($(renderedPaginator.getDOMNode()).find('li:nth-child(2)').text()).toEqual("1");
    expect($(renderedPaginator.getDOMNode()).find('li:nth-child(3)').text()).toEqual("2");
    expect($(renderedPaginator.getDOMNode()).find('li:nth-child(4)').text()).toEqual("3");
    expect($(renderedPaginator.getDOMNode()).find('li:nth-child(5)').text()).toEqual("4");
    expect($(renderedPaginator.getDOMNode()).find('li:nth-child(6)').text()).toEqual("5");
    expect($(renderedPaginator.getDOMNode()).find('li:nth-child(7)').text()).toEqual("»");
    expect($(renderedPaginator.getDOMNode()).find('li').last().text()).toEqual('»');
    expect($(renderedPaginator.getDOMNode()).find('li').last().hasClass('disabled')).toBe(false);

    var search = renderedInput.getDOMNode();
    expect($(search).find('input').attr('placeholder')).toEqual('Search');
    //expect search input to be rendered


  });
  it('search can be cleared', function() {

    var table = FilterablePageableTable({ initialCollection : self.coll, maximumPages: 5});
    //page length vs full collection
    expect(self.coll.length).toBe(2);
    expect(self.coll.fullCollection.length).toBe(10);
    var DOM = TestUtils.renderIntoDocument(table);
    //FilterSearch component
    var renderedInput = TestUtils.findRenderedComponentWithType(DOM,FilterSearch);
    var input = TestUtils.findRenderedDOMComponentWithTag(renderedInput, 'input');
    var search = renderedInput.getDOMNode();
    React.addons.TestUtils.Simulate.change(input, { target: { value: 'george' } });
    $(search).find('input').val('george')
    expect($(search).find('input').val()).toEqual('george');
    TestUtils.Simulate.click($(search).find('button')[0]);
    expect($(input.getDOMNode()).val()).toEqual('');
    //expect search input to be rendered


  });
  it('clearing search returns ', function() {

    var table = FilterablePageableTable({ initialCollection : self.coll, maximumPages: 5});
    expect(self.coll.length).toBe(2);
    expect(self.coll.fullCollection.length).toBe(10);
    var DOM = TestUtils.renderIntoDocument(table);
    var renderedInput = TestUtils.findRenderedComponentWithType(DOM,FilterSearch);
    var input = TestUtils.findRenderedDOMComponentWithTag(renderedInput, 'input');
    var search = renderedInput.getDOMNode();
    React.addons.TestUtils.Simulate.change(input, { target: { value: 'george' } });
    $(search).find('input').val('george')
    expect($(search).find('input').val()).toEqual('george');
    expect(self.coll.length).toBe(1);
    TestUtils.Simulate.click($(search).find('button')[0]);
    expect(self.coll.length).toBe(2);
    var renderedRows = TestUtils.scryRenderedDOMComponentsWithTag(DOM,'tr');
    // should be 2
    expect(renderedRows.length).toEqual(self.coll.state.pageSize);
    //should be the id
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('10');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('lily')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('aldrin')
  });
  it('valid search filters results to one result', function() {
    var table = FilterablePageableTable({ initialCollection : self.coll, maximumPages: 5});
    //page length vs full collection
    expect(self.coll.length).toBe(2);
    expect(self.coll.fullCollection.length).toBe(10);
    var DOM = TestUtils.renderIntoDocument(table);
    //FilterSearch component
    var renderedInput = TestUtils.findRenderedComponentWithType(DOM,FilterSearch);
    var input = TestUtils.findRenderedDOMComponentWithTag(renderedInput, 'input');
    var search = renderedInput.getDOMNode();
    React.addons.TestUtils.Simulate.change(input, { target: { value: 'george' } });
    expect(self.coll.length).toBe(1);
    var renderedRows = TestUtils.scryRenderedDOMComponentsWithTag(DOM,'tr');
    // should be 2
    expect(renderedRows.length).toEqual(1);
    //should be the id
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('5');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('george')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('costanza')

  });
  it('valid partial search filters results to multiple results', function() {
    var table = FilterablePageableTable({ initialCollection : self.coll, maximumPages: 5});
    //page length vs full collection
    expect(self.coll.length).toBe(2);
    expect(self.coll.fullCollection.length).toBe(10);
    var DOM = TestUtils.renderIntoDocument(table);
    //FilterSearch component
    var renderedInput = TestUtils.findRenderedComponentWithType(DOM,FilterSearch);
    var input = TestUtils.findRenderedDOMComponentWithTag(renderedInput, 'input');
    var search = renderedInput.getDOMNode();
    React.addons.TestUtils.Simulate.change(input, { target: { value: 'son' } });
    expect(self.coll.length).toBe(2);
    var renderedRows = TestUtils.scryRenderedDOMComponentsWithTag(DOM,'tr');
    // should be 2
    expect(renderedRows.length).toEqual(2);
    //should be the id
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('8');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('marshall')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('erickson')

    //should be the firstName
    expect($(renderedRows[1].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('barney')
    //should be the lastName
    expect($(renderedRows[1].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('stinson')

  });
  it('invalid search filters results to no results', function() {
    var table = FilterablePageableTable({ initialCollection : self.coll, maximumPages: 5});
    //page length vs full collection
    expect(self.coll.length).toBe(2);
    expect(self.coll.fullCollection.length).toBe(10);
    var DOM = TestUtils.renderIntoDocument(table);
    //FilterSearch component
    var renderedInput = TestUtils.findRenderedComponentWithType(DOM,FilterSearch);
    var input = TestUtils.findRenderedDOMComponentWithTag(renderedInput, 'input');
    var search = renderedInput.getDOMNode();
    React.addons.TestUtils.Simulate.change(input, { target: { value: 'asdfasdfdsa' } });
    expect(self.coll.length).toBe(0);
    var renderedRows = TestUtils.scryRenderedDOMComponentsWithTag(DOM,'tr');
    expect(renderedRows.length).toEqual(0);

  });

})
