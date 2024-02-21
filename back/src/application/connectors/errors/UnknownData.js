class UnknownData extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnknownData';
  }
}

module.exports = UnknownData;