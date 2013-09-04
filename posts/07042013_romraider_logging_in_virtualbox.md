{{{
  "title": "RomRaider Logging in VirtualBox",
  "date": "Thu Jul  4 14:09:56 EDT 2013"
}}}

Linux is not the most well supported OS for tuning and logging Subarus. [RomRaider](http://www.romraider.com/) does not support 64 bit JVMs, and [EcuFlash](http://www.tactrix.com/index.php?option=com_content&view=category&layout=blog&id=36&Itemid=58) does not have a native binary for Linux. So, in order to flash my wagon, I had to set up a Windows VM in VirtualBox. I had to tweak some things to get my [OpenPort 2.0](http://www.tactrix.com/index.php?page=shop.product_details&flypage=flypage.tpl&product_id=17&category_id=6&option=com_virtuemart&Itemid=53) to work correctly in the VM.

First, when you plug in your Tactrix cable to linux, you should see it on your USB bus:

    [14:16:59] [gconradi@mbp] ( 0 ) ~
    -> $ lsusb
    ...
    Bus 004 Device 006: ID 0403:cc4d Future Technology Devices International, Ltd
    ...

In the VirtualBox settings for your Windows VM, pass the device through to the guest. This will allow EcuFlash to read and write to the ECU over the Tactrix cable.

<a href="http://imgur.com/KYGsqsI"><img src="http://i.imgur.com/KYGsqsI.png"/></a>

If you try to log with RomRaider at this stage, you will see it is unable to talk to the ECU still. This is because it uses the K-line on OBDII (read more [here](http://en.wikipedia.org/wiki/On-board_diagnostics)), which is similar to RS-232. Thus, the Tactrix cable presents a serial device (/dev/ttyACM\*) to Linux when plugged in. You can see it with <code>udevadm info</code> (output amended for brevity):

    [14:32:40] [gconradi@mbp] ( 0 ) ~
    -> $ udevadm info -q property /dev/ttyACM0
    ...
    DEVNAME=/dev/ttyACM0
    DEVPATH=/devices/pci0000:00/0000:00:06.0/usb4/4-2/4-2:1.0/tty/ttyACM0
    ID_BUS=usb
    ID_MM_CANDIDATE=1
    ID_MODEL=OpenPort_2.0
    ...
    SUBSYSTEM=tty
    ...

To make <code>udev</code> let your user read and write to the device, create a rule for it:

    [14:33:33] [gconradi@mbp] ( 0 ) ~
    -> $ cat /etc/udev/rules.d/70-tactrix-openport2.rules
    KERNEL=="ttyACM*", SUBSYSTEM=="tty", GROUP="adm", MODE="0666"

Then, pass the serial port through to the Windows guest:

<a href="http://imgur.com/YJpcTLh"><img src="http://i.imgur.com/YJpcTLh.png" /></a>

NOTE: One issue that I encountered is that when plugging the Tactrix cable into EcuFlash for the first time in the VM, EcuFlash tried to update the firmware, and hung. I was unable to get the Tactrix to update its firmware in the VM, and resorted to plugging it into a real Windows computer to complete the flash. Once the OpenPort is updated, you will have to uninstall then reinstall EcuFlash and its drivers in the VM in order to get it recognized properly.

Now RomRaider should be able to read your ECU and log correctly!



