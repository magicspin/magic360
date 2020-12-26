var count = 0;
            var avoid = []; 
            var num = [5, 15, 50];  
            var opt = 0;
            var stopAt = 0;
            // Create new wheel object specifying the parameters at creation time.
            let theWheel = new Winwheel({
                'outerRadius'     : 310,        // Set outer radius so wheel fits inside the background.
                'innerRadius'     : 95,         // Make wheel hollow so segments don't go all way to center.
                'textFontSize'    : 24,         // Set default font size for the segments.
                'textOrientation' : 'curved', // Make text vertial so goes down from the outside of wheel.
                'textAlignment'   : 'center',    // Align text to outside of wheel.
                'numSegments'     : 8,         // Specify number of segments.
                'segments'        :             // Define segments including colour and text.
                [  
                   {'fillStyle' : '#f6989d', 'text' : '5'},
                   {'fillStyle' : '#f26522', 'text' : '100'},
                   {'fillStyle' : '#3cb878', 'text' : '75'},
                   {'fillStyle' : '#00cef0', 'text' : '15'},
                   {'fillStyle' : '#a186be', 'text' : '200'},
                   {'fillStyle' : '#fff200', 'text' : '50'},
                   {'fillStyle' : '#00aef0', 'text' : '20'},
                   {'fillStyle' : '#ffffff', 'text' : '150'}
                ],
                'animation' :           // Specify the animation to use.
                {
                    'type'     : 'spinToStop',
                    'duration' : 10,    // Duration in seconds.
                    'spins'    : 6,     // Default number of complete spins.
                    'callbackFinished' : alertPrize,
                    'callbackSound'    : playSound,   // Function to call when the tick sound is to be triggered.
                    'soundTrigger'     : 'pin'        // Specify pins are to trigger the sound, the other option is 'segment'.
                },
                'pins' :				// Turn pins on.
                {
                    'number'     : 8,
                    'outerRadius': 0,
                }
               
            });

            // Loads the tick audio sound in to an audio object.
            let audio = new Audio('tick.mp3');

            // This function is called when the sound is to be played.
            function playSound()
            {
                // Stop and rewind the sound if it already happens to be playing.
                audio.pause();
                audio.currentTime = 0;

                // Play the sound.
                audio.play();
            }

            // Vars used by the code in this page to do power controls.
            let wheelPower    = 0;
            let wheelSpinning = false;

            // -------------------------------------------------------
            // Function to handle the onClick on the power buttons.
            // -------------------------------------------------------
           

            // -------------------------------------------------------
            // Click handler for spin button.
            // -------------------------------------------------------
            function startSpin()
            {
                // Ensure that spinning can't be clicked again while already running.
                if (count<3){
                if (wheelSpinning == false) {
                    // Based on the power level selected adjust the number of spins for the wheel, the more times is has
                    // to rotate with the duration of the animation the quicker the wheel spins.
                    if (wheelPower == 1) {
                        theWheel.animation.spins = 3;
                    } else if (wheelPower == 2) {
                        theWheel.animation.spins = 6;
                    } else if (wheelPower == 3) {
                        theWheel.animation.spins = 10;
                    }
                    
                    // Disable the spin button so can't click again while wheel is spinning.
                    document.getElementById('spin_button').src       = "spin_off.png";
                    document.getElementById('spin_button').className = "";
                    while(true){
                        var opt = num[Math.floor(Math.random()*num.length)];
                        if(avoid.indexOf(opt)<0){
                            if(opt == 5 ){
                                avoid.push(opt)
                                stopAt = (3 + Math.floor((Math.random() * 43)))
                            }
                            else if(opt == 15 ){
                                avoid.push(opt)
                                stopAt = (139 + Math.floor((Math.random() * 43)))
                            }
                            else if(opt == 50 ){
                                avoid.push(opt)
                                stopAt = (229 + Math.floor((Math.random() * 43)))
                            }
                            console.log(stopAt)
                            break;
                        }
                        

                    }    
 
                    // Important thing is to set the stopAngle of the animation before stating the spin.
                    theWheel.animation.stopAngle = stopAt;
 
                    // Begin the spin animation by calling startAnimation on the wheel object.
                    theWheel.startAnimation();

                    // Set to true so that power can't be changed and spin button re-enabled during
                    // the current animation. The user will have to reset before spinning again.
                    wheelSpinning = true;
                    count = count+1;
                }
                }
                else{
                    alert('Sorry you ran out of turns');
                }
            }

            // -------------------------------------------------------
            // Function for reset button.
            // -------------------------------------------------------
            function resetWheel()
            {
                theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
                theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
                theWheel.draw();                // Call draw to render changes to the wheel.

                document.getElementById('pw1').className = "";  // Remove all colours from the power level indicators.
                document.getElementById('pw2').className = "";
                document.getElementById('pw3').className = "";

                wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
            }

            // -------------------------------------------------------
            // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
            // -------------------------------------------------------
            function alertPrize(indicatedSegment)
            {
                // Just alert to the user what happened.
                // In a real project probably want to do something more interesting than this with the result.
                if (indicatedSegment.text == 'LOOSE TURN') {
                    alert('Sorry but you loose a turn.');
                } else if (indicatedSegment.text == 'BANKRUPT') {
                    alert('Oh no, you have gone BANKRUPT!');
                } else {
                    $("#myDialog").modal("show");
                    $("#myDialog .won").html( indicatedSegment.text);
                    //alert("You have won " + indicatedSegment.text);
                }
                theWheel.stopAnimation(false);  // Stop the animation, false as param so does not call callback function.
                theWheel.rotationAngle = 0;     // Re-set the wheel angle to 0 degrees.
                theWheel.draw();                // Call draw to render changes to the wheel.

                document.getElementById('spin_button').src       = "spin_on.png";
                document.getElementById('spin_button').className = "clickable";
                wheelSpinning = false;          // Reset to false to power buttons and spin can be clicked again.
            }
