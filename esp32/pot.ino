/*
  Analog Input

  Demonstrates analog input by reading an analog sensor on analog pin 0 and
  turning on and off a light emitting diode(LED) connected to digital pin 13.
  The amount of time the LED will be on and off depends on the value obtained
  by analogRead().

  The circuit:
  - potentiometer
    center pin of the potentiometer to the analog input 0
    one side pin (either one) to ground
    the other side pin to +5V
  - LED
    anode (long leg) attached to digital output 13
    cathode (short leg) attached to ground

  - Note: because most Arduinos have a built-in LED attached to pin 13 on the
    board, the LED is optional.

  created by David Cuartielles
  modified 30 Aug 2011
  By Tom Igoe

  This example code is in the public domain.

  http://www.arduino.cc/en/Tutorial/AnalogInput
*/

int sensorPin1 = 34;    // select the input pin for the potentiometer
int sensorPin2 = 32;    // select the input pin for the potentiometer
int sensorValue1 = 0;  // variable to store the value coming from the sensor
int sensorValue2 = 0;  // variable to store the value coming from the sensor

#define TOLERANCE 10

int oldVal1 = 0;
int oldVal2 = 0;


void setup_pot() {
  Serial.begin(115200);
}

void loop_pot() {
  
  sensorValue1 = analogRead(sensorPin1);
  sensorValue2 = analogRead(sensorPin2);

  sensorValue1 = map(sensorValue1, 0, 4095, 0, 255);
  sensorValue2 = map(sensorValue2, 0, 4095, 255, 0);

  int diff1 = abs(sensorValue1 - oldVal1);
  int diff2 = abs(sensorValue2 - oldVal2);

  if(diff1 > TOLERANCE){
    oldVal1 = sensorValue1; // only save if the val has changed enough to avoid slowly drifting
    Serial.print("POTY:");
    Serial.println(sensorValue1);
  }     

  if(diff2 > TOLERANCE){
    oldVal2 = sensorValue2; // only save if the val has changed enough to avoid slowly drifting  
    Serial.print("POTX:");
    Serial.println(sensorValue2);
  }   
  
  
  
  
}
