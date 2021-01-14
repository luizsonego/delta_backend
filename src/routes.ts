import { Router } from 'express'
import DevelopersController from './controllers/DevelopersController'

const routes = Router()

routes.get('/developers/?', DevelopersController.index)
routes.get('/developers/:id', DevelopersController.show)
routes.put('/developers/:id', DevelopersController.update)
routes.delete('/developers/:id', DevelopersController.destroy)
routes.post('/developers', DevelopersController.create)

export default routes
