import express from 'express'
import * as controller from './controller'

const Route = express.Router()

Route.route('/register')
    .post(controller.adduser)

Route.route('/login')
    .post(controller.loginuser)

Route.route('/user')
    .post(controller.getuser)

Route.route('/user/edit')
    .post(controller.edituser)

Route.route('/user/del')
    .post(controller.deluser)

Route.route('/meta')
    .post(controller.addmeta)

Route.route('/data')
    .post(controller.savephoto, controller.adddata)

export default Route