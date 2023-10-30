var Moment = function (date) {
  if (date)
    this.date = new Date(date);
  else
    this.date = new Date();
  return this;
};

Moment.prototype.add = function (num, optionType) {
  var date = this.date;
  if ('day' === optionType) {
    date.setDate(date.getDate() + num);
  }
  if ('month' === optionType) {
    date.setMonth(date.getMonth() + num);
  }
  if ('year' === optionType) {
    date.setFullYear(date.getFullYear() + num);
  }
  this.date = date;
  return this;
}

module.exports = function (date) {
  return new Moment(date);
}