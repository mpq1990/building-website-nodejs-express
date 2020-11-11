const express = require('express');

const speakersRouter = require('./speakers');
const feedbackRouter = require('./feedback');
const { request } = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakerService } = params;
  router.get('/', async (req, res, next) => {
    try {
      const topSpeakers = await speakerService.getList();
      const artwork = await speakerService.getAllArtwork();
      return res.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/speakers', speakersRouter(params));
  router.use('/feedback', feedbackRouter(params));

  return router;
};
