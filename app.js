var express = require('express');
var app = express();
var request = require('request');
var serveIndex = require('serve-static');
var _ = require('lodash');

var allUsers = [
  { id : 1, first_name: 'james', last_name : 'hrisho'},
  { id : 2, first_name: 'abc', last_name : 'ahrisho'},
  { id : 3, first_name: 'james', last_name : 'hrisho'},
  { id : 4, first_name: 'james', last_name : 'hrisho'},
  { id : 5, first_name: 'james', last_name : 'hrisho'},
  { id : 6, first_name: 'james', last_name : 'hrisho'},
  { id : 7, first_name: 'james', last_name : 'hrisho'},
  { id : 8, first_name: 'james', last_name : 'hrisho'},
  { id : 9, first_name: 'james', last_name : 'hrisho'},
  { id : 10, first_name: 'james', last_name : 'hrisho'}
];
var filteredUsersCount = 1;
function getUsers(req) {
  var allUsersClone = _.clone(allUsers);
  var currentPage = req.query.page ? parseInt(req.query.page ): 1;
  var pageSize = req.query.per_page ? parseInt(req.query.per_page) : 10;
  if(req.query.q && req.query != '' && req.query.fields && req.query.fields != '') {
    var fields = req.query.fields.split(',');
    allUsersClone = _.filter(allUsersClone,function(model) {
       var regexTest = new RegExp(req.query.q,"gi");
       var result = false;

        _.each(fields, function(field) {
          if(regexTest.test(model[field])) {
            result = true;
          }
       });
       return result;
    });
    filteredUsersCount = allUsersClone.lenght;
  }
  if(req.query.sort_by) {
    var sortBy = req.query.sort_by;
    allUsersClone = _.sortBy(allUsersClone,sortBy)
    if (req.query.order && req.query.order == 'desc') {
      allUsersClone.reverse();
    }
  }
  var startingRecord = 0;
  if (currentPage !== 1) {
    startingRecord = ((currentPage - 1)* pageSize) ;
  }

  var users = []
  for(var i = startingRecord; i < (startingRecord + pageSize) ; i++) {
    if(allUsersClone[i]) users.push(allUsersClone[i]);
  }
  var usersObj = {};
  usersObj.users = users;
  usersObj.totalPages = (allUsersClone.length / pageSize);
  return usersObj
  //return users;
}

app.get('/api/users', function(req, res){

  var users = getUsers(req);
  var currentPage = req.query.page ? parseInt(req.query.page ): 1;
  var pageSize = req.query.per_page ? parseInt(req.query.per_page) : 10;
  var totalPages = users.totalPages
  if (totalPages < 1) {
    totalPages = 1;
  }
  var order = -1
  if(req.query.order && req.query.order == 'desc'){
    order = 1;
  };
  var totalRecords = allUsers.length;
  if(req.query.q) {
    totalRecords = filteredUsersCount;
  }
  var sort_by = req.query.sort_by ? req.query.sort_by : "id";
  res.json({
    "data" : users.users,
    "pagination" : {
      totalPages : totalPages,
      totalRecords : totalRecords,
      currentPage: currentPage,
      pageSize : pageSize,
      order: order,
      sort_by: sort_by,
      query : req.query.q ? req.query.q : '',
      fields: req.query.fields ? req.query.fields : ''
    }
  });
});

app.get('/', function(req,res) {
 res.send('hi james');
});
app.use('/app', serveIndex('app', {'icons': true}))
var port = Number(3001);
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
