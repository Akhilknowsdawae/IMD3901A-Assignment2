//Code built upon: https://glitch.com/~aframe-basic-object-pickup-release

AFRAME.registerComponent('pickupable', {
    init: function () {
        var self = this;
        self.player = document.querySelector('#mainCam');  // Camera/player
        self.pickedUp = false;
        self.originalRotation = null;   // Store original rotation
        self.originalScale = null;      // Store original scale

        self.pickupSound = document.querySelector('#pickupSound'); //Pickup sound

        // Global reference for currently held item
        if (!AFRAME.utils.entityHeld) {
            AFRAME.utils.entityHeld = null;
        }

        // Ensure object is interactive for raycasting
        if (!self.el.classList.contains('interactive')) {
            self.el.classList.add('interactive');
        }

        self.el.addEventListener('click', function () {
            if (self.pickedUp) {
                // Drop item
                console.log("Dropped:", self.el.id);
                self.el.sceneEl.object3D.attach(self.el.object3D);  // Keep world transforms

                // Restore previous rotation
                self.el.object3D.rotation.set(
                    self.originalRotation.x,
                    self.originalRotation.y,
                    self.originalRotation.z
                );

                // Restore previous scale
                self.el.object3D.scale.set(
                    self.originalScale.x,
                    self.originalScale.y,
                    self.originalScale.z
                );

                self.pickedUp = false;
                AFRAME.utils.entityHeld = null;  // Clear global reference
            } 
            else if (AFRAME.utils.entityHeld === null) { // Only pick up if no item is held
                // Store rotation & scale before picking up
                self.originalRotation = self.el.object3D.rotation.clone();
                self.originalScale = self.el.object3D.scale.clone();

                // Pick up item
                console.log("Picked up:", self.el.id);
                self.player.object3D.attach(self.el.object3D);
                self.pickedUp = true;
                AFRAME.utils.entityHeld = self.el;  // Set global reference

                self.pickupSound.play();
            }
        });

        // Hover effect (increase scale by 0.2)
        self.el.addEventListener('mouseenter', function () {
            if (!self.pickedUp) {  // Only change scale if not picked up
                self.originalScale = self.el.object3D.scale.clone();  // Store scale before hover
                self.el.object3D.scale.set(
                    self.originalScale.x + 0.2,
                    self.originalScale.y + 0.2,
                    self.originalScale.z + 0.2
                );
            }
        });

        self.el.addEventListener('mouseleave', function () {
            if (!self.pickedUp) {  // Only restore scale if not picked up
                self.el.object3D.scale.set(
                    self.originalScale.x,
                    self.originalScale.y,
                    self.originalScale.z
                );
            }
        });
    }
});
