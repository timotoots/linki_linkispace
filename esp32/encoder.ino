/*
===============================================================================================================
SimpleRotary.h Library Options Example Sketch
Learn more at [https://github.com/mprograms/SimpleRotary]

This example shows how to set various options.

===============================================================================================================
Release under the GNU General Public License v3
[https://www.gnu.org/licenses/gpl-3.0.en.html]
===============================================================================================================
*/
#include <SimpleRotary.h>

// Pin A, Pin B, Button Pin
SimpleRotary rotary1(26,19,7);
SimpleRotary rotary2(25,33,7);

  

void setup_encoder() {

  // Set the trigger to be either a HIGH or LOW pin (Default: HIGH)
  // Note this sets all three pins to use the same state.
  rotary1.setTrigger(HIGH);
  rotary2.setTrigger(HIGH);

  // Set the debounce delay in ms  (Default: 2)
  rotary1.setDebounceDelay(5);
  rotary2.setDebounceDelay(5);

  // Set the error correction delay in ms  (Default: 200)
  rotary1.setErrorDelay(50);
  rotary2.setErrorDelay(50);
 
}

void loop_encoder() {
  byte i;
  i = rotary1.rotate();
  
  if (i == 1) {
    Serial.println("ENC_VOLUME:UP");
  }
  
  if (i == 2) {
    Serial.println("ENC_VOLUME:DOWN");
  }
  
  i = rotary2.rotate();
  
  // Only print CW / CCW output to prevent an endless stream of output.
  if (i == 1) {
    Serial.println("ENC_SPEED:DOWN");
  }
  
  if (i == 2) {
    Serial.println("ENC_SPEED:UP");
  }
  
}
