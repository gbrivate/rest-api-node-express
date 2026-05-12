const express = require('express');
const booksController = require('../controllers/booksController');
const mongoose = require('mongoose');

/**
 * @openapi
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         genre:
 *           type: string
 *         read:
 *           type: boolean
 *       example:
 *         title: "War and Peace"
 *         author: "Leo Tolstoy"
 *         genre: "Historical Fiction"
 *         read: false
 */

const routes = Book => {
  const bookRouter = express.Router();
  const controller = booksController(Book);

  /**
   * @openapi
   * /api/books:
   *   get:
   *     summary: List books
   *     parameters:
   *       - in: query
   *         name: genre
   *         schema:
   *           type: string
   *       - in: query
   *         name: author
   *         schema:
   *           type: string
   *       - in: query
   *         name: title
   *         schema:
   *           type: string
   *       - in: query
   *         name: read
   *         schema:
   *           type: boolean
   *     responses:
   *       200:
   *         description: Books
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Book'
   *   post:
   *     summary: Create a book
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Book'
   *     responses:
   *       201:
   *         description: Created
   *       400:
   *         description: Title is required
   */
  bookRouter.route('/books')
    .post(controller.post)
    .get(controller.get);

  bookRouter.use('/books/:bookId', async (req, res, next) => {
    try {
      if (!mongoose.isValidObjectId(req.params.bookId)) {
        return res.sendStatus(400);
      }
      const book = await Book.findById(req.params.bookId);
      if (!book) {
        return res.sendStatus(404);
      }
      req.book = book;
      return next();
    } catch (err) {
      return res.status(500).send(err);
    }
  });

  /**
   * @openapi
   * /api/books/{bookId}:
   *   get:
   *     summary: Get a book by id
   *     parameters:
   *       - in: path
   *         name: bookId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A book
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Book'
   *       404:
   *         description: Not found
   *   put:
   *     summary: Replace a book
   *     parameters:
   *       - in: path
   *         name: bookId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/Book'
   *     responses:
   *       200:
   *         description: Updated
   *       404:
   *         description: Not found
   *   patch:
   *     summary: Patch a book
   *     parameters:
   *       - in: path
   *         name: bookId
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Updated
   *       404:
   *         description: Not found
   *   delete:
   *     summary: Delete a book
   *     parameters:
   *       - in: path
   *         name: bookId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Deleted
   *       404:
   *         description: Not found
   */
  bookRouter.route('/books/:bookId')
    .get((req, res) => {
      const returnBook = req.book.toJSON();

      returnBook.links = {};
      const genre = req.book.genre.replace(' ', '%20');
      returnBook.links.FilterByThisGenre = `http://${req.headers.host}/api/books/?genre=${genre}`;
      res.json(returnBook);
    })
    .put(async (req, res) => {
      const { book } = req;
      book.title = req.body.title;
      book.author = req.body.author;
      book.genre = req.body.genre;
      book.read = req.body.read;
      try {
        await book.save();
        return res.json(book);
      } catch (err) {
        return res.status(500).send(err);
      }
    })
    .patch(async (req, res) => {
      const { book } = req;

      if (req.book._id) {
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });
      try {
        await book.save();
        return res.json(book);
      } catch (err) {
        return res.status(500).send(err);
      }
    })
    .delete(async (req, res) => {
      try {
        await req.book.deleteOne();
        return res.sendStatus(204);
      } catch (err) {
        return res.status(500).send(err);
      }
    });

  return bookRouter;
};

module.exports = routes;
