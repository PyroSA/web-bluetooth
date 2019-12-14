const getDevice = async () => {
  const connectAndListen = async (device) => {
    const gatt = await device.gatt.connect();
    console.log(gatt);

    const service = await gatt.getPrimaryService(primaryService);
    console.log(service);

    const chars = await service.getCharacteristics()
    console.log(chars);

    const notify = chars.find(char => char.properties.notify);

    notify.addEventListener('characteristicvaluechanged', (event) => {
      console.log('notify ->', event.currentTarget.value);
    });

    notify.startNotifications();
  }

  const primaryService = '226c0000-6476-4566-7562-66734470666d';
  const device = await navigator.bluetooth.requestDevice(
    {
      filters: [
        { name: "MJ_HT_V1" }
      ],
      optionalServices: [
        primaryService
      ]
    });
  device.ongattserverdisconnected = () => {
    console.log('GATT Disconnected');
    connectAndListen(device);
  }
  console.log(device);

  connectAndListen(device);
}
