import {io} from "socket.io-client";
import {BACKEND_URL} from "./backend_url";

const socket = io.connect(BACKEND_URL);
export default socket;
