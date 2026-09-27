// logic.js: ο πυρήνας. Μόνο λογική, καμία σχέση με την οθόνη.

const GATES = {
  AND:  (a, b) => a & b,
  OR:   (a, b) => a | b,
  NAND: (a, b) => 1 - (a & b),
  NOR:  (a, b) => 1 - (a | b),
  XOR:  (a, b) => a ^ b,
};

function evaluateGate(type, a, b) {
  return GATES[type](a, b);
}

function evaluateCircuit(circuit, inputs) {
  const g1 = evaluateGate(circuit.gate1, inputs.A, inputs.B);
  const y  = evaluateGate(circuit.gate2, g1, inputs.C);
  return { g1: g1, y: y };
}