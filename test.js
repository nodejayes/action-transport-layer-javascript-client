(async function () {
    const cl = new atlJs.Client('ws://127.0.0.1:3001/ws');
    await cl.connect()
    cl.send("hello", {name:'Markus'});
    cl.onMessage(a => console.info(a));
})().then();
