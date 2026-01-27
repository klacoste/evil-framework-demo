import "./styles.css";
import { mount } from "./framework/mount";
import { BootstrapService } from "./services/bootstrapService";
import { ConnectivityView } from "./views/ConnectivityView";
import { TodoInputView } from "./views/TodoInputView";
import { TodoMetaView } from "./views/TodoMetaView";
import { OutboxView } from "./views/OutboxView";
import { SyncControlsView } from "./views/SyncControlsView";
import { SyncStatusView } from "./views/SyncStatusView";
import { ConflictView } from "./views/ConflictView";

mount(document.getElementById("connectivity"), ConnectivityView);
mount(document.getElementById("todo-input"), TodoInputView);
mount(document.getElementById("todo-meta"), TodoMetaView);
mount(document.getElementById("outbox"), OutboxView);
mount(document.getElementById("sync-controls"), SyncControlsView);
mount(document.getElementById("sync-status"), SyncStatusView);
mount(document.getElementById("conflict-panel"), ConflictView);

BootstrapService.initializeApp();
