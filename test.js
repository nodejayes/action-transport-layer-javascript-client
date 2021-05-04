(async function () {
    const cl = new atlClient.Client('ws://127.0.0.1:3001/ws');
    await cl.connect()
    cl.send("hello", {name:'It Works!'});
    cl.onMessage(a => document.getElementById('text').innerText = JSON.stringify(a.payload.Result));
})().then();
