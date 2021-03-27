import { Flow, StateEngineInterface, StateID, UserInput } from "./types";

export class StateEngine implements StateEngineInterface {
  flow: Flow;
  
  setFlow(flow: Flow): void {
    this.flow = flow;
    return;
  }

  run(data: UserInput): StateID {
    return JSON.stringify(data);
  }
}