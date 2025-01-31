AFRAME.registerComponent('spinning-effect', {
    schema: {
        duration : {type:'number', default:20000}   //duration is the time for one revolution and is in milliseconds
    },
    init : function() {
        //called when the component is first initialized (AFTER AFrame and the scene have been initialized)

        const CONTEXT_AF        = this;     //A reference to THIS component
        CONTEXT_AF.walls        = document.querySelector('#walls');
        CONTEXT_AF.isSpinning   = false;    //state of the spin

        //let's add the animation component in 25
        CONTEXT_AF.walls.setAttribute('animation', {    property: 'rotation.y', to:360, loop:true, easing:'linear',
                                                        dur:CONTEXT_AF.data.duration, enabled:false });

        //listen for click
        CONTEXT_AF.el.addEventListener('click', function(e) {
            if(CONTEXT_AF.isSpinning === true) {
                //stop spinning
                console.log('stop spinning');
                CONTEXT_AF.walls.setAttribute('animation', {enabled:false});
                CONTEXT_AF.isSpinning = false;
            }
            else {
                //start spinning
                console.log('start spinning');
                CONTEXT_AF.walls.setAttribute('animation', {enabled:true});
                CONTEXT_AF.isSpinning = true;
            }
        });
    }
});