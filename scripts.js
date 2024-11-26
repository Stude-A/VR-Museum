// ** Modelos de aviones y selección **

const planeModels = [
  {
    id: 'planeModel',
    material: 'planeMaterial',
    position: '0 10 -300',
    rotation: '-110 90 -90',
    scale: '0.1 0.1 0.1',
    title: 'Airbus A380',
    description: 'The Airbus A380 is the world\'s largest passenger aircraft, capable of carrying hundreds of passengers in a single flight, offering a unique travel experience.'
  },
  {
    id: 'planeModelB2',
    material: 'planeMaterialB2',
    position: '0 15 -300',
    rotation: '-25 90 0',
    scale: '30 30 30',
    title: 'B-2 Spirit',
    description: 'The B-2 Spirit is a stealth bomber. Its special design makes it almost undetectable by radar, allowing it to attack enemy targets without being detected.'
  }
];

let currentModelIndex = 1;

// Función genérica para actualizar atributos de un elemento
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(attr => element.setAttribute(attr, attributes[attr]));
}

// Cambiar el modelo del avión
function changePlaneModel(index = currentModelIndex) {
  const planeEntity = document.querySelector('#planeEntity');
  const model = planeModels[index];

  setAttributes(planeEntity, {
    'obj-model': `obj: #${model.id}; mtl: #${model.material}`,
    position: model.position,
    rotation: model.rotation,
    scale: model.scale
  });

  // Actualizar título y descripción
  setAttributes(document.querySelector('#planeTitle'), { value: model.title });
  setAttributes(document.querySelector('#planeDescription'), { value: model.description });

  console.log(`${model.title} model loaded`);
}

// Cambiar entre modelos previos y siguientes
function addModelChangeListeners() {
  document.querySelector('#prevButton').addEventListener('click', () => {
    currentModelIndex = (currentModelIndex - 1 + planeModels.length) % planeModels.length;
    changePlaneModel();
  });

  document.querySelector('#nextButton').addEventListener('click', () => {
    currentModelIndex = (currentModelIndex + 1) % planeModels.length;
    changePlaneModel();
  });
}

// ** Configuración de controles y plataformas **

function detectPlatform() {
  const isMetaQuest = /OculusBrowser/.test(navigator.userAgent);
  const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
  const isXbox = gamepads.some(pad => pad && pad.id.includes('Xbox'));

  return { isMetaQuest, isXbox, gamepads };
}

// ** Configuración de controles y plataformas **
function setupControls() {
  const { isMetaQuest, isXbox } = detectPlatform();
  const camera = document.querySelector('#camera');
  const leftHand = document.querySelector('#leftHand');
  const rightHand = document.querySelector('#rightHand');

  // Limpia elementos previos
  camera.innerHTML = '';
  leftHand.innerHTML = '';
  rightHand.innerHTML = '';

  if (isMetaQuest) {
    leftHand.innerHTML = '<a-cursor raycaster="objects: .clickable" fuse="false"></a-cursor>';
    rightHand.innerHTML = '<a-cursor raycaster="objects: .clickable" fuse="false"></a-cursor>';
  } else if (isXbox) {
    camera.innerHTML = '<a-cursor raycaster="objects: .clickable" fuse="false"></a-cursor>';
    
    document.querySelector('#cameraRig').setAttribute('gamepad-controls', 'enabled: true');

    // Detectar el botón "A" en el Xbox y simular el clic
    window.addEventListener('gamepadconnected', () => {
      console.log('Gamepad connected');
      const gamepad = navigator.getGamepads()[0]; // Se asume que el primer control es el Xbox

      // Monitorizar el estado del botón "A"
      const checkGamepadButton = () => {
        
        const pad = navigator.getGamepads()[0];
        if (pad && pad.buttons[0].pressed) { // El botón "A" es el índice 0
          handleInteraction(); // Llamar a la función que maneja la interacción con objetos
        }
      };

      const handleInteraction = () => {
        const cursor = document.querySelector('a-cursor'); // Obtener el cursor
        if (cursor) {
          // Disparar el evento de clic en el objeto bajo el cursor
          cursor.emit('click');
        }
      };

      // Llamar a la función de chequear el botón de manera continua
      setInterval(checkGamepadButton, 100);
    });
  } else {
    camera.innerHTML = '<a-cursor raycaster="objects: .clickable" fuse="false"></a-cursor>';
  }
}



