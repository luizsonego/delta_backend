import { Request, Response } from 'express'
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
        age: Yup.number().required(),
        hobby: Yup.string().required(),
        birth: Yup.string().required()
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
    let { perPage, page, ...params } = request.query
    let realPage: number
    let realTake: number

    if (perPage) realTake = +perPage
    else {
      perPage = '10'
      realTake = 10
    }

    if (page) realPage = +page === 1 ? 0 : (+page - 1) * realTake
    else {
      realPage = 0
      page = '1'
    }

    const findOptions = {
      take: realTake,
      skip: realPage,
      where: { ...params }
    }
    if (!params) delete findOptions.where

    const getQuery = () => Object.keys(params).map((key:string) => `${key}=${params[key]}`).join('&')
    const queryParams = getQuery().length === 0 ? '' : `&${getQuery()}`
    const developers = await developerRepository.find(findOptions)

    return response.json(
      {
        data: DevelopersView.renderMany(developers),
        perPage: realTake,
        page: +page || 1,
        next: `developers?perPage=${realTake}&page=${+page + 1}${queryParams}`,
        prev: `developers?perPage=${realTake}&page=${+page - 1}${queryParams}`
      }
    )
  },

  async show (request: Request, response: Response) {
    const { id } = request.params
    const developerRepository = getRepository(Developers)

    const developer = await developerRepository.findOneOrFail(id)

    return response.status(200).json(DevelopersView.render(developer))
  },

  async update (request: Request, response: Response) {
    const { id } = request.params
    const { name, gender, age, hobby, birth } = request.body

    try {
      const developersRepository = getRepository(Developers)

      await developersRepository.update(
        { id: parseInt(id) },
        { name, gender, age, hobby, birth }
      ).then(resp => {
        return response.status(200).json({ name, gender, age, hobby, birth })
      })
    } catch (error) {
      return response.status(400).json({ message: error })
    }
  },

  async destroy (request: Request, response: Response) {
    const { id } = request.params

    const developersRepository = getRepository(Developers)

    try {
      await developersRepository.delete(id)
      return response.status(200).json({ message: 'deletado' })
    } catch (error) {
      return response.status(400).json({ message: error })
    }
  }
}