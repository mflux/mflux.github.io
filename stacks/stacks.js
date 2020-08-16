let mouseDeltaX = 0;

let draggables = [];

let state = {
  items: [],
  panX: 0,
  panY: 0,
};

let tMouseX = 0;
let tMouseY = 0;

let hoveredDraggable;
let draggableAwaitingDependency;
let panning = false;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  const newItemButton = createButton('New Item');
  newItemButton.position(0, 0);
  newItemButton.mousePressed(() => {
    const item = new Item('New Item', 5, 30);
    state.items.push(item);

    const draggable = new Draggable(item);
    draggables.push(draggable);
  });

  const saveButton = createButton('Save');
  saveButton.position(80, 0);
  saveButton.mousePressed(() => {
    download(JSON.stringify(state, null, 2), 'stack.json', 'text/plain');
    // const input = document.createElement('input');
    // input.type = 'file';
    // input.onchange = e => {
    //   const file = e.target.files[0];
    //   console.log(file);
    //   download(JSON.stringify(state, null, 2), file.name, 'text/plain');
    // }
    // input.click();
  });

  const fileInput = document.getElementById('file-input');
  const loadButton = createButton('Load');
  loadButton.position(134, 0);
  loadButton.mousePressed(() => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = readerEvent => {
      const content = readerEvent.target.result;
      loadState(JSON.parse(content));
    };
  });
}

function loadState(loadedState) {
  draggables.forEach(draggable => draggable.destroy());
  draggables = [];

  state = loadedState;

  state.items.forEach(item => {
    const draggable = new Draggable(item);
    draggables.push(draggable);
  });

  if (!state.panX) {
    state.panX = 0;
    state.panY = 0;
  }
}

function draw() {
  tMouseX = mouseX - state.panX;
  tMouseY = mouseY - state.panY;
  push();
  translate(state.panX, state.panY);

  background(255);
  hoveredDraggable = undefined;
  draggables.forEach((draggable) => {
    draggable.update();
    draggable.over();
    draggable.show();
  });

  if (draggableAwaitingDependency) {
    stroke(255, 0, 0);
    line(draggableAwaitingDependency.x + draggableAwaitingDependency.w / 2,
      draggableAwaitingDependency.y + draggableAwaitingDependency.h, tMouseX, tMouseY);
  }

  drawParentLines();
  pop();
}

function mousePressed() {
  draggables.forEach((draggable) => {
    draggable.pressed();
  });
  attemptParentDraggables();

  if (!hoveredDraggable) {
    panning = true;
  }
}

function mouseDragged() {
  if (panning) {
    state.panX += movedX;
    state.panY += movedY;
  }
}

function mouseReleased() {
  draggables.forEach((draggable) => {
    draggable.released();
  });
  panning = false;
}

function attemptParentDraggables() {
  if (!hoveredDraggable) {
    if (draggableAwaitingDependency) {
      draggableAwaitingDependency.item.dependencies = [];
    }
    draggableAwaitingDependency = undefined;
    return;
  }

  if (!draggableAwaitingDependency) {
    return;
  }

  if (draggableAwaitingDependency === hoveredDraggable) {
    return;
  }

  const dependentItemId = state.items.indexOf(hoveredDraggable.item);

  if (draggableAwaitingDependency.item.dependencies.indexOf(dependentItemId) < 0) {
    draggableAwaitingDependency.item.dependencies.push(dependentItemId);
  }
  draggableAwaitingDependency = undefined;
}

function drawParentLines() {

  draggables.forEach(draggable => {
    const item = draggable.item;
    const dependencyCount = item.dependencies.length;
    item.dependencies.forEach((dependencyId, i) => {
      const parentItem = state.items[dependencyId];
      const parentDraggable = draggables.find(draggable => draggable.item === parentItem);
      if (parentDraggable) {
        const startX = (i + 1) / (dependencyCount + 1) * draggable.w;

        stroke(80, 50);
        strokeWeight(4)
        push();
        translate(0, 2);
        line(draggable.x + startX, draggable.y + draggable.h,
          parentDraggable.x + parentDraggable.w / 2, parentDraggable.y);
        pop();

        strokeWeight(1)
        stroke(0, 0, 255);
        line(draggable.x + startX, draggable.y + draggable.h,
          parentDraggable.x + parentDraggable.w / 2, parentDraggable.y);
      }
    });
  });
}

function download(data, filename, type) {
  var file = new Blob([data], {type: type});
  if (window.navigator.msSaveOrOpenBlob) // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else { // Others
    var a = document.createElement("a"),
            url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
  }
}

function removeDraggable(draggable) {
  const item = draggable.item;
  draggables.splice(draggables.indexOf(draggable), 1);
  draggable.destroy();
}