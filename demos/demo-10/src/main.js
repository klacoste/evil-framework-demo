import "./styles.css";
import { mount } from "./framework/mount";
import { AppView } from "./views/AppView";

mount(document.getElementById("app"), AppView);
