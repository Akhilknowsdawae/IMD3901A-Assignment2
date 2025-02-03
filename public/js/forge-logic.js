AFRAME.registerComponent('forge-pad-trigger', {
    schema: {
        padId: { type: 'string', default: 'forgePad' },  // ID of the trigger pad
        requiredIngotClass: { type: 'string', default: 'ingot' }  // Class for the ingot object
    },

    init: function () {
        // Get the pad and player references
        this.pad = document.querySelector(`#${this.data.padId}`);
        this.player = document.querySelector('#mainCam');

        // Make sure the player is interacting with the pad
        this.el.sceneEl.addEventListener('tick', () => {
            this.checkPlayerOnPad();
        });
    },

    checkPlayerOnPad: function () {
        if (!window.heldItem) return;  // Ensure the player is holding an item

        // Get positions of the player and the pad
        let playerPos = new THREE.Vector3();
        this.player.object3D.getWorldPosition(playerPos);

        let padPos = new THREE.Vector3();
        this.pad.object3D.getWorldPosition(padPos);

        // Calculate the distance between player and pad
        let distance = playerPos.distanceTo(padPos);

        // If player is near the pad and holding an ingot, process the logic
        if (distance < 1.0 && window.heldItem.classList.contains(this.data.requiredIngotClass)) {
            console.log("Ingot delivered to the forge!");

            // Remove the ingot
            window.heldItem.parentNode.removeChild(window.heldItem);
            window.heldItem = null;

            // Increment the ingot count
            window.ingotCount = (window.ingotCount || 0) + 1;

            // If two ingots have been delivered, spawn the sword
            if (window.ingotCount >= 2) {
                spawnBrightBox();  // Spawn the final item (bright box or any model)
                window.ingotCount = 0;  // Reset the ingot count after giving out the sword
            }
        }
    }
});