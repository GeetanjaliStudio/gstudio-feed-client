require('dotenv').config();
const db = require('monk')(process.env.MONGO_DB);


let  feeds = db.get('feeds');
// First we clear our feeds collecion
feeds.drop();
feeds = db.create('feeds');

const relatedLinks = db.get('relatedlinks');
const users = db.get('users');

const linksCount = 2;
relatedLinks.find({}, {limit: linksCount, sort: {score: 1}})
  .then(function (links) {
    // sorted by name field
    // TODO: paginate users:
    return users.find({}).then(function(users){
      return {users, links}
    });
  })
  .then(function({users, links}) {
    // console.log('links', links);
    // console.log('users', users);
    for(let ii = 0; ii < users.length; ii++) {
      const user = users[ii];
      // TODO: filter links:
      const item = {userId: user._id, links: 'links'};

      feeds.insert(item).then(function(docs){
        console.log('inserted', docs);
      })
      .catch(function(error) {
        console.log('error', error);
      });
    }

    console.log('Done');
    db.close();
    process.exit();
    return;
  });




  /*
  db.close();
  process.exit();
  return;
   */