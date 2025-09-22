import { useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage";

type Customer = {
  id: number;
  name: string;
  email: string;
};

function App() {
  const [customers, setCustomers] = useLocalStorage<Customer[]>("customers", []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const addCustomer = () => {
    if (!name || !email) return;
    const newCustomer = { id: Date.now(), name, email };
    setCustomers([...customers, newCustomer]);
    setName("");
    setEmail("");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Simple CRM</h1>

      <div style={{ marginBottom: "10px" }}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={addCustomer}>Add</button>
      </div>

      <ul>
        {customers.map((c) => (
          <li key={c.id}>
            {c.name} - {c.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
