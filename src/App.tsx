// src/App.tsx
import React, { useCallback, useEffect, useState } from "react";
import TranslatePanel from "./components/TranslatePanel";
import logo from "./assets/logo.svg";

export type LanguageId = "auto" | "en" | "fr" | "es";

export interface Language {
  id: LanguageId;
  label: string;
  voice: string;
}

interface MyMemoryResponse {
  responseData?: {
    translatedText?: string;
  };
}

const LANGUAGES: Language[] = [
  { id: "auto", label: "Detect Language", voice: "" },
  { id: "en", label: "English", voice: "en-US" },
  { id: "fr", label: "French", voice: "fr-FR" },
  { id: "es", label: "Spanish", voice: "es-ES" },
];

const App: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<LanguageId>("en");
  const [targetLang, setTargetLang] = useState<LanguageId>("fr");
  const [sourceText, setSourceText] = useState<string>("Hello, how are you?");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const translate = useCallback(
    async (text: string, from: LanguageId, to: LanguageId) => {
      if (!text.trim()) {
        setTranslatedText("");
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      try {
        const effectiveFrom = from === "auto" ? "en" : from;
        const langpair = `${effectiveFrom}|${to}`;

        const response = await fetch("https://api.mymemory.translated.net/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ q: text, langpair }),
        });

        if (!response.ok) {
          throw new Error("Network error");
        }

        const data = (await response.json()) as MyMemoryResponse;
        const translated = data.responseData?.translatedText ?? "";
        setTranslatedText(translated);
      } catch {
        setErrorMessage("");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!sourceText.trim()) {
      setTranslatedText("");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void translate(sourceText, sourceLang, targetLang);
    }, 650);

    return () => window.clearTimeout(timeoutId);
  }, [sourceText, sourceLang, targetLang, translate]);

  const handleTranslateClick = () => {
    void translate(sourceText, sourceLang, targetLang);
  };

  const handleSwapLanguages = () => {
    setSourceLang((prev) => {
      const newSource = targetLang;
      setTargetLang(prev === "auto" ? "en" : prev);
      return newSource;
    });

    setSourceText((prevSource) => {
      const newSourceText = translatedText || prevSource;
      setTranslatedText(prevSource);
      return newSourceText;
    });
  };

  const speakText = (text: string, langIdFallback: LanguageId) => {
    if (!text.trim()) return;
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    const langObj =
      LANGUAGES.find((l) => l.id === langIdFallback && l.voice) ??
      LANGUAGES.find((l) => l.id === "en");

    const utterance = new SpeechSynthesisUtterance(text);
    if (langObj?.voice) utterance.lang = langObj.voice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const copyText = async (text: string) => {
    if (!navigator.clipboard) {
      alert("Clipboard is not available.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert("Unable to copy text.");
    }
  };

  const sourceLanguages = LANGUAGES;
  const targetLanguages = LANGUAGES.filter((l) => l.id !== "auto");

  return (
    <div className="app">
      <header className="app-header">
        <img src={logo} alt="translated.io" className="logo-img" />
      </header>

      <main className="app-main">
        <div className="cards-row">
          <TranslatePanel
            variant="source"
            languages={sourceLanguages}
            selectedLang={sourceLang}
            onSelectLang={setSourceLang}
            text={sourceText}
            onChangeText={setSourceText}
            maxLength={500}
            isLoading={isLoading}
            onTranslateClick={handleTranslateClick}
            onSpeakClick={() => speakText(sourceText, sourceLang)}
            onCopyClick={() => copyText(sourceText)}
          />

          <TranslatePanel
            variant="target"
            languages={targetLanguages}
            selectedLang={targetLang}
            onSelectLang={setTargetLang}
            text={translatedText}
            readOnly
            onSpeakClick={() => speakText(translatedText, targetLang)}
            onCopyClick={() => copyText(translatedText)}
            onSwapClick={handleSwapLanguages}
          />
        </div>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </main>
    </div>
  );
};

export default App;
