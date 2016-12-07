
var stats = new Stats();
document.body.appendChild( stats.dom );

const { scene, camera, renderer, events, toggleVR, controllers  } = VRViewer({
  //  triggers entering vr without any input
  autoEnter: false,
  //  create an empty room with two lights
  emptyRoom: true,
  pathToControllers: 'https://rawgit.com/mflux/three-vr-viewer/master/example/models/obj/vive-controller/',
  THREE
});

init();
animate();

function init() {


  stats.mesh.position.set( 0, 1.5, -0.5 );
  scene.add( stats.mesh );

  var rows = gup().rows;
  var columns = gup().columns;

  var group = new THREE.Group();
  scene.add( group );

  var spacing = 0.2;

  for( let y=0; y<rows; y++ ){
    for( let x=0; x<columns; x++ ){
      var mesh = new THREE.Mesh( new THREE.CubeGeometry( 0.1,0.1,0.1, 1, 1, 1 ), new THREE.MeshLambertMaterial()  );
      mesh.position.x = x * spacing;
      mesh.position.y = y * spacing;
      group.add( mesh );
    }
  }

  group.position.x = -(columns * spacing * 0.5);
  group.position.y = 1.6 -(rows * spacing * 0.5) ;
  group.position.z = -3.6;

}

function animate() {
  stats.begin();
  requestAnimationFrame( animate );
  stats.end();
}

