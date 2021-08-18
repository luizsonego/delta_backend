import Students from '../entity/Students'

export default {
  render (students: Students) {
    return {
      id: students.id,
      name: students.name,
      gender: students.gender,
      age: students.age,
      class_: students.class_,
      birth: students.birth
    }
  },

  renderMany (students: Students[]) {
    return students.map((students) => this.render(students))
  }
}
