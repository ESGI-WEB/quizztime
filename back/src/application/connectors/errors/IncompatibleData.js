class IncompatibleData extends Error {
  constructor(message) {
    super(message);
    this.name = 'IncompatibleData';
  }
}

module.exports = IncompatibleData;