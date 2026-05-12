const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

process.env.ENV = 'Test';
process.env.NODE_ENV = 'test';
let server;
let agent;
let Book;
let mongo;

describe('Book Crud Test', () => {

  before(async function beforeAll() {
    this.timeout(20000);

    try {
      mongo = await MongoMemoryServer.create({
        instance: { ip: '127.0.0.1', port: 37017 }
      });
    } catch (err) {
      // Some sandboxed environments disallow listening on TCP ports; skip integration tests there.
      if (err && err.code === 'EPERM') {
        this.skip();
        return;
      }
      throw err;
    }
    process.env.MONGO_URL = mongo.getUri('bookAPI_Test');

    // Load the app/server after env is set (so config picks up MONGO_URL).
    // eslint-disable-next-line global-require
    const app = require('../app');

    // Note: supertest can test an Express app without binding a port.
    agent = request.agent(app);
    Book = mongoose.model('Book');

    // Ensure mongoose is connected to the in-memory MongoDB.
    await mongoose.connect(process.env.MONGO_URL, { serverSelectionTimeoutMS: 5000 });
  });

  it('should allow a book to be p(osted and return read and _it', (done) => {
    const bookPost = { title: 'My Book', author: 'Jon', genre: 'Fiction' };

    agent.post('/api/books')
      .send(bookPost)
      .expect(201)
      .end((err, results) => {
        // console.log(results);
        // results.body.read.should.not.equal('false');
        results.body.should.have.property('_id');
        done();
      });
  });

  afterEach(async () => {
    await Book.deleteMany({}).exec();
  });

  after(async () => {
    await mongoose.disconnect().catch(() => {});
    if (mongo) await mongo.stop();
  });

});
