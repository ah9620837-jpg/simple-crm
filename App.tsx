import React from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import CustomerForm from "./components/CustomerForm";
import CustomerList from "./components/CustomerList";

interface Customer {
  id: number;
  name: string;
  email: string;
}

const App: React.FC = () => {
  const [customers, setCustomers] = useLocalStorage<Customer[]>("customers", []);

  const addCustomer = (name: string, email: string) => {
    const newCustomer = { id: Date.now(), name, email };
    setCustomers([...customers, newCustomer]);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📋 قائمة العملاء</h1>
      <CustomerForm onAddCustomer={addCustomer} />
      <CustomerList customers={customers} />
    </div>
  );
};

export default App;