// ** Movimiento del rig con joystick Xbox o Meta Quest **
AFRAME.registerComponent('controller-movement', {
  schema: { speed: { type: 'number', default: 0.6} },
  
  init: function () {
    this.camera = document.querySelector('#camera');
    this.rig = document.querySelector('#cameraRig');
    this.directionVector = new THREE.Vector3();
  },

  tick: function () {
    const { isMetaQuest, isXbox } = detectPlatform();
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

    gamepads.forEach(pad => {
      if (pad) {
        const [x, y] = isMetaQuest ? pad.axes.slice(2, 4) : pad.axes.slice(0, 2); // Joystick derecho o izquierdo
        if (Math.abs(x) > 0.1 || Math.abs(y) > 0.1) {
          // Obtener la dirección de la cámara
          const cameraWorldDirection = new THREE.Vector3();
          this.camera.object3D.getWorldDirection(cameraWorldDirection);
          cameraWorldDirection.normalize(); // Normalizar la dirección

          // Obtener la dirección lateral (cruzada con el eje Y global)
          const strafeDirection = new THREE.Vector3().crossVectors(cameraWorldDirection, new THREE.Vector3(0, 1, 0)).normalize();

          // Inicializar el vector de movimiento
          let movement = new THREE.Vector3();

          // Calcular el movimiento en función de las teclas
          if (Math.abs(x) > 0.1) movement.add(strafeDirection.multiplyScalar(-x)); // Movimiento lateral (A/D)
          if (Math.abs(y) > 0.1) movement.add(cameraWorldDirection.multiplyScalar(y)); // Movimiento hacia adelante/atrás (W/S)

          // Normalizar el movimiento para evitar aceleraciones diagonales
          movement.normalize();

          // Aplicar el movimiento escalado por la velocidad
          movement.multiplyScalar(this.data.speed);

          // Obtener la posición actual y aplicar el movimiento
          const currentPosition = this.rig.object3D.position;
          this.rig.object3D.position.set(
            currentPosition.x + movement.x,
            currentPosition.y,
            currentPosition.z + movement.z
          );
        }
      }
    });
  }
});
document.querySelector('#cameraRig').setAttribute('controller-movement', '');





// ** Configuración inicial y eventos adicionales **
function initScene() {
  setupControls();
  addModelChangeListeners();
  changePlaneModel();
}

document.addEventListener('DOMContentLoaded', initScene);


// ** Manejo de audio **

// Variable para controlar el estado del contexto de audio
let audioContextResumed = false;

// Activar el contexto de audio con una interacción del usuario
function resumeAudioContext() {
  if (!audioContextResumed) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    audioContextResumed = true;
    console.log('AudioContext resumed');
  }
}

// Configurar evento para asegurar que el contexto de audio se active al interactuar
function setupAudioInteraction() {
  document.querySelector('a-scene').addEventListener('click', resumeAudioContext);
}

// Reproducir sonido asociado al avión
function setupPlaneSound() {
  const plane = document.querySelector('#planeEntity');
  const planeSound = document.querySelector('#planeASound');

  plane.addEventListener('click', () => {
    if (audioContextResumed) {
      planeSound.play();
      console.log('Plane sound played');
    }
  });
}

// ** Manejo de animaciones del avión **

// Configurar la lógica de animaciones específicas del avión
function setupPlaneAnimations() {
  const plane = document.querySelector('#planeEntity');

  // Al completar la desaparición, mover el avión a una esquina y hacerlo visible
  plane.addEventListener('animationcomplete__disappear', function () {
    setAttributes(this, {
      position: '-500 -200 -300',
      visible: true
    });
    console.log('Plane repositioned after animation');
  });
}

// ** Botón de reset de cámara **

// Configuración del botón para regresar la cámara al origen
function setupResetButton() {
  document.querySelector('#resetButton').addEventListener('click', () => {
    const cameraRig = document.querySelector('#cameraRig');
    const camera = document.querySelector('#camera');

    setAttributes(cameraRig, { position: '0 1.6 0', rotation: '0 0 0' });
    camera.removeAttribute('look-controls');
    camera.setAttribute('look-controls', '');

    console.log('Camera position and rotation reset');
  });
}

// ** Inicialización completa de la escena **

function initScene() {
  // Configurar controles según la plataforma
  setupControls();

  // Configurar interacción con modelos de avión
  addModelChangeListeners();
  changePlaneModel();

  // Configurar interacción de audio
  setupAudioInteraction();
  setupPlaneSound();

  // Configurar animaciones del avión
  setupPlaneAnimations();

  // Configurar botón de reset
  setupResetButton();
}



// Iniciar escena al cargar el DOM
document.addEventListener('DOMContentLoaded', initScene);
window.addEventListener('gamepadconnected', setupControls);
window.addEventListener('gamepaddisconnected', setupControls);





