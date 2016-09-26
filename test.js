let renderedMixin = Base => class extends Base {
  init() {}
  updateGlobal() {}
  updateLocal() {}
  update() {}
};
class Foo {}
let Bar = class Bar extends renderedMixin(Foo) {}
