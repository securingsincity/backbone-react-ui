/** @jsx React.DOM */
jest.dontMock('../js/components/Table.jsx');
jest.dontMock('react/addons');
var React = require('react/addons');
var Table = require('../js/components/Table.jsx');
var TestUtils = React.addons.TestUtils;
$ = jQuery = global.$  = require('jquery');
global.bootstrap = require('../bower_components/bootstrap/dist/js/bootstrap')
var Backbone = require('backbone');
require('backbone.paginator');
var _ = require('lodash')
var self = this;


describe('Table tests - client side', function() {

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

    var table = Table({ initialCollection: self.coll});
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
    // should be 2
    expect(renderedRows.length).toEqual(self.coll.state.pageSize);
    //should be the id
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('10');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('lily')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('aldrin')

  });
  it('the table reorder correctly', function() {

    var table = Table({ initialCollection: self.coll});
    //page length vs full collection
    expect(self.coll.length).toBe(2);
    expect(self.coll.fullCollection.length).toBe(10);
    var DOM = TestUtils.renderIntoDocument(table);

    // var renderedTable = TestUtils.findRenderedComponentWithType(
    //   DOM, Table);

    var renderedTable = TestUtils.findRenderedDOMComponentWithTag(
      DOM, 'table');
    expect(renderedTable.getDOMNode().className).toEqual("table dataTable");

    var lastName = $(renderedTable.getDOMNode()).find('th[data-field="last_name"]')[0];
    expect(lastName.className).toEqual('sorting');
    React.addons.TestUtils.Simulate.click(lastName)
    expect(lastName.className).toEqual('sorting_desc');
    var renderedRows = TestUtils.scryRenderedDOMComponentsWithTag(DOM,'tr');
    // should be 2
    expect(renderedRows.length).toEqual(self.coll.state.pageSize);
    //should be the id
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('6');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('barney')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('stinson');


    React.addons.TestUtils.Simulate.click(lastName)
    expect(lastName.className).toEqual('sorting_asc');

    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('10');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('lily')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('aldrin');



  });
  it('the table reorder correctly when selecting another sort', function() {

    var table = Table({ initialCollection: self.coll});
    //page length vs full collection
    expect(self.coll.length).toBe(2);
    expect(self.coll.fullCollection.length).toBe(10);
    var DOM = TestUtils.renderIntoDocument(table);

    // var renderedTable = TestUtils.findRenderedComponentWithType(
    //   DOM, Table);

    var renderedTable = TestUtils.findRenderedDOMComponentWithTag(
      DOM, 'table');
    expect(renderedTable.getDOMNode().className).toEqual("table dataTable");

    var firstName = $(renderedTable.getDOMNode()).find('th[data-field="first_name"]')[0];
    var lastName = $(renderedTable.getDOMNode()).find('th[data-field="last_name"]')[0];
    expect(firstName.className).toEqual('sorting');
    expect(lastName.className).toEqual('sorting');
    React.addons.TestUtils.Simulate.click(firstName)
    expect(firstName.className).toEqual('sorting_desc');
    var renderedRows = TestUtils.scryRenderedDOMComponentsWithTag(DOM,'tr');
    // should be 2
    expect(renderedRows.length).toEqual(self.coll.state.pageSize);
    //should be the id
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('7');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('ted')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('mosby');


    React.addons.TestUtils.Simulate.click(lastName)
    expect(lastName.className).toEqual('sorting_desc');

    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('6');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('barney')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('stinson');



  });
})
