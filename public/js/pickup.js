AFRAME.registerComponent('pickupable', {
    init: function () {
        this.el.classList.add('interactive'); // Make it detectable by the raycaster
    }
});

AFRAME.registerComponent('pickup-system', {
    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.camera = document.querySelector('#mainCam');
        CONTEXT_AF.raycaster = CONTEXT_AF.camera.querySelector('[raycaster]');
        CONTEXT_AF.heldItem = null;

        window.addEventListener('click', function (event) {
            if (event.button === 0) { // Left mouse button
                if (CONTEXT_AF.heldItem) {
                    CONTEXT_AF.dropItem();
                } else {
                    CONTEXT_AF.pickUpItem();
                }
            }
        });
    },

    pickUpItem: function () {
        const CONTEXT_AF = this;
        let intersections = CONTEXT_AF.raycaster.components.raycaster.intersections;

        console.log("Raycaster detected objects:", intersections);

        if (intersections.length > 0) {
            let item = intersections[0].object.el;
            if (item && item.classList.contains('interactive')) {
                console.log('Picked up:', item.id);
                CONTEXT_AF.heldItem = item;

                // Store original position for dropping later
                item.setAttribute('data-original-position', JSON.stringify(item.getAttribute('position')));

                // Attach to camera
                item.setAttribute('position', '0 -0.2 -0.5'); // holding position
                item.setAttribute('scale', '0.8 0.8 0.8'); // Slightly smaller if needed
                CONTEXT_AF.camera.appendChild(item);
            }
        }
    },

    dropItem: function () {
        const CONTEXT_AF = this;
        let item = CONTEXT_AF.heldItem;
        if (item) {
            console.log('Dropped:', item.id);
            
            // Detach from camera
            document.querySelector('a-scene').appendChild(item);
            
            // Reset position to original spot
            let originalPosition = JSON.parse(item.getAttribute('data-original-position'));
            item.setAttribute('position', `${originalPosition.x} ${originalPosition.y} ${originalPosition.z}`);

            CONTEXT_AF.heldItem = null;
        }
    }
});