class Person {
  constructor(name, age, sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
  }

}
class Name {
  constructor(first, second) {
    this.first = first;
    this.second = second;
  }
  getParent() {
    return this.parent;
  }
}
let tarou = {}
let name = new Name("tarou", "yamada");
tarou = new Person(name, 33, "M");
tarou.name.parent = tarou;
console.log(tarou);
