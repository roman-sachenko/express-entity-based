'use strict';

const { UserService, DbService, ResponseService } = require(`${basePath}/app/services`);

const helpers           = require(`${basePath}/app/helpers`);
const { AlreadyExist }  = require(`${basePath}/app/utils/apiErrors`);
const UserModel         = DbService.models().User;


module.exports = {
  /**
   * Regular Sing Up Process using manually provided details
   * @param req
   * @param res
   * @param next
   */
  regular: async (req, res, next) => {

    try {
      const signUpData = req.entities.mapped.signUpData;
      const useSearchResult = await UserModel.findOne({ email: signUpData.email }).select('_id');
    
  
      if(!helpers.isObjectValid(useSearchResult)) {

        const userService = new UserService(signUpData);
        let userCreated = await userService.create();

        userCreated = userCreated.toJSON();
        delete userCreated.password;

        ResponseService.sendSuccessResponse(res, userCreated);
      }

      throw new AlreadyExist('sign up: email already exists');

    } catch(err) {
      next(err);
    }

  },

  facebook: async (req, res, next) => {
    
  },

  google: async (req, res, next) => {

  }
};