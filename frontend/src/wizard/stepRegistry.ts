import type { StepRegistry } from "./stepRegistryTypes";

import WelcomeStep from "./steps/WelcomeStep";
import UnternehmensgegenstandStep from "./steps/UnternehmensgegenstandStep";
import SummaryStep from "./steps/SummaryStep";

export const stepRegistry: StepRegistry = {
  WelcomeStep,
  UnternehmensgegenstandStep,
  SummaryStep,
};
