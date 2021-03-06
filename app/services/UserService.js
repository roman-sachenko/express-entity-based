const MainService = require('./MainService');
const _ = require('lodash');
const DbService = require(`${basePath}/app/services/DbService`);
const CryptoService = require(`${basePath}/app/services/CryptoService`);

module.exports = class UserService extends MainService {
  constructor(userData) {
    super('User Service');
    this._userProvider = DbService.models('User');
    this._userData = userData;
    this._EncodeService = CryptoService;
  }

  static async findOne(params) {
    const options = params.options || {};
    const query = params.query || {};
    const lean = !!(options && options.lean); 
    const select = options.select || '';

    return DbService.models('User').findOne(query).select(select).lean(lean);
  }

  static async findAll(params) {
    const options = params.options || {};
    const query = params.query || {};
    const lean = !!(options && options.lean); 
    const select = options.select || '';

    return DbService.models('User').find(query).select(select).lean(lean);
  }

  static getRoles() {
    return DbService.models('User').ROLES;
  }

  async create() {
    const self = this;

    if (!self._userData.password) {
      self._userData.password = self._EncodeService.getRandomString(4);
    }

    const encodeProvider = new self._EncodeService();
    self._userData.password = await encodeProvider.encode(self._userData.password);

    return new self._userProvider(self._userData).save();
  }

  remove() {
    return this._userData.remove();
  }

  async update(updateData) {
    const updatedUser = _.mergeWith(this._userData, updateData);
    return updatedUser.save();
  }

  async changePassword(newPassword) {
    const encodeProvider = new this._EncodeService();
    this._userData.password = await encodeProvider.encode(newPassword);
    return this._userData.save();
  }
};
