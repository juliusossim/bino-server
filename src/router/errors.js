import express from 'express';

export const databaseErrorRouter = express.Router();
databaseErrorRouter.get('/', (req, res) =>
  res.status(200).json({
    message:
      'Sorry! Could not connect to database. Please check your connection',
  })
);
