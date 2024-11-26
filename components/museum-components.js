if (typeof AFRAME === 'undefined') {
    throw new Error('A-Frame must be loaded before this script.');
}

// Componente del entorno
AFRAME.registerComponent('museum-environment', {
    init: function() {
        // Crear el cilindro base
        this.cylinder = document.createElement('a-cylinder');
        this.cylinder.setAttribute('position', '0 -70 -300');
        this.cylinder.setAttribute('radius', '60');
        this.cylinder.setAttribute('height', '70');
        this.cylinder.setAttribute('color', '#FF0000');
        this.el.appendChild(this.cylinder);

        // Crear el plano de referencia
        this.plane = document.createElement('a-plane');
        this.plane.setAttribute('position', '0 -3 0');
        this.plane.setAttribute('rotation', '-90 0 0');
        this.plane.setAttribute('width', '10');
        this.plane.setAttribute('height', '10');
        this.plane.setAttribute('color', '#7BC8A4');
        this.plane.setAttribute('opacity', '0.5');
        this.el.appendChild(this.plane);

        // Crear la línea de referencia
        this.line = document.createElement('a-entity');
        this.line.setAttribute('line', {
            start: '-5 0 0',
            end: '5 0 0',
            color: '#000'
        });
        this.el.appendChild(this.line);
    }
});

// Componente del avión
AFRAME.registerComponent('museum-plane', {
    init: function() {
        this.planeEntity = document.createElement('a-entity');
        this.planeEntity.setAttribute('id', 'planeEntity');
        this.planeEntity.setAttribute('class', 'clickable');
        
        // Cargar el modelo 3D
        this.planeEntity.setAttribute('obj-model', {
            obj: '#planeModel',
            mtl: '#planeMaterial'
        });
        
        // Configurar posición inicial
        this.planeEntity.setAttribute('position', '0 10 -300');
        this.planeEntity.setAttribute('scale', '0.1 0.1 0.1');
        this.planeEntity.setAttribute('rotation', '-45 0 0');
        
        // Configurar animaciones
        this.planeEntity.setAttribute('animation__fly', {
            property: 'position',
            to: '900 240 -300',
            dur: 8000,
            easing: 'linear',
            startEvents: 'click'
        });

        this.planeEntity.setAttribute('animation__disappear', {
            property: 'visible',
            to: false,
            dur: 3,
            startEvents: 'animationcomplete__fly'
        });

        this.planeEntity.setAttribute('animation__reappear', {
            property: 'visible',
            to: true,
            dur: 2,
            startEvents: 'animationcomplete__disappear'
        });

        this.planeEntity.setAttribute('animation__return', {
            property: 'position',
            to: '0 10 -300',
            dur: 10000,
            easing: 'linear',
            startEvents: 'animationcomplete__reappear'
        });

        this.el.appendChild(this.planeEntity);
    }
});

// Componente de la cámara
AFRAME.registerComponent('museum-camera', {
    init: function() {
        // Crear el rig de la cámara
        this.cameraRig = document.createElement('a-entity');
        this.cameraRig.setAttribute('position', '0 1.6 0');
        this.cameraRig.setAttribute('wasd-controls', 'acceleration: 200');

        // Crear la cámara
        this.camera = document.createElement('a-entity');
        this.camera.setAttribute('camera', '');
        this.camera.setAttribute('look-controls', '');
        this.camera.setAttribute('position', '0 0 0');

        // Crear el cursor
        this.cursor = document.createElement('a-cursor');
        this.cursor.setAttribute('raycaster', 'objects: .clickable');
        this.cursor.setAttribute('fuse', false);

        // Ensamblar la cámara
        this.camera.appendChild(this.cursor);
        this.cameraRig.appendChild(this.camera);
        this.el.appendChild(this.cameraRig);
    }
});

// Componente del panel de información
AFRAME.registerComponent('museum-info-panel', {
    init: function() {
        // Crear el contenedor principal
        this.panel = document.createElement('a-entity');
        this.panel.setAttribute('position', '0 3 -5');

        // Crear el fondo del panel
        this.background = document.createElement('a-plane');
        this.background.setAttribute('position', '0 0.5 0');
        this.background.setAttribute('width', '4');
        this.background.setAttribute('height', '2');
        this.background.setAttribute('color', '#FFF');
        this.background.setAttribute('opacity', '0.7');

        // Crear el título
        this.title = document.createElement('a-text');
        this.title.setAttribute('value', 'Airbus 580');
        this.title.setAttribute('color', '#000');
        this.title.setAttribute('position', '0 0.75 0.01');
        this.title.setAttribute('align', 'center');
        this.title.setAttribute('width', '14');

        // Crear la descripción
        this.description = document.createElement('a-text');
        this.description.setAttribute('value', 'Largest Commercial plane as it has 4 turbines');
        this.description.setAttribute('color', '#000');
        this.description.setAttribute('position', '0 0.25 0.01');
        this.description.setAttribute('align', 'center');
        this.description.setAttribute('width', '4');

        // Ensamblar el panel
        this.panel.appendChild(this.background);
        this.panel.appendChild(this.title);
        this.panel.appendChild(this.description);
        this.el.appendChild(this.panel);
    }
});

// Componente de navegación
AFRAME.registerComponent('museum-navigation', {
    init: function() {
        // Crear los botones de navegación
        this.createButton('prevButton', '<', '-1.2 1.2 -2');
        this.createButton('nextButton', '>', '1.2 1.2 -2');
        this.createButton('resetButton', 'Reset', '-2 -1.5 -2.5', '#FF0000');
    },

    createButton: function(id, text, position, color = '#3114d1') {
        const button = document.createElement('a-circle');
        button.setAttribute('id', id);
        button.setAttribute('position', position);
        button.setAttribute('radius', id === 'resetButton' ? '0.2' : '0.3');
        button.setAttribute('color', color);
        button.setAttribute('class', 'clickable');
        button.setAttribute('look-at', '#camera');

        const buttonText = document.createElement('a-text');
        buttonText.setAttribute('value', text);
        buttonText.setAttribute('align', 'center');
        buttonText.setAttribute('position', '0 0 0.01');
        buttonText.setAttribute('color', '#FFF');
        buttonText.setAttribute('width', id === 'resetButton' ? '3' : '6');

        button.appendChild(buttonText);
        this.el.appendChild(button);
    }
});