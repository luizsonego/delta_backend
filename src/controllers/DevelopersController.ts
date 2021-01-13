import { Request, Response } from 'express'
import { Any, getRepository } from 'typeorm'
import * as Yup from 'yup'

import Developers from '../entity/Developers'
import DevelopersView from '../views/developers_view'

export default {
  async create (request: Request, response: Response) {
    const { name, gender, age, hobby, birth } = request.body

    const developersRepository = getRepository(Developers)

    const data = {
      name, gender, age, hobby, birth
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

    return response.status(201).json(developer)
  },

  async index (request: Request, response: Response) {
    const developerRepository = getRepository(Developers)

    const developer = await developerRepository.find()

    return response.json(DevelopersView.renderMany(developer))
  },

  async show (request: Request, response: Response) {
    const { id } = request.params
    const developerRepository = getRepository(Developers)

    const developer = await developerRepository.findOneOrFail(id)

    return response.json(DevelopersView.render(developer))
  },

  async update (request: Request, response: Response) {
    const { id } = request.params
    const { name, gender, age, hobby, birth } = request.body

    const developersRepository = getRepository(Developers)

    try {
      await developersRepository.update({ id: parseInt(id) }, { name, gender, age, hobby, birth })
      throw response.status(200).json('alterado com sucesso')
    } catch (error) {
      throw response.status(400).json(error)
    }
  },

  async delete (request: Request, response: Response) {
    const { id } = request.params

    const developersRepository = getRepository(Developers)

    try {
      await developersRepository.delete(id)
      throw response.status(200).json('deletado')
    } catch (error) {
      throw response.status(400).json(error)
    }
  }
}
