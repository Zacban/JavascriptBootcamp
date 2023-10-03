import { default as message, message2 as msg} from "./env.js";

setInterval(() => {
    console.log('Hello from Test!!');

    console.log(message, msg);
}, 500)
