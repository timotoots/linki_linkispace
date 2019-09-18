  
int currentState[5] = {-1,-1,-1,-1,-1};

#include "CommandLine.h"

  void
  setup() {
    Serial.begin(115200);
    Serial.println("START");
    setup_encoder();
    setup_matrix();
    setup_touch();
    setup_rgb();
  }

int matrix_display = -1;


bool parse_command(char * commandLine) {

  char * ptrToCommandName = strtok(commandLine, delimiters);

  if (strcmp(ptrToCommandName, "led") == 0) {
     int led_id = readNumber();
     int led_red = readNumber();
     int led_green = readNumber();
     int led_blue = readNumber();
  
    Serial.print("Led set ID=");
    Serial.print(led_id);
    Serial.print(" ");     
    Serial.print(led_red);
    Serial.print(":");    
    Serial.print(led_green);
    Serial.print(":");  
    Serial.println(led_blue);

    change_led(led_id, led_red, led_green, led_blue);

            
  } else {
    if (strcmp(ptrToCommandName, "matrix") == 0) {
      matrix_display = readNumber();
      Serial.print("Matrix set to ");
      Serial.println(matrix_display);
       
    } else {
     // nullCommand(ptrToCommandName);
    }
  }
}

  void loop() {

    loop_encoder();
    loop_matrix();
    loop_pot();
    
    bool received = getCommandLineFromSerialPort(CommandLine);      //global CommandLine is defined in CommandLine.h
    if (received) parse_command(CommandLine);
    
  }


  /*

void loop() {

  while (Serial.available() > 0) {

    int newState[5] = {0,0,0,0,0};

    for (int i=0;i<5;i++){
      newState[i] = Serial.parseInt();  
         Serial.print(newState[i]);
    }
    
    if (Serial.read() == '\n') {
      Serial.println("batch done");
     }
   
  } // while
  
} // loop
*/
