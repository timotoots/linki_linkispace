// Program to demonstrate the MD_Parola library
//
// Simplest program that does something useful - Hello World!
//
// MD_MAX72XX library can be found at https://github.com/MajicDesigns/MD_MAX72XX
//

#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

// Define the number of devices we have in the chain and the hardware interface
// NOTE: These pin numbers will probably not work with your hardware and may
// need to be adapted
// need to be adapted
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW
#define MAX_DEVICES 1

int CLK_PIN =  17;  // or SCK
int DATA_PIN = 18;  // or MOSI
int CS_PIN  =  5;  // or SS


// Hardware SPI connection
//MD_Parola P = MD_Parola(HARDWARE_TYPE, CS_PIN, MAX_DEVICES);
// Arbitrary output pins
 MD_Parola P = MD_Parola(HARDWARE_TYPE, DATA_PIN, CLK_PIN, CS_PIN, MAX_DEVICES);

void setup_matrix(void)
{
  P.begin();
  
  }



void loop_matrix(void)
{
    char b[2]; 
    // int i =  random(9);
     int i = matrix_display;
     if(i>-1 && i<10){
       String str;
       str=String(i);
       str.toCharArray(b,2); 
       P.displayText(b, PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
       P.displayAnimate();
     } else {
       P.displayText("", PA_CENTER, 0, 0, PA_PRINT, PA_NO_EFFECT);
       P.displayAnimate();
     }
    

}
