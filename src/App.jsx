import { useState } from "react";
import "../styles.css";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [target, setTarget] = useState("en");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const detectLanguage = (str) => {
    const japaneseRegex = /[\u3040-\u30ff\u4e00-\u9faf]/;
    return japaneseRegex.test(str) ? "ja" : "en";
  };

  const translate = async () => {
    if (!text) return;

    setLoading(true);

    const sourceLang = detectLanguage(text);

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${target}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      const translatedText = data.responseData.translatedText;
      setResult(translatedText);

      // 🔽 翻訳履歴を追加
      setHistory((prev) => [
        {
          original: text,
          translated: translatedText,
          target: target,
        },
        ...prev,
      ]);
    } catch {
      setResult("翻訳に失敗しました。");
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="main-card">
        <h1>翻訳アプリ</h1>

        <textarea
          rows="4"
          className="textarea"
          placeholder="文章を入力してください"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="target-lang-container">
          翻訳先言語：
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="select-target"
          >
            <option value="ja">日本語</option>
            <option value="en">英語</option>
          </select>
        </div>

        <button
          onClick={translate}
          disabled={loading}
          className="translate-button"
        >
          {loading ? "翻訳中..." : "翻訳する"}
        </button>

        <h2 className="result-heading">結果</h2>
        <div className="result-area">
          {result || "（翻訳結果がここに出ます）"}
        </div>

        {/* 🔽 翻訳履歴表示 */}
        <h2 className="history-heading">翻訳履歴</h2>
        <div className="history-area">
          {history.length === 0 ? (
            <p className="history-empty">（履歴はまだありません）</p>
          ) : (
            history.map((item, index) => (
              <div key={index} className="history-item">
                <div className="history-original">
                  <strong>原文：</strong>{item.original}
                </div>
                <div className="history-translated">
                  <strong>翻訳：</strong>{item.translated}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
