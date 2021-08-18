import { Router } from 'express'
import StudentsController from './controllers/StudentsController'

const routes = Router()

routes.get('/aluno', StudentsController.index)
routes.get('/aluno/:id', StudentsController.show)
routes.put('/aluno/:id', StudentsController.update)
routes.delete('/aluno/:id', StudentsController.destroy)
routes.post('/aluno', StudentsController.create)

export default routes
