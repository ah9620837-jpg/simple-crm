import { useState } from "react";

function App() {
  // استخدم useState عادي بدل useLocalStorage
  const [name, setName] = useState("");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>CRM المبيعات البسيط</h1>
      <p>ده الإصدار التجريبي الأول!</p>

      <input
        type="text"
        placeholder="اكتب اسم العميل"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "8px", marginRight: "8px" }}
      />

      <button
        onClick={() => alert(`تم حفظ العميل: ${name}`)}
        style={{ padding: "8px 12px" }}
      >
        حفظ
      </button>
    </div>
  );
}

export default App;
