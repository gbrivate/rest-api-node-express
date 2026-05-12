const booksControllers = (Book) => {
  const post = async (req, res) => {
    const book = new Book(req.body);
    if (!req.body.title) {
      res.status(400);
      return res.send('Title is required');
    }

    try {
      await book.save();
      res.status(201);
      res.set('Location', `/api/books/${book._id}`);
      return res.json(book);
    } catch (err) {
      return res.status(500).send(err);
    }
  };

  const get = async (req, res) => {
    const { query } = req;
    try {
      const books = await Book.find(query);
      const returnbooks = books.map((book) => {
        const newBook = book.toJSON();
        newBook.links = {};
        newBook.links.self = `http://${req.headers.host}/api/books/${book._id}`;
        return newBook;
      });

      return res.json(returnbooks);
    } catch (err) {
      return res.status(500).send(err);
    }
  };

  return { post, get };
};

module.exports = booksControllers;
