const outputs = [];

const setState = (text) => {
  const stateElement = document.getElementById('state');
  if (stateElement) {
    stateElement.innerText = text;
  }
}

const addOutput = (text) => {
  outputs.push(text);
  if (outputs.length > 10) {
    outputs.shift();
  }
  const outputElement = document.getElementById('output');
  if (outputElement) {
    outputElement.innerText = outputs.join('\n');
  }
}

const getDevice = async () => {
  const connectAndListen = async (device) => {
    setState('Connecting');
    const gatt = await device.gatt.connect();
    console.log(gatt);
    setState('Connected');

    const service = await gatt.getPrimaryService(primaryService);
    setState('Get Services');
    console.log(service);

    const chars = await service.getCharacteristics()
    setState('Get Characteristics');
    console.log(chars);

    const notify = chars.find(char => char.properties.notify);

    notify.addEventListener('characteristicvaluechanged', (event) => {
      const value = new Int8Array(event.currentTarget.value.buffer);
      console.log('notify ->', value);
      let str = '';
      value.forEach((element, index) => {
        str += String.fromCharCode(value[index]);
      });
      addOutput(str);
    });

    setState('Listening');
    notify.startNotifications();
  }

  const primaryService = '226c0000-6476-4566-7562-66734470666d';
  setState('Requesting Device');
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
