const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ShowSchema = new Schema({
  show_name: { type: String, required: true, maxLength: 100 },
  dj: { type: Schema.Types.ObjectId, ref: 'Dj', required: true }, 
  day: { type: String, required: true, maxLength: 12 },
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  genre: { type: Schema.Types.ObjectId, ref: 'Genre' },
}, { collection: 'shows' });

ShowSchema.virtual('url').get(function () {
  return `/lineup/show/${this._id}`;
});

module.exports = mongoose.model('Show', ShowSchema);


