class Item {
  constructor(name='default', x=0, y=0) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.dependencies = [];
    this.completed = false;
  }
}