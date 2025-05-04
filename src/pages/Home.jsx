import { useEffect, useState } from "react";
import axios from "axios";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const Home = () => {
  const [todosByDay, setTodosByDay] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchAllTodos = async () => {
    try {
      const res = await axios.get("https://backendtutamsbd9-production.up.railway.app/api/todos");
      const grouped = {};
      for (let day of days) {
        grouped[day] = res.data.filter((todo) => todo.day === day);
      }
      setTodosByDay(grouped);
    } catch {
      showMessage("Gagal memuat to do.");
    }
  };

  const addTodo = async () => {
    if (!text.trim() || !selectedDay) return;
    try {
      await axios.post("https://backendtutamsbd9-production.up.railway.app/api/todos", {
        text,
        day: selectedDay,
        completed: false,
      });
      setText("");
      fetchAllTodos();
      showMessage("To do berhasil ditambahkan!");
    } catch {
      showMessage("Gagal menambahkan to do.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`https://backendtutamsbd9-production.up.railway.app/api/todos/${id}`);
      fetchAllTodos();
      showMessage("To do berhasil dihapus!");
    } catch {
      showMessage("Gagal menghapus to do.");
    }
  };

  const completeTodo = async (id) => {
    try {
      await axios.put(`https://backendtutamsbd9-production.up.railway.app/api/todos/${id}`, {
        completed: true,
      });
      fetchAllTodos();
      showMessage("To do telah dikerjakan!");
    } catch {
      showMessage("Gagal menyelesaikan to do.");
    }
  };

  useEffect(() => {
    fetchAllTodos();
  }, []);

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 text-gray-900 dark:text-gray-100 transition-all duration-500">

        {/* Header */}
        <div className="sticky top-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white shadow-md rounded-2xl mb-6 p-4 sm:p-6 z-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl sm:text-4xl font-bold">📅 To Do List Mingguan</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base">☀️</span>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 relative"></div>
              </label>
              <span className="text-sm sm:text-base">🌙</span>
            </div>
          </div>
        </div>

        {/* Notification */}
        {message && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-600 rounded-lg text-center">
            {message}
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          {!selectedDay ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {days.map((day) => (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className="cursor-pointer bg-white dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-gray-700 p-5 rounded-2xl shadow-md transform hover:scale-105 transition duration-300 flex flex-col justify-between h-64"
                >
                  <div>
                    <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">
                      {day}
                    </h2>
                    <ul className="mt-2 text-sm text-gray-700 dark:text-gray-200 space-y-1">
                      {todosByDay[day]?.slice(0, 4).map((todo) => (
                        <li key={todo._id} className="truncate">
                          • {todo.completed ? <s>{todo.text}</s> : todo.text}
                        </li>
                      ))}
                      {todosByDay[day]?.length > 4 && (
                        <li className="text-gray-500 italic">+{todosByDay[day].length - 4} lainnya</li>
                      )}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-300">{selectedDay}</h2>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-blue-500 dark:text-blue-300 hover:underline"
                >
                  ← Kembali
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <input
                  type="text"
                  placeholder={`Tambah todo untuk hari ${selectedDay}...`}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
                />
                <button
                  onClick={addTodo}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Tambah
                </button>
              </div>

              {todosByDay[selectedDay]?.length === 0 ? (
                <p className="text-center text-gray-500 italic">Belum ada todo untuk hari ini.</p>
              ) : (
                <ul className="space-y-3">
                  {todosByDay[selectedDay].map((todo) => (
                    <li
                      key={todo._id}
                      className="flex justify-between items-center bg-white dark:bg-gray-700 px-4 py-3 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => completeTodo(todo._id)}
                          className="h-5 w-5 text-blue-600"
                        />
                        <span className={todo.completed ? "line-through text-gray-500" : ""}>
                          {todo.text}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        Hapus
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
