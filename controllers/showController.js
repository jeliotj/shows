const Show = require('../models/show');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const { spawn, spawnSync } = require('node:child_process');

async function newShowCron(showName, startHour, startMin, endHour, dayNum, weekdayName, length) {
  const cronjob = spawn('shows.sh', ['-N', showName, '-o', startHour, '-m', startMin, '-e', endHour, '-n', dayNum, '-d', weekdayName, '-l', length],
    {
      cwd: undefined,
      env: process.env,
      uid: 998,
    }
  );
  cronjob.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  cronjob.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  cronjob.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  }); 
}

function deleteShowCron(showName) {
  return new Promise(function (resolve, reject) {
    const delCronJob = spawn('shows.sh', ['-N', showName, '-D'],
      {
        cwd: undefined,
        env: process.env,
        uid: 998,
      }
    );
    delCronJob.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    delCronJob.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    delCronJob.on('close', (code) => {
      resolve(code);
    });
  });
}

exports.index = asyncHandler(async (req, res, next) => {
  const [numShows, allShows] = await Promise.all([
    Show.countDocuments({}).exec(),
    Show.find({}, 'show_name dj day').sort({ show_name: 1 }).exec(),
  ]);

  res.render('index', {
    title: 'KBMF Show Lineup',
    show_count: numShows,
    show_list: allShows,
  });
});

exports.show_detail = asyncHandler(async (req, res, next) => {
  const [show] = await Promise.all([Show.findById(req.params.id).exec()]);

  if (show === null) {
    // No results.
    const err = new Error('Show not found');
    err.status = 404;
    return next(err);
  }

  res.render('show_detail', {
    title: show.show_name,
    show: show,
  });
});

// Display show create form on GET.
exports.show_create_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    res.render('show_form', { title: 'Create New Show' });
  }
});

// Handle show create on POST.
exports.show_create_post = [
  body('show_name', 'Show Name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('show_name', 'Show Name must not already exist.')
    .custom(async value => {
      const name = await Show.find({'show_name': value}).exec();
      if (name.length !== 0) {
        throw new Error('Show name already in use.');
      }
  }),
  body('dj', 'DJ must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('day', 'Day must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('start_time', 'Start time must not be empty.'),
  body('end_time', 'End time must not be empty.'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const show = new Show({
      show_name: req.body.show_name,
      dj: req.body.dj,
      day: req.body.day,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
    });

    if (!errors.isEmpty()) {
      res.render('show_form', {
        title: 'Create New Show',
        show: show,
        errors: errors.array(),
      });
    } else {
      if (req.user) {
        await show.save();
        newShowCron(show.show_name, show.startHour, show.startMin, show.endHour, show.dayNum, show.day, show.length)
        res.redirect(show.url);
      }
    }
  }),
];

// Display show delete form on GET.
exports.show_delete_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const [show] = await Promise.all([Show.findById(req.params.id).exec()]);

    if (show === null) {
      res.redirect('/shows');
    }

    res.render('show_delete', {
      title: 'Delete Show',
      show: show,
    });
  }
});

// Handle show delete on POST.
exports.show_delete_post = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const [show] = await Promise.all([Show.findByIdAndDelete(req.body.showid).exec()]);
    deleteShowCron(show.show_name);
    res.redirect('/');
  }
});

exports.show_update_get = asyncHandler(async (req, res, next) => {
  if (req.user) {
    const [show] = await Promise.all([Show.findById(req.params.id).exec()]);

    if (show === null) {
      const err = new Error('Show Not Found');
      err.status = 404;
      return next(err);
    }

    res.render('show_form', {
      title: 'Update Show',
      show: show,
    });
  }
});

exports.show_update_post = [
  body('show_name', 'Show name must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('dj', 'Dj name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('day', 'Day must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('start_time', 'Start time must not be empty'),
  body('end_time', 'End time must not be empty'),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const show = new Show({
      show_name: req.body.show_name,
      dj: req.body.dj,
      day: req.body.day,
      start_time: req.body.start_time,
      end_time: req.body.end_time,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      res.render('show_form', {
        title: 'Update Show',
        show: show,
        errors: errors.array(),
      });
      return;
    } else {
      if (req.user) {
        const [updatedShow] = await Promise.all([Show.findByIdAndUpdate(
          req.params.id,
          show,
          {},
        ).exec()]);
        await deleteShowCron(updatedShow.show_name);
        newShowCron(show.show_name, show.startHour, show.startMin, show.endHour, show.dayNum, show.day, show.length);
        res.redirect(updatedShow.url);
      }
    }
  }),
];

