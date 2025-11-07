import { useEffect, useState } from "react";

const API_URL = "http://localhost:5051/orders";

export default function App() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ cliente: "", produto: "", valor: "" });
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cliente || !form.produto || !form.valor) return;
    setLoading(true);
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, valor: parseFloat(form.valor) }),
    });
    setForm({ cliente: "", produto: "", valor: "" });
    await fetchOrders();
    setLoading(false);
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-6">
      <h1 class="text-4xl font-extrabold text-center mb-10 text-blue-700 drop-shadow-sm">
        💼 Sistema de Pedidos
      </h1>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        class="bg-white/90 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-md max-w-2xl mx-auto mb-10 transition hover:shadow-lg"
      >
        <h2 class="text-2xl font-semibold mb-5 text-gray-700">
          Novo Pedido
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <input
            type="text"
            placeholder="Cliente"
            class="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none transition"
            value={form.cliente}
            onChange={(e) => setForm({ ...form, cliente: e.target.value })}
          />
          <input
            type="text"
            placeholder="Produto"
            class="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none transition"
            value={form.produto}
            onChange={(e) => setForm({ ...form, produto: e.target.value })}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Valor (R$)"
            class="border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-400 outline-none transition"
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          class="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Enviando..." : "Criar Pedido"}
        </button>
      </form>

      {/* Tabela */}
      <div class="bg-white/90 backdrop-blur-md border border-gray-200 p-6 rounded-2xl shadow-md max-w-6xl mx-auto transition hover:shadow-lg">
        <h2 class="text-2xl font-semibold mb-4 text-gray-700">
          Pedidos Registrados
        </h2>
        <div class="overflow-x-auto">
          <table class="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr class="bg-blue-100 text-gray-700">
                <th class="border p-3">ID</th>
                <th class="border p-3">Cliente</th>
                <th class="border p-3">Produto</th>
                <th class="border p-3">Valor</th>
                <th class="border p-3">Status</th>
                <th class="border p-3">Ações</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr
                  key={o.id}
                  class="hover:bg-blue-50 transition"
                >
                  <td class="border p-3 text-center font-semibold text-gray-600">{o.id}</td>
                  <td class="border p-3">{o.cliente}</td>
                  <td class="border p-3">{o.produto}</td>
                  <td class="border p-3 text-right text-gray-700">
                    R$ {o.valor.toFixed(2)}
                  </td>
                  <td class="border p-3 text-center">
                    <span
                      class={`px-3 py-1.5 rounded-full text-white text-xs font-semibold shadow-sm ${
                        o.status === "Pendente"
                          ? "bg-yellow-500"
                          : o.status === "Processando"
                          ? "bg-blue-500"
                          : "bg-green-600"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td class="border p-3 text-center">
                    <button
                      onClick={() => setSelected(o)}
                      class="text-blue-600 hover:text-blue-800 font-medium transition"
                    >
                      Ver detalhes
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    class="text-center py-6 text-gray-500 italic"
                  >
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selected && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div class="bg-white p-6 rounded-2xl shadow-2xl w-96 relative">
            <button
              onClick={() => setSelected(null)}
              class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h3 class="text-xl font-bold mb-3 text-blue-700">
              Pedido #{selected.id}
            </h3>
            <div class="space-y-1 text-gray-700">
              <p><strong>Cliente:</strong> {selected.cliente}</p>
              <p><strong>Produto:</strong> {selected.produto}</p>
              <p><strong>Valor:</strong> R$ {selected.valor.toFixed(2)}</p>
              <p><strong>Status:</strong> {selected.status}</p>
              <p><strong>Criado em:</strong> {new Date(selected.dataCriacao).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
