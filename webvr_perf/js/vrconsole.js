function nextPowerOfTwo( x ){
  return Math.pow( 2, Math.ceil( Math.log( x ) / Math.log(2)));;
}

function createVRConsole( width, height ){

  const FONT_SIZE = 16;
  const LINE_HEIGHT = 18;

  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000';

  const canvas = document.createElement('canvas');
  container.appendChild( canvas );
  canvas.width = nextPowerOfTwo( width );
  canvas.height = nextPowerOfTwo( height );

  canvas.style.cssText = 'width:'+width+'px;height:'+height+'px';

  const PR = window.devicePixelRatio;
  const context = canvas.getContext( '2d' );
  context.font = 'bold ' + ( FONT_SIZE * PR ) + 'px Helvetica,Arial,sans-serif';
  context.textBaseline = 'top';

  const lineHeight = LINE_HEIGHT * PR;

  const maxLines = Math.floor(height/lineHeight/PR);
  const buffer = [];

  const VR_RESCALE = 0.001;

  const texture = new THREE.Texture( canvas );
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true
  });
  const geometry = new THREE.PlaneGeometry( width * VR_RESCALE, height * VR_RESCALE, 1, 1 );
  const mesh = new THREE.Mesh( geometry, material );

  function log( nextLine ){
    buffer.push( nextLine );
    if( buffer.length >= maxLines ){
      buffer.shift();
    }
    render();
  }

  function render(){
    context.fillStyle = '#eeeeee';
    context.fillRect( 0, 0, width, height );
    context.fillStyle = '#151515';
    buffer.forEach( function( line, index ){
      context.fillText( line, 0, index * lineHeight );
    });
    texture.needsUpdate = true;
  }

  render();

  return {
    log,
    dom: container,
    mesh
  };
}