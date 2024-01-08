const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const DjSchema = new Schema({
  name: {type: String, require: true, maxLength: 100},
  start_date: {type: Date, default: Date.now},
});

DjSchema.virtual("url").get(function () {
  return `/lineup/dj/${this._id}`;
});

module.exports = mongoose.model('Dj', DjSchema);
