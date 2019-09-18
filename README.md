# Linkispace
A prototype of spacial audio mixer.

For self-documentation.

## Controller hardware

* Lolin D32
https://wiki.wemos.cc/products:d32:d32

* Encoders

* XY potentiometer joystick
* 8x8 LED matrix
* RGB LED


## Controller software


* Install libraries in Arduino IDE:

https://github.com/mprograms/SimpleRotary
https://github.com/MajicDesigns/MD_MAX72XX
https://github.com/MajicDesigns/MD_Parola
https://github.com/FastLED/FastLED

* Flash ESP32 in Arduino IDE

## Software for Ubuntu

* Install Soundspace 
https://github.com/arneg/soundspace

* Install nodejs
```
sudo apt-get install nodejs npm
```

* Install required node modules

```
npm i
```
* Allow user to access USB serial port
```
sudo usermod -a -G dialout username
```
