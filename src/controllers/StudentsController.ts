import { Request, Response } from 'express'
import { getRepository } from 'typeorm'
import * as Yup from 'yup'

import Students from '../entity/Students'
import StudentsView from '../views/students_view'

export default {
  async create (request: Request, response: Response) {
    try {
      const { name, gender, age, class_, birth } = request.body

      const studentsRepository = getRepository(Students)

      const data = {
        name,
        gender,
        age,
        class_,
        birth
      }

      const schema = Yup.object().shape({
        name: Yup.string().required(),
        gender: Yup.string().required(),
        age: Yup.number().required(),
        class_: Yup.string().required(),
        birth: Yup.string().required()
      })

      await schema.validate(data, {
        abortEarly: false
      })

      const developer = studentsRepository.create(data)

      await studentsRepository.save(developer)
      return response.status(201).json({ developer })
    } catch (error) {
      return response.status(400).json(error)
    }
  },

  async index (request: Request, response: Response) {
    const developerRepository = getRepository(Students)
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
    const students = await developerRepository.find(findOptions)

    return response.json(
      {
        data: StudentsView.renderMany(students),
        perPage: realTake,
        page: +page || 1,
        next: `students?perPage=${realTake}&page=${+page + 1}${queryParams}`,
        prev: `students?perPage=${realTake}&page=${+page - 1}${queryParams}`
      }
    )
  },

  async show (request: Request, response: Response) {
    const { id } = request.params
    const developerRepository = getRepository(Students)

    const developer = await developerRepository.findOneOrFail(id)

    return response.status(200).json(StudentsView.render(developer))
  },

  async update (request: Request, response: Response) {
    const { id } = request.params
    const { name, gender, age, class_, birth } = request.body

    try {
      const studentsRepository = getRepository(Students)

      await studentsRepository.update(
        { id: parseInt(id) },
        { name, gender, age, class_, birth }
      ).then(resp => {
        return response.status(200).json({ name, gender, age, class_, birth })
      })
    } catch (error) {
      return response.status(400).json({ message: error })
    }
  },

  async destroy (request: Request, response: Response) {
    const { id } = request.params

    const studentsRepository = getRepository(Students)

    try {
      await studentsRepository.delete(id)
      return response.status(200).json({ message: 'deletado' })
    } catch (error) {
      return response.status(400).json({ message: error })
    }
  }
}
