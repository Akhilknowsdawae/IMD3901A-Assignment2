AFRAME.registerComponent('forge-pad-trigger', {
    schema: {
      padId: { type: 'string', default: 'forgePad' },  // ID of the trigger pad
      requiredIngotClass: { type: 'string', default: 'ingot' }  // Required CSS class on the ingot object
    },
  
    init: function () {
      // Get the pad and player references.
      this.pad = document.querySelector(`#${this.data.padId}`);
      this.player = document.querySelector('#mainCam');
  
      // Check on every tick if the player is delivering an ingot.
      this.el.sceneEl.addEventListener('tick', () => {
        this.checkPlayerOnPad();
      });
    },
  
    checkPlayerOnPad: function () {
      // Use the global held item set by the pickupable component.
      let heldItem = AFRAME.utils.entityHeld;
      if (!heldItem) return;  // Player isn’t holding any item.
  
      // Check if the held item is an ingot by testing for the required class.
      if (!heldItem.classList.contains(this.data.requiredIngotClass)) return;
  
      // Ensure the held ingot is attached to the main camera.
      // We check if the heldItem's Three.js object is part of the main camera's object3D.
      if (!this.player.object3D.getObjectById(heldItem.object3D.id)) {
        // The ingot is not attached to the main camera; do not process it.
        return;
      }
  
      // Get the world positions of the player and the forge pad.
      let playerPos = new THREE.Vector3();
      this.player.object3D.getWorldPosition(playerPos);
  
      let padPos = new THREE.Vector3();
      this.pad.object3D.getWorldPosition(padPos);
  
      // Calculate the distance between the player and the pad.
      let distance = playerPos.distanceTo(padPos);
  
      // If the player is close enough, process the ingot.
      if (distance < 1.0) {
        console.log("Ingot delivered to the forge!");
  
        // Remove the ingot from the scene.
        heldItem.parentNode.removeChild(heldItem);
        AFRAME.utils.entityHeld = null;
  
        // Increment the ingot count
        window.ingotCount++;
  
        // When two ingots have been delivered, spawn the final object.
        if (window.ingotCount >= 2) {
          spawnBrightBox();  // Call the function to spawn thingy.
          window.ingotCount = 0;  // Reset the ingot count.
        }
      }
    }
  });
  
   /*
   Example function to spawn the final item.
   */
  function spawnBrightBox() {
    console.log("Spawning the final object (bright box)!");
    let sceneEl = document.querySelector('a-scene');
  
    let brightBox = document.createElement('a-box');
    brightBox.setAttribute('id', 'brightBox');
    brightBox.setAttribute('color', '#ffff00');
    brightBox.setAttribute('position', '0 1 -3');
    brightBox.setAttribute('depth', '1');
    brightBox.setAttribute('height', '1');
    brightBox.setAttribute('width', '1');
    sceneEl.appendChild(brightBox);
  }
  