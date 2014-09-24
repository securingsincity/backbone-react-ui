/** @jsx React.DOM */
jest.dontMock('../js/components/Table.jsx');
var React = require('react/addons');
var PageableTable = require('../js/components/PageableTable.jsx');
var TestUtils = React.addons.TestUtils;
$ = jQuery = global.$  = require('jquery');
global.bootstrap = require('../bower_components/bootstrap/dist/js/bootstrap')
var Backbone = require('backbone');
require('backbone.paginator');
var _ = require('lodash')
var self = this;


describe('Pageable Table tests - client side', function() {

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

    var table = PageableTable({ initialCollection : self.coll, maximumPages: 5});
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
  });
  it('the table can go to next page and previous page', function() {

    var table = PageableTable({ initialCollection : self.coll, maximumPages: 5});
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
    // should be 2
    expect(renderedRows.length).toEqual(self.coll.state.pageSize);
    //should be the id
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('10');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('lily')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('aldrin')
    //expect(renderedPaginator.getDOMNode().textContent).toEqual("");
    var previousPage = $(renderedPaginator.getDOMNode()).find('li').first();
    var nextPage = $(renderedPaginator.getDOMNode()).find('li').last();
    var page1 = $(renderedPaginator.getDOMNode()).find('li:nth-child(2)').last();
    var page2 = $(renderedPaginator.getDOMNode()).find('li:nth-child(3)').last();


    TestUtils.Simulate.click(nextPage.find('a')[0]);
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('5');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('george')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('costanza')
    expect(previousPage.hasClass('disabled')).toBe(false);
    expect(page1.hasClass('active')).toBe(false);
    expect(page2.hasClass('active')).toBe(true);
    expect(nextPage.hasClass('disabled')).toBe(false);
    TestUtils.Simulate.click(previousPage.find('a')[0]);
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('10');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('lily')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('aldrin')
    expect(previousPage.hasClass('disabled')).toBe(true);
    expect(page1.hasClass('active')).toBe(true);
    expect(page2.hasClass('active')).toBe(false);
    expect(nextPage.hasClass('disabled')).toBe(false);



  });
  it('the table can go to specific pages', function() {

    var table = PageableTable({ initialCollection : self.coll, maximumPages: 5});
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
    // should be 2
    expect(renderedRows.length).toEqual(self.coll.state.pageSize);
    //should be the id
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('10');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('lily')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('aldrin')
    //expect(renderedPaginator.getDOMNode().textContent).toEqual("");
    var previousPage = $(renderedPaginator.getDOMNode()).find('li').first();
    var nextPage = $(renderedPaginator.getDOMNode()).find('li').last();
    var page1 = $(renderedPaginator.getDOMNode()).find('li:nth-child(2)').last();
    var page2 = $(renderedPaginator.getDOMNode()).find('li:nth-child(3)').last();
    var page3 = $(renderedPaginator.getDOMNode()).find('li:nth-child(4)').last();
    var page5 = $(renderedPaginator.getDOMNode()).find('li:nth-child(6)').last();


    TestUtils.Simulate.click(page3.find('a')[0]);
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('1');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('james')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('hrisho')
    expect(previousPage.hasClass('disabled')).toBe(false);
    expect(page1.hasClass('active')).toBe(false);
    expect(page2.hasClass('active')).toBe(false);
    expect(page3.hasClass('active')).toBe(true);
    expect(nextPage.hasClass('disabled')).toBe(false);
    TestUtils.Simulate.click(page5.find('a')[0]);
    expect($(renderedRows[0].getDOMNode()).find('td').first().text() ).toEqual('2');
    //should be the firstName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(2)').text() ).toEqual('jerry')
    //should be the lastName
    expect($(renderedRows[0].getDOMNode()).find('td:nth-child(3)').text() ).toEqual('seinfeld')
    expect(previousPage.hasClass('disabled')).toBe(false);
    expect(page1.hasClass('active')).toBe(false);
    expect(page3.hasClass('active')).toBe(false);
    expect(page5.hasClass('active')).toBe(true);
    expect(nextPage.hasClass('disabled')).toBe(true);



  });
})
