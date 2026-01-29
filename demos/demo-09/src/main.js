import "./styles.css";
import { mount } from "./framework/mount";
import { BootstrapService } from "./services/bootstrapService";
import { ConnectivityView } from "./views/ConnectivityView";
import { DocEditorView } from "./views/DocEditorView";
import { StatsView } from "./views/StatsView";
import { EventLogView } from "./views/EventLogView";

mount(document.getElementById("connectivity"), ConnectivityView);
mount(document.getElementById("doc-editor"), DocEditorView);
mount(document.getElementById("stats"), StatsView);
mount(document.getElementById("events"), EventLogView);

BootstrapService.initializeApp();
