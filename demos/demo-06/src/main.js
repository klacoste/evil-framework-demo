import "./styles.css";
import { mount } from "./framework/mount";
import { ControlsView } from "./views/ControlsView";
import { ParityView } from "./views/ParityView";
import { SignView } from "./views/SignView";
import { ValueView } from "./views/ValueView";

mount(document.getElementById("value"), ValueView);
mount(document.getElementById("parity"), ParityView);
mount(document.getElementById("sign"), SignView);
mount(document.getElementById("controls"), ControlsView);
