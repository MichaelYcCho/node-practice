const socket = io("/");

socket.on("hello", () => console.log("Somebody said hello"));


setTimeout(() => socket.emit("helloGuys"), 4000);