#include <FastLED.h>

// How many leds in your strip?
#define NUM_LEDS 5
#define DATA_PIN 16

// Define the array of leds
CRGB leds[NUM_LEDS];

void setup_rgb() { 
   FastLED.addLeds<WS2812, DATA_PIN, RGB>(leds, NUM_LEDS);
   for(int i=0;i<NUM_LEDS;i++){
      leds[i] = CRGB::Black;
      FastLED.show();
   }
}

void change_led(int id, int red, int green, int blue){


  if(id<=NUM_LEDS){
     leds[id] =  CRGB(red,green,blue);
     FastLED.show();
     Serial.println("led done");
  }
    
}

void loop_rgb() { 
  
  FastLED.setBrightness(  10 );

  for(int i=0;i<NUM_LEDS;i++){


    leds[i] = CRGB::Red;
    FastLED.show();
    delay(500);
    leds[i] = CRGB::Green;
    FastLED.show();
    delay(500);  // Now turn the LED off, then pause
    leds[i] = CRGB::Blue;
    FastLED.show();
    delay(500);

    
  }

    for(int i=0;i<NUM_LEDS;i++){
      
      leds[i] = CRGB::Black;
      FastLED.show();

    }
       delay(1000);
  
}
