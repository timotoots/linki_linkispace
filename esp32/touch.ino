/*
  Flopper ESP32 / Toiúuch
  
  This software is released under the MIT License.
  https://opensource.org/licenses/MIT
*/


///////////////////////////////////////////////////////////////////

#define PIN_TOUCH_UNLOAD_THIS 0
#define PIN_TOUCH_UNLOAD_ALL 2
#define PIN_TOUCH_PAUSE 14
#define PIN_TOUCH_REWIND 15
#define PIN_TOUCH_CENTER 4
#define PIN_TOUCH_CCW 12
#define PIN_TOUCH_CW 13

unsigned long last_touch[7] = {0,0,0,0,0,0,0};
int touch_pins[7] = {0,2,14,15,4,12,13};
String touch_labels[7] = { "UNLOAD_THIS","UNLOAD_ALL","PAUSE","REWIND","CENTER","CCW","CW"};

int threshold = 40;

void checkMillis(int id){

   unsigned long interrupt_time = millis();
   
   if (interrupt_time - last_touch[id] > 500){
      Serial.print("TOUCH:");
      Serial.println(touch_labels[id]);
 
   }
   last_touch[id] = interrupt_time;

}


void touch_act0(){
  checkMillis(0);
}

void touch_act1(){
  checkMillis(1);
}

void touch_act2(){
  checkMillis(2);
}

void touch_act3(){
  checkMillis(3);
}

void touch_act4(){
  checkMillis(4);
}

void touch_act5(){
  checkMillis(5);
}

void touch_act6(){
  checkMillis(6);
}



void setup_touch() {
   
  //touchAttachInterrupt(touch_pins[0], touch_act0, threshold);
  touchAttachInterrupt(touch_pins[1], touch_act1, threshold);
  touchAttachInterrupt(touch_pins[2], touch_act2, threshold);
  touchAttachInterrupt(touch_pins[3], touch_act3, threshold);
  touchAttachInterrupt(touch_pins[4], touch_act4, threshold);
  touchAttachInterrupt(touch_pins[5], touch_act5, threshold);
  touchAttachInterrupt(touch_pins[6], touch_act6, threshold);


}

/*
void setup(){
  Serial.begin(115200);
  setup_touch();
}

void loop(){
  
}
*/
