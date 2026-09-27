// app.js: συνδέει τον πυρήνα με την οθόνη.

const inputs  = { A: 0, B: 0, C: 0 };
const circuit = { gate1: "AND", gate2: "OR" };

const gate1Select = document.getElementById("gate1");
const gate2Select = document.getElementById("gate2");

// Γεμίζουμε τις λίστες με τις πύλες που ξέρει ο πυρήνας
for (const name of Object.keys(GATES)) {
  gate1Select.add(new Option(name, name));
  gate2Select.add(new Option(name, name));
}
gate1Select.value = circuit.gate1;
gate2Select.value = circuit.gate2;
// Κάνει ένα καλώδιο πράσινο όταν έχει τιμή 1
function setWire(id, value) {
  document.getElementById(id).classList.toggle("wire-on", value === 1);
}

// Οι πύλες με άρνηση έχουν κυκλάκι στην έξοδο
function hasBubble(type) {
  return type === "NAND" || type === "NOR";
}

// Η θέση κάθε πύλης στο διάγραμμα (πάνω αριστερή γωνία, μέγεθος 60 x 60)
const GATE_POS = {
  1: { x: 150, y: 30 },
  2: { x: 280, y: 95 },
};

// Επιστρέφει το σχήμα της πύλης ως εντολές path
function gateShape(type, x, y) {
  const and = `M ${x} ${y} H ${x + 30} A 30 30 0 0 1 ${x + 30} ${y + 60} H ${x} Z`;
  const or  = `M ${x} ${y} Q ${x + 15} ${y + 30} ${x} ${y + 60}
               Q ${x + 40} ${y + 60} ${x + 60} ${y + 30}
               Q ${x + 40} ${y} ${x} ${y} Z`;
  const xorBody = `M ${x + 8} ${y} Q ${x + 23} ${y + 30} ${x + 8} ${y + 60}
                   Q ${x + 48} ${y + 60} ${x + 60} ${y + 30}
                   Q ${x + 48} ${y} ${x + 8} ${y} Z`;
  const xorBack = `M ${x} ${y} Q ${x + 15} ${y + 30} ${x} ${y + 60}`;

  if (type === "AND" || type === "NAND") return { body: and, extra: "" };
  if (type === "OR"  || type === "NOR")  return { body: or,  extra: "" };
  if (type === "XOR") return { body: xorBody, extra: xorBack };
}

// Σχεδιάζει την πύλη n (1 ή 2) με το σωστό σχήμα
function drawGate(n, type) {
  const pos = GATE_POS[n];
  const shape = gateShape(type, pos.x, pos.y);
  document.getElementById("gate" + n + "Shape").setAttribute("d", shape.body);
  document.getElementById("gate" + n + "Extra").setAttribute("d", shape.extra);
  document.getElementById("gate" + n + "Label").textContent = type;
  document.getElementById("bubble" + n).style.display = hasBubble(type) ? "" : "none";
}
// Υπολογίζει το κύκλωμα και ενημερώνει την οθόνη
function update() {
  const result = evaluateCircuit(circuit, inputs);
  setWire("wireA", inputs.A);
  setWire("wireB", inputs.B);
  setWire("wireC", inputs.C);
  setWire("wireG1", result.g1);
  setWire("wireY", result.y);

  drawGate(1, circuit.gate1);
  drawGate(2, circuit.gate2);
  const y = document.getElementById("y");
  y.textContent = result.y;
  y.classList.toggle("on", result.y === 1);

  for (const btn of document.querySelectorAll(".bit")) {
    const name = btn.dataset.name;
    btn.textContent = name + " = " + inputs[name];
    btn.classList.toggle("on", inputs[name] === 1);
  }
}

// Πάτημα σε είσοδο: η τιμή αλλάζει από 0 σε 1 και αντίστροφα
for (const btn of document.querySelectorAll(".bit")) {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    inputs[name] = 1 - inputs[name];
    update();
  });
}

// Αλλαγή πύλης
gate1Select.addEventListener("change", () => {
  circuit.gate1 = gate1Select.value;
  update();
});
gate2Select.addEventListener("change", () => {
  circuit.gate2 = gate2Select.value;
  update();
});

update();