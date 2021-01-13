import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
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
  }
}
