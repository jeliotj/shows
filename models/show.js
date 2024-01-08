const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShowSchema = new Schema({
  _id: { type: Number },
  show_name: { type: String, required: true, maxLength: 100 },
  dj: { type: String, required: true, maxLength: 100 }, 
  day: { type: String, required: true, maxLength: 12 },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
}, { collection: 'shows' });

ShowSchema.virtual('url').get(function () {
  return `/lineup/show/${this._id}`;
});

module.exports = mongoose.model('Show', ShowSchema);


