AFRAME.registerComponent('activate-molten', {
    schema: {
        fadeDuration: { type: 'number', default: 5000 } // Time in ms for fade-out effect
    },
    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.moltenButton = document.querySelector('#moltenButton');
        CONTEXT_AF.counterLeft = document.querySelector('#counter_left');

        CONTEXT_AF.moltenButton.addEventListener('click', function () {
            if (!document.querySelector('#moltenSurface')) {
                console.log('Activating molten surface...');

                // Create molten surface
                let moltenSurface = document.createElement('a-entity');
                moltenSurface.setAttribute('id', 'moltenSurface');
                moltenSurface.setAttribute('geometry', 'primitive:box; width:1.9; height:0.1; depth:0.9;');
                moltenSurface.setAttribute('material', 'color:#ff4500; emissive:#ff4500; emissiveIntensity:1.5;');
                moltenSurface.setAttribute('position', '0 0.65 0');

                CONTEXT_AF.counterLeft.appendChild(moltenSurface);

                // Start fade-out effect after 3 seconds
                setTimeout(() => CONTEXT_AF.fadeMolten(moltenSurface), 3000);
            } else {
                console.log('Molten surface already exists.');
            }
        });
    },
    
    fadeMolten: function (moltenSurface) {
        let fadeDuration = this.data.fadeDuration;
        let opacity = 1;
        let fadeInterval = 50; // Time interval for fading effect
        let decrement = fadeInterval / fadeDuration; // Opacity step

        let fadeEffect = setInterval(() => {
            opacity -= decrement;
            moltenSurface.setAttribute('material', `opacity: ${Math.max(opacity, 0)}`);

            if (opacity <= 0) {
                clearInterval(fadeEffect);
                moltenSurface.parentNode.removeChild(moltenSurface); // Remove molten surface
                this.spawnFinalModels(); // Spawn two final models
            }
        }, fadeInterval);
    },

    spawnFinalModels: function () {
        console.log('Spawning final models...');

        let model1 = document.createElement('a-entity');
        model1.setAttribute('id', 'finalMetal1');
        model1.setAttribute('gltf-model', '#iron');
        model1.setAttribute('scale', '6 6 6');
        model1.setAttribute('position', '-0.5 1 0');

        let model2 = document.createElement('a-entity');
        model2.setAttribute('id', 'finalMetal2');
        model2.setAttribute('gltf-model', '#iron');
        model2.setAttribute('scale', '6 6 6'); 
        model2.setAttribute('position', '0.5 1 0');

        //Pickup item attribute
        model1.setAttribute('pickupable', '');
        model2.setAttribute('pickupable', '');

        let counterLeft = document.querySelector('#counter_left');
        counterLeft.appendChild(model1);
        counterLeft.appendChild(model2);
    }
});