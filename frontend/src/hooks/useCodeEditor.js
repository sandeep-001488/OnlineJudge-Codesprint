"use client";
import { useRef, useEffect } from "react";
import { EditorView, basicSetup } from "codemirror";
import { StateField, StateEffect } from "@codemirror/state";
import { Decoration } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { oneDark } from "@codemirror/theme-one-dark";
import { useThemeStore } from "@/store/themeStore";

const addErrorHighlight = StateEffect.define();
const clearErrorHighlightEffect = StateEffect.define();

const errorHighlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(decorations, transaction) {
    decorations = decorations.map(transaction.changes);

    for (let effect of transaction.effects) {
      if (effect.is(addErrorHighlight)) {
        const lineNumber = effect.value;
        try {
          if (lineNumber > 0 && lineNumber <= transaction.state.doc.lines) {
            const line = transaction.state.doc.line(lineNumber);
            const decoration = Decoration.line({
              class: "cm-error-line",
            });
            decorations = decorations.update({
              add: [decoration.range(line.from)],
            });
          }
        } catch (error) {
          console.warn(`Could not highlight line ${lineNumber}:`, error);
        }
      } else if (effect.is(clearErrorHighlightEffect)) {
        decorations = Decoration.none;
      }
    }

    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export function useCodeMirrorEditor(language, initialCode, onChange) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const { theme } = useThemeStore();

  const isDark = theme === "dark";

  const highlightError = (lineNumber) => {
    if (viewRef.current && lineNumber && lineNumber > 0) {
      const maxLines = viewRef.current.state.doc.lines;
      const validLineNumber = Math.max(1, Math.min(lineNumber, maxLines));

      viewRef.current.dispatch({
        effects: addErrorHighlight.of(validLineNumber),
      });
    }
  };

  const clearErrorHighlight = () => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: clearErrorHighlightEffect.of(),
      });
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    let languageExtension;

    switch (language) {
      case "cpp":
        languageExtension = cpp();
        break;
      case "python":
        languageExtension = python();
        break;
      case "java":
        languageExtension = java();
        break;
      case "javascript":
      default:
        languageExtension = javascript();
    }

    if (viewRef.current) {
      viewRef.current.destroy();
    }

    viewRef.current = new EditorView({
      doc: initialCode || "",
      extensions: [
        basicSetup,
        languageExtension,
        errorHighlightField,
        EditorView.lineWrapping,
        ...(isDark ? [oneDark] : []),
        EditorView.theme({
          "&": {
            fontSize: "14px",
          },
          ".cm-content": {
            padding: "16px",
            minHeight: "500px",
          },
          ".cm-focused": {
            outline: "none",
          },
          ".cm-editor": {
            borderRadius: "0px",
            backgroundColor: isDark ? "#0f172a" : "#ffffff",
          },
          ".cm-gutters": {
            border: "none",
            borderRight: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
            backgroundColor: isDark ? "#1e293b" : "#f8fafc",
          },
          ".cm-activeLineGutter": {
            backgroundColor: isDark ? "#334155" : "#e2e8f0",
          },
          ".cm-activeLine": {
            backgroundColor: isDark
              ? "rgba(51, 65, 85, 0.3)"
              : "rgba(226, 232, 240, 0.3)",
          },
          ".cm-error-line": {
            backgroundColor: isDark
              ? "rgba(239, 68, 68, 0.15)"
              : "rgba(239, 68, 68, 0.1)",
            borderLeft: "3px solid #ef4444",
            paddingLeft: "13px",
            position: "relative",
          },
          ".cm-error-line .cm-gutterElement": {
            backgroundColor: isDark
              ? "rgba(239, 68, 68, 0.25)"
              : "rgba(239, 68, 68, 0.2)",
            color: "#ef4444",
            fontWeight: "bold",
          },
          ".cm-error-line": {
            animation: "errorHighlight 0.3s ease-in-out",
          },
          "@keyframes errorHighlight": {
            "0%": {
              backgroundColor: isDark
                ? "rgba(239, 68, 68, 0.3)"
                : "rgba(239, 68, 68, 0.2)",
            },
            "100%": {
              backgroundColor: isDark
                ? "rgba(239, 68, 68, 0.15)"
                : "rgba(239, 68, 68, 0.1)",
            },
          },
        }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && onChange) {
            const newCode = update.state.doc.toString();
            onChange(newCode);
          }
        }),
      ],
      parent: editorRef.current,
    });

    return () => viewRef.current?.destroy();
  }, [language, isDark]);

  useEffect(() => {
    if (viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      if (currentContent !== initialCode) {
        viewRef.current.dispatch({
          effects: clearErrorHighlightEffect.of(),
        });
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: viewRef.current.state.doc.length,
            insert: initialCode || "",
          },
        });
      }
    }
  }, [initialCode]);
  return {
    editorRef,
    highlightError,
    clearErrorHighlight,
  };
}
