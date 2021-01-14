import Developers from '../entity/Developers'

export default {
  render (developer: Developers) {
    return {
      id: developer.id,
      name: developer.name,
      gender: developer.gender,
      age: developer.age,
      hobby: developer.hobby,
      birth: developer.birth
    }
  },

  renderMany (developers: Developers[]) {
    return developers.map((developers) => this.render(developers))
  }
}
