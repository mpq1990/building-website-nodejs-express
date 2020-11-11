const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createErrors = require('http-errors');
const bodyParser = require('body-parser');

const routes = require('./routes');

const SpeakerService = require('./services/SpeakerService');
const FeedbackService = require('./services/FeedbackService');
const { request, response } = require('express');
const { url } = require('inspector');
const { urlencoded } = require('body-parser');

const app = express();

const port = 3000;

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

app.set('trust proxy', 1);

app.use(
  cookieSession({
    name: 'session',
    keys: ['myman', 'heyman'],
  })
);

app.use(bodyParser.urlencoded({ urlencoded: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.use(async (req, res, next) => {
  try {
    const names = await speakerService.getNames();
    res.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

app.use('/', routes({ speakerService, feedbackService }));

app.use((req, res, next) => {
  return next(createErrors(404, 'File not found'));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  const status = err.status || 500;
  res.locals.status = status;
  res.status(status);
  console.log(err);
  res.render('error');
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
