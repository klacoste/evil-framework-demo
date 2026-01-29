import { DocDomain } from "../domains/docDomain";
import { EngineService } from "./engineService";

export const DocService = {
  setText(nextText) {
    const current = DocDomain.selectors.getText(DocDomain.getState());
    if (current === nextText) return;
    EngineService.setText(nextText);
  },
};
