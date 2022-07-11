module.exports = class UserDto {
  name;
  email;
  _id;
  isActivated;

  constructor(model) {
    this.name = model.name;
    this.email = model.email;
    this._id = model._id;
    this.isActivated = model.isActivated;
  }
};
