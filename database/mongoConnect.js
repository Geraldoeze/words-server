const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const MONGODB_URL = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@node-cluster.uktzq.mongodb.net/words?retryWrites=true&w=majority`;

// const MONGODB_URL = "mongodb://localhost:27017/StudentAdmin";
const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URL, { useNewUrlParser: true })
    .then((client) => {
      console.log("Connected!");
      _db = client.db();  
      callback(); 
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
