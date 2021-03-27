import { getYupAstFromStateSchema, StateEngine } from "./StateEngine";
import { FieldTypes, Flow } from "./types";

const testFlow: Flow = {
  id: "test-flow",
  initialState: "state-1",
  states: [{
    id: "state-1",
    schema: {
      nome: {
        type: FieldTypes.STRING,
        required: true,
      }
    }
  }, {
    id: "state-2",
    schema: {
      email: {
        type: FieldTypes.STRING,
        required: true,
      }
    }
  }, {
    id: "state-3",
    schema: {
      valor: {
        type: FieldTypes.NUMBER,
        required: true,
      }
    }
  }],
  links: [{
    id: "link-1",
    from: "state-1",
    to: "state-2",
  }, {
    id: "link-1",
    from: "state-2",
    to: "state-3",
  }]
};

testFlow.states.map((state) => getYupAstFromStateSchema(state.schema));

(async () => {
  const stateEngine = new StateEngine();
  
  stateEngine.setFlow(testFlow);
  stateEngine.compile();
  
  const case1 = await stateEngine.run({ nome: "John Doe" });
  console.log(case1);
  
  const case2 = await stateEngine.run({});
  console.log(case2);
  
  const case3 = await stateEngine.run({ email: "s@s.com", valor: 30 });
  console.log(case3);

  const case4 = await stateEngine.run({ nome: "John Doe", email: "s@s.com", valor: 30 });
  console.log(case4);
})();