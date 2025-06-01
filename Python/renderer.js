document.getElementById('btn').addEventListener('click', () => {

  window.api.sendToPython('Hello from frontend!');

});

window.api.onPythonResponse((data) => {

    document.getElementById('output').innerText = data;

});
