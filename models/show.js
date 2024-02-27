const mongoose = require('mongoose');
const utils = require('../util/dateUtil');

const Schema = mongoose.Schema;

const ShowSchema = new Schema({
  show_name: { type: String, required: true, maxLength: 100 },
  dj: { type: String, required: true, maxLength: 100 }, 
  day: { type: String, required: true, maxLength: 12 },
  start_time: { type: String, required: true },
  end_time: { type: String, required: true },
}, { collection: 'shows' });

ShowSchema.virtual('url').get(function () {
  return `/show/${this._id}`;
});

ShowSchema.virtual('startHour').get(function () {
  return this.start_time.split(':')[0];
});

ShowSchema.virtual('startMin').get(function () {
  return this.start_time.split(':')[1];
});

ShowSchema.virtual('endHour').get(function () {
  return this.end_time.split(':')[0];
});

ShowSchema.virtual('dayNum').get(function () {
  return utils.dayNum(this.day);
});

ShowSchema.virtual('length').get(function () {
  let startHours = Number(this.start_time.split(':')[0]);
  let startMinutes = Number(this.start_time.split(':')[1]);
  let endHours = Number(this.end_time.split(':')[0]);
  let endMinutes = Number(this.end_time.split(':')[1]);

  if ((endHours - startHours) >= 0) {
    return Math.abs(endHours - startHours) * 60 + Math.abs(endMinutes - startMinutes);
  } else {
    return (endHours + (24 - startHours)) * 60 + Math.abs(endMinutes - startMinutes);
  }
});

module.exports = mongoose.model('Show', ShowSchema);

