class Draggable {
  constructor(item, width=100, height=30) {
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?

    this.x = item.x;
    this.y = item.y;
    this.w = width;
    this.h = height;
    this.offsetX = 0;
    this.offsetY = 0;

    this.item = item;

    this.nameInput = createInput(item.name);
    this.nameInput.size(width, 12);
    this.nameInput.style('font-size', 8);
    this.nameInput.input(() => {
      item.name = this.nameInput.value()
    });

    this.parentButton = createButton('Add Dependency');
    this.parentButton.size(100, 10);
    this.parentButton.style('font-size', 5);
    this.parentButton.mousePressed(() => {
      draggableAwaitingDependency = this;
    });

    this.removeButton = createButton('X');
    this.removeButton.size(8, 10);
    this.removeButton.style('font-size', 5);
    this.removeButton.style('padding', 0);
    this.removeButton.mousePressed(() => {
      removeDraggable(this);
    });

    this.completedButton = createCheckbox('', item.completed);
    this.completedButton.style('margin', 0);
    this.completedButton.size(8, 8);

    this.completedButton.mousePressed(() => {
      item.completed = !item.completed;
    });
  }

  over() {
    // Is mouse over object
    if (tMouseX > this.x && tMouseX < this.x + this.w && tMouseY > this.y && tMouseY < this.y + this.h) {
      this.rollover = true;
      hoveredDraggable = this;
    } else {
      this.rollover = false;
    }
  }

  update() {
    // Adjust location if being dragged
    if (this.dragging) {
      this.x = tMouseX + this.offsetX;
      this.y = tMouseY + this.offsetY;
    }

    const panX = state.panX;
    const panY = state.panY;
    this.nameInput.position(panX + this.x, panY + this.y);
    this.parentButton.position(panX + this.x, panY + this.y + this.h - 10);
    this.removeButton.position(panX + this.x + this.w - 10, panY + this.y);
    this.completedButton.position(panX + this.x + this.w - 30, panY + this.y);
  }

  show() {

    stroke(0);
    // Different fill based on state
    if (this.dragging) {
      fill(50);
    } else if (this.rollover) {
      if (this.item.completed) {
        fill(65, 80, 180, 255);
      }
      else {
        fill(100);
      }
    } else {
      if (this.item.completed) {
        fill(45, 60, 120, 255);
      }
      else {
        fill(175, 200);
      }
    }
    rect(this.x, this.y, this.w, this.h);
  }

  pressed() {
    // Did I click on the rectangle?
    if (tMouseX > this.x && tMouseX < this.x + this.w && tMouseY > this.y && tMouseY < this.y + this.h) {
      this.dragging = true;
      // If so, keep track of relative location of click to corner of rectangle
      this.offsetX = this.x - tMouseX;
      this.offsetY = this.y - tMouseY;
    }
  }

  released() {
    // Quit dragging
    this.dragging = false;
    this.item.x = this.x;
    this.item.y = this.y;
  }

  destroy() {
    this.nameInput.remove();
    this.parentButton.remove();
    this.removeButton.remove();
    this.completedButton.remove();
  }
}