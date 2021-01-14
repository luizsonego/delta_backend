import { query, Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import Developers from '../entity/Developers'
import DevelopersView from '../views/developers_view'


export default {
  async create (request: Request, response: Response) {
    try {
      const { name, gender, age, hobby, birth } = request.body

      const developersRepository = getRepository(Developers)

      const data = {
        name,
        gender,
        age,
        hobby,
        birth
      }

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        gender: Yup.string().required(),
        age: Yup.number(),
        hobby: Yup.string().required(),
        birth: Yup.date().required()
      })

      await schema.validate(data, {
        abortEarly: false
      })

      const developer = developersRepository.create(data)

      await developersRepository.save(developer)
      return response.status(201).json({ developer })
    } catch (error) {
      return response.status(400).json(error)
    }
  },

  async index (request: Request, response: Response) {
    const developerRepository = getRepository(Developers)

    const page : any = request.query.page || 1
    const limit : any = request.query.limit || 10

    // const search = { where: { ...request.query } } //// Esta buscando item especifico, verificar para buscar com Like
    // const where = search || ''


    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const developers = await developerRepository.find()

    const result = developers.slice(startIndex, endIndex)

    return response.json(DevelopersView.renderMany(result))
  },

  async show (request: Request, response: Response) {
    const { id } = request.params
    const developerRepository = getRepository(Developers)

    const developer = await developerRepository.findOneOrFail(id)

    return response.json(DevelopersView.render(developer))
  },

  async update (request: Request, response: Response) {
    try {
      const { id } = request.params
      const { name, gender, age, hobby, birth } = request.body

      const developersRepository = getRepository(Developers)

      const developer = await developersRepository.update(
        { id: parseInt(id) },
        { name, gender, age, hobby, birth }
      )
      if (developer.affected === 1) {
        const developerUpdated = await developersRepository.findOne(id)
        return response.status(200).json(developerUpdated)
      }
      return response.status(404).json({message: 'Developer not found'})
    } catch (error) {
      return response.status(400).json(error)
    }
  },

  async destroy (request: Request, response: Response) {
    const { id } = request.params

    const developersRepository = getRepository(Developers)

    try {
      await developersRepository.delete(id)
      return response.status(200).json('deletado')
    } catch (error) {
      return response.status(400).json(error)
    }
  }
}
