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
int touch_history = -1;
int touch_history2 = -1;

unsigned long last_touch_time = 0;

int touch_pins[7] = {27,2,14,15,4,12,13};
String touch_labels[7] = { "UNLOAD_THIS","UNLOAD_ALL","PAUSE","REWIND","CENTER","CCW","CW"};
int touch_status[7] = {0,0,0,0,0,0,0};

int threshold = 30;
int wait_for_touch = 1;

void checkMillis(int id){


      unsigned long interrupt_time = millis();
     
     if (interrupt_time - last_touch_time > 300){
        touch_status[id] = 1;
        last_touch_time = interrupt_time;
        last_touch[id] = interrupt_time;
     }

   

 
      


}


void touch_act0(){
  if(wait_for_touch==1){
  touch_status[0] = 1;
  }
}

void touch_act1(){
    if(wait_for_touch==1){

  touch_status[1] = 1;
    }
}

void touch_act2(){
    if(wait_for_touch==1){

  touch_status[2] = 1;
    }
}

void touch_act3(){
    if(wait_for_touch==1){

  touch_status[3] = 1;
    }
}

void touch_act4(){
    if(wait_for_touch==1){

  touch_status[4] = 1;
    }
}

void touch_act5(){
    if(wait_for_touch==1){

  touch_status[5] = 1;
    }
}

void touch_act6(){
    if(wait_for_touch==1){

  touch_status[6] = 1;
    }
}



void setup_touch() {
   
  touchAttachInterrupt(touch_pins[0], touch_act0, threshold);
  touchAttachInterrupt(touch_pins[1], touch_act1, threshold);
  touchAttachInterrupt(touch_pins[2], touch_act2, threshold);
  touchAttachInterrupt(touch_pins[3], touch_act3, threshold);
  touchAttachInterrupt(touch_pins[4], touch_act4, threshold);
  touchAttachInterrupt(touch_pins[5], touch_act5, threshold);
  touchAttachInterrupt(touch_pins[6], touch_act6, threshold);


}

void loop_touch(void * parameter){

      unsigned long interrupt_time = millis();

      for(int i=0;i<7;i++){
        if(touch_status[i]==1){
          wait_for_touch = 0;
          
           Serial.print("TOUCH:");
           Serial.println(touch_labels[i]);

           delay(300);
            for(int j=0;j<7;j++){
            touch_status[j]=0;
           }

          wait_for_touch = 1;
   
        }
      }
      delay(100);
      loop_touch(NULL);
}
/*
void setup(){
  Serial.begin(115200);
  setup_touch();
}

void loop(){
  
}
*/
