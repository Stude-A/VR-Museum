

 
 // Array de modelos de aviones con sus propiedades
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
          scale: '30 30 30 ',
          title: 'B-2 Spirit',
          description: 'The B-2 Spirit is a stealth bomber. Its special design makes it almost undetectable by radar, allowing it to attack enemy targets without being detected.'
        }
      ];

      //B2 Spirit: The B-2 Spirit is a stealth bomber. Its special design makes it almost undetectable by radar, allowing it to attack enemy targets without being detected.

      let currentModelIndex = 1;

      // Función para cambiar el modelo del avión
      function changePlaneModel() {
        const planeEntity = document.querySelector('#planeEntity');
        const model = planeModels[currentModelIndex];
        planeEntity.setAttribute('obj-model', `obj: #${model.id}; mtl: #${model.material}`);
        planeEntity.setAttribute('position', model.position);
        planeEntity.setAttribute('rotation', model.rotation);
        planeEntity.setAttribute('scale', model.scale);

        // Actualizar título y descripción
        document.querySelector('#planeTitle').setAttribute('value', model.title);
        document.querySelector('#planeDescription').setAttribute('value', model.description);

        console.log(model.title, 'model loaded');
      }

      // Agregar eventos de clic a los botones para cambiar el modelo del avión
      document.querySelector('#prevButton').addEventListener('click', function () {
        currentModelIndex = (currentModelIndex - 1 + planeModels.length) % planeModels.length;
        changePlaneModel();
        console.log('Modelo de avión cambiado a:', planeModels[currentModelIndex].id);
      });

      document.querySelector('#nextButton').addEventListener('click', function () {
        currentModelIndex = (currentModelIndex + 1) % planeModels.length;
        changePlaneModel();
        console.log('Modelo de avión cambiado a:', planeModels[currentModelIndex].id);
      });

      // Agregar eventos de clic a los botones para cambiar el modelo del avión
      document.querySelector('#prevButton').addEventListener('click', function () {
        changePlaneModel('planeModelB2', 'planeMaterialB2');
        console.log('Modelo de avión cambiado a B2');
      });

      document.querySelector('#nextButton').addEventListener('click', function () {
        changePlaneModel('planeModelB2', 'planeMaterialB2');
        console.log('Modelo de avión cambiado a B2');
      });

      // Agregar evento de clic al botón de regresar al origen
      document.querySelector('#resetButton').addEventListener('click', function () {
        const cameraRig = document.querySelector('#cameraRig');
        const camera = document.querySelector('#camera');
        cameraRig.setAttribute('position', '0 1.6 0');
        cameraRig.setAttribute('rotation', '0 0 0');
        camera.removeAttribute('look-controls');
        camera.setAttribute('look-controls', '');
        console.log('Botón de regresar al origen clicado, posición de la cámara restablecida');
      });


 // Detect if the user is using Meta Quest
 const isMetaQuest = /OculusBrowser/.test(navigator.userAgent);

 function checkGamepad() {
   const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
   for (let i = 0; i < gamepads.length; i++) {
     if (gamepads[i] && gamepads[i].id.includes('Xbox')) {
       return true;
     }
   }
   return false;
 }

 function setupControls() {
   if (isMetaQuest) {
     // Add cursor to Meta Quest controllers
     document.querySelector('#leftHand').innerHTML = '<a-cursor raycaster="objects: .clickable" fuse="false"></a-cursor>';
     document.querySelector('#rightHand').innerHTML = '<a-cursor raycaster="objects: .clickable" fuse="false"></a-cursor>';
   } else if (checkGamepad()) {
     // Add cursor to the camera for Xbox controller
     document.querySelector('#camera').innerHTML = '<a-cursor raycaster="objects: .clickable" fuse="false"></a-cursor>';
     document.querySelector('#cameraRig').setAttribute('gamepad-controls', 'enabled: true');
   } else {
     // Add cursor to the camera for PC
     document.querySelector('#camera').innerHTML = '<a-cursor raycaster="objects: .clickable" fuse="false"></a-cursor>';
   }
 }

 window.addEventListener('gamepadconnected', setupControls);
 window.addEventListener('gamepaddisconnected', setupControls);
 setupControls();




 // Primero, vamos a crear un evento que inicie el contexto de audio en cuanto el usuario interactúe
 let audioContextResumed = false;

// Función para activar el contexto de audio cuando el usuario haga clic
function resumeAudioContext() {
  if (!audioContextResumed) {
    // Activamos el contexto de audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    audioContext.resume();
    audioContextResumed = true;
    console.log('AudioContext resuming...');
  }
}

// Este evento de clic asegura que el AudioContext se reanude cuando el usuario haga clic en cualquier parte de la escena
document.querySelector('a-scene').addEventListener('click', resumeAudioContext);

// Reproducir sonido al hacer clic en el avión
const plane = document.querySelector('#planeEntity');
const planeSound = document.querySelector('#planeASound');
plane.addEventListener('click', function () {
  // Reproducir el sonido solo después de que el AudioContext haya sido activado
  if (audioContextResumed) {
    planeSound.play();
    console.log('Sonido del avión reproducido');
  }
});

//Al completar la desaparición, reaparecer en la esquina inferior izquierda
plane.addEventListener('animationcomplete__disappear', function () {
  this.setAttribute('position', '-500 -200 -300'); // Mover a la esquina
  this.setAttribute('visible', true);          // Hacerlo visible
});

      // Inicializar el modelo del avión basado en currentModelIndex
      changePlaneModel();