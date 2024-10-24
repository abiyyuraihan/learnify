import React, { useState, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-markdown";
import { Book, Plus, X } from "lucide-react";

const EducationPlanner = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [plans, setPlans] = useState([]);
  const resultsRef = useRef(null);

  // Initialize AI dengan React environment variable
  const initializeAI = () => {
    const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "API key tidak dikonfigurasi. Pastikan environment variable REACT_APP_GEMINI_API_KEY telah diatur."
      );
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      return genAI.getGenerativeModel({ model: "gemini-pro" }); // Using stable model
    } catch (error) {
      throw new Error(`Gagal menginisialisasi Gemini AI: ${error.message}`);
    }
  };

  const popularSubjects = [
    "Matematika",
    "Fisika",
    "Kimia",
    "Biologi",
    "Bahasa Inggris",
    "Pemrograman",
    "Ekonomi",
    "Sejarah",
  ];

  const addSubject = (subject) => {
    if (subject && !subjects.includes(subject)) {
      setSubjects([...subjects, subject]);
      setNewSubject("");
    }
  };

  const removeSubject = (subjectToRemove) => {
    setSubjects(subjects.filter((subject) => subject !== subjectToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (subjects.length === 0) return;

    setLoading(true);
    setError(null);
    setPlans([]);

    try {
      const model = initializeAI();

      for (const subject of subjects) {
        try {
          const prompt = `Berikan rencana pembelajaran terstruktur untuk ${subject} dengan format berikut:

# Rencana Pembelajaran ${subject} 📚

## Gambaran Umum
[Gambaran singkat mata pelajaran dan manfaatnya]

## 1. Tahapan Pembelajaran 📘
### Tingkat Dasar
- Konsep 1
- Konsep 2

### Tingkat Menengah
- Konsep 1
- Konsep 2

### Tingkat Lanjut
- Konsep 1
- Konsep 2

## 2. Sumber Belajar 📖
### Buku Rekomendasi
- Buku 1
- Buku 2

### Sumber Online
- Platform 1
- Platform 2

## 3. Metode Pembelajaran 🎯
### Teknik Belajar
- Metode 1
- Metode 2

### Latihan Praktik
- Aktivitas 1
- Aktivitas 2

## 4. Tips Sukses Belajar 💡
- Tip 1
- Tip 2

## Langkah Selanjutnya
[Saran konkret cara memulai]`;

          const result = await model.generateContent(prompt);
          const response = await result.response;

          setPlans((oldPlans) => [
            ...oldPlans,
            {
              subject,
              content: response.text(),
            },
          ]);
        } catch (error) {
          console.error(`Error generating plan for ${subject}:`, error);
          setPlans((oldPlans) => [
            ...oldPlans,
            {
              subject,
              content: `Maaf, terjadi kesalahan dalam membuat rencana pembelajaran untuk ${subject}. Error: ${error.message}`,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Initialization error:", error);
      setError(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col items-center font-sans">
      <div className="w-full max-w-6xl bg-white shadow-sm p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="text-5xl text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">
              Learnify AI
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Dapatkan rencana pembelajaran terstruktur untuk setiap mata
            pelajaran yang ingin kamu kuasai
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="max-w-2xl mx-auto mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        {/* Input Form */}
        <div className="max-w-2xl mx-auto mb-8 bg-white border border-gray-200 p-8 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2 text-sm font-medium">
                Tambah Mata Pelajaran
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Masukkan mata pelajaran..."
                />
                <button
                  type="button"
                  onClick={() => addSubject(newSubject)}
                  className="px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Selected Subjects */}
            {subjects.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg"
                  >
                    <span>{subject}</span>
                    <button
                      type="button"
                      onClick={() => removeSubject(subject)}
                      className="hover:text-blue-900"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Popular Subjects */}
            <div>
              <label className="block text-gray-700 mb-3 text-sm font-medium">
                Pilihan Populer
              </label>
              <div className="flex flex-wrap gap-2">
                {popularSubjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => addSubject(subject)}
                    className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm transition-colors"
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={subjects.length === 0 || loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white rounded-xl font-medium transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Menyusun Rencana..." : "Buat Rencana Pembelajaran"}
            </button>
          </form>
        </div>

        {/* Results */}
        {plans.length > 0 && (
          <div ref={resultsRef} className="space-y-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow-lg p-6"
              >
                <div className="prose prose-slate max-w-none">
                  <Markdown>{plan.content}</Markdown>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EducationPlanner;
