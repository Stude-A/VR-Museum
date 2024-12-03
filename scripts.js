// ** Modelos de aviones y selección **

const planeModels = [
  {
    id: 'planeModel',
    material: 'planeMaterial',
    position: '0 10 -300',
    rotation: '-110 90 -90',
    scale: '0.1 0.1 0.1',
    title: 'Airbus A380',
    description: 'The Airbus A380 is the world\'s largest passenger aircraft, capable of carrying hundreds of passengers in a single flight, offering a unique travel experience.',
    audio: 'Modelos/Planes/L1 Plane/Run That Race.mp3'
  },
  {
    id: 'planeModelB2',
    material: 'planeMaterialB2',
    position: '0 15 -300',
    rotation: '-25 90 0',
    scale: '30 30 30',
    title: 'B-2 Spirit',
    description: 'The B-2 Spirit is a stealth bomber. Its special design makes it almost undetectable by radar, allowing it to attack enemy targets without being detected.',
    audio: 'Modelos/Planes/B2/U.S Navy - Danger Zone  Carrier Deck Ops.mp3'
  }, {
    id: 'planeModelB737',
    material: 'planeMaterialB737',
    position: '0 -5 -300',
    rotation: '-20 90 0',
    scale: '7 7 7 ',
    title: 'Boeing 737',
    description: ' The Boeing 737 is a short to medium-range commercial airplane, one of the most popular and best-selling in the history of aviation.',
    audio: 'Modelos/Planes/Boeing 737/Top Gun Anthem - Music Video (Tom Cruise Maverick).mp3'
  }
  ,
  {
    id: 'planeModelP-51glb',
    position: '0 -5 -300',
    rotation: '-5 90 0',
    scale: '3 3 3',
    title: 'P-51 Mustang',
    description: 'The P-51 Mustang is a historic World War II fighter known for its speed and agility.',
    audio: 'Modelos/Planes/P-51 Mustang/Mute City Ver. 2 (Brawl Remix).mp3'
  }
];

let currentModelIndex = Math.floor(Math.random() * planeModels.length);
let audioPlayer = new Audio();
audioPlayer.loop = true;


// Función genérica para actualizar atributos de un elemento
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(attr => element.setAttribute(attr, attributes[attr]));
}

function changePlaneModel(index = currentModelIndex) {
  const planeEntity = document.querySelector('#planeEntity');
  const model = planeModels[index];

  if (index < 0 || index >= planeModels.length) return;

  const currentTime = audioPlayer.currentTime;
  const newModel = planeModels[index];

  audioPlayer.src = newModel.audio;
  audioPlayer.currentTime = currentTime;
  audioPlayer.play();

  currentModelIndex = index;

  // Eliminar el modelo anterior
  while (planeEntity.firstChild) {
    planeEntity.removeChild(planeEntity.firstChild);
  }

  // ** Elimina atributos conflictivos antes de agregar uno nuevo **
  planeEntity.removeAttribute('obj-model');
  planeEntity.removeAttribute('gltf-model');

  // Detectar si el modelo es .glb
  if (model.id.endsWith('glb')) { // Ajusta esta condición si usas otro criterio
    console.log((model.id));
    planeEntity.setAttribute('gltf-model', `#${model.id}`);
  } else {
    planeEntity.setAttribute('obj-model', `obj: #${model.id}; mtl: #${model.material}`);
  }

  // Establecer atributos comunes
  setAttributes(planeEntity, {
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



AFRAME.registerComponent('controller-movement', {
  schema: { speed: { type: 'number', default: 0.6 } },

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
          // Obtener la dirección en la que está mirando la cámara
          const cameraWorldDirection = new THREE.Vector3();
          this.camera.object3D.getWorldDirection(cameraWorldDirection);
          cameraWorldDirection.normalize(); // Normalizar la dirección hacia adelante

          // Obtener la dirección lateral (cruzada con el eje Y global)
          const strafeDirection = new THREE.Vector3().crossVectors(cameraWorldDirection, new THREE.Vector3(0, 1, 0)).normalize();

          // Inicializar el vector de movimiento
          let movement = new THREE.Vector3();

          // Calcular el movimiento en función de los controles
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

document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.querySelector('#soundButton');
  const playButtonText = document.querySelector('#soundButtonText');
  let isMuted = false;

  playButton.addEventListener('click', () => {
    if (isMuted) {
      audioPlayer.muted = false;
      playButtonText.setAttribute('value', 'Mute');
    } else {
      audioPlayer.muted = true;
      playButtonText.setAttribute('value', 'Unmute');
    }
    isMuted = !isMuted;
  });
});





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





