import Deffer from "../deffer.js";

export default function isDeffer(e: any): e is Deffer {
    return e.hasOwnProperty("name");
}