const booksControllers = (Book) => {
  const post = (req, res) => {
    const book = new Book(req.body);
    if (!req.body.title) {
      res.status(400);
      return res.send('Title is required');
    }

    book.save();
    res.status(201);
    return res.json(book);
  };

  const get = (req, res) => {
    const { query } = req;
    Book.find(query, (err, books) => (err ? res.send(err) : res.json(books)));
  };

  return { post, get };
};

module.exports = booksControllers;
