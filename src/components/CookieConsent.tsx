
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type CookiePreferences = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
};

const STORAGE_KEY = "static-holidays-cookie-preferences";

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export default function CookieConsent() {
  const [preferences, setPreferences] =
    useState<CookiePreferences>(defaultPreferences);

  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (
          typeof parsed.analytics === "boolean" &&
          typeof parsed.marketing === "boolean"
        ) {
          setPreferences({
            necessary: true,
            analytics: parsed.analytics,
            marketing: parsed.marketing,
          });
          return;
        }
      }
    } catch (error) {
      console.error("Could not read cookie preferences:", error);
    }

    setShowBanner(true);
  }, []);

  const savePreferences = (chosen: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chosen));
      setPreferences(chosen);
      setShowBanner(false);
      setShowSettings(false);
    } catch (error) {
      console.error("Could not save cookie preferences:", error);
    }
  };

  const acceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    });
  };

  const rejectOptional = () => {
    savePreferences(defaultPreferences);
  };

  return (
    <>
      {showBanner && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-title"
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "#ffffff",
            color: "#26352b",
         
          padding: "12px 18px",
            boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
            borderTop: "3px solid #286442",
          }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <h2 id="cookie-title" style={{ marginTop: 0 }}>
              Your privacy matters
            </h2>

            <p>
              Static Holidays uses essential technologies to keep
              the website working. With your permission, we may also
              use optional analytics and marketing technologies.
              You can accept, reject or customise your choices.
            </p>

            <p>
              Read our{" "}
              <Link to="/cookie-policy">Cookie Policy</Link>{" "}
              to find out more.
            </p>

            {showSettings && (
              <div
                style={{
                  background: "#edf4ed",
                  padding: 16,
                  borderRadius: 8,
                  marginBottom: 16,
                }}
              >
                <p>
                  <strong>Strictly necessary</strong>
                  <br />
                  Always active. These support essential website
                  functions and security.
                </p>

                <label style={{ display: "block", marginBottom: 12 }}>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(event) =>
                      setPreferences((previous) => ({
                        ...previous,
                        analytics: event.target.checked,
                      }))
                    }
                  />{" "}
                  Analytics technologies
                </label>

                <label style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(event) =>
                      setPreferences((previous) => ({
                        ...previous,
                        marketing: event.target.checked,
                      }))
                    }
                  />{" "}
                  Marketing technologies
                </label>
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginTop: 18,
              }}
            >
              <button
                type="button"
                onClick={acceptAll}
                style={buttonStyle}
              >
                Accept all
              </button>

              <button
                type="button"
                onClick={rejectOptional}
                style={buttonStyle}
              >
                Reject optional
              </button>

              {showSettings ? (
                <button
                  type="button"
                  onClick={() => savePreferences(preferences)}
                  style={buttonStyle}
                >
                  Save my choices
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSettings(true)}
                  style={buttonStyle}
                >
                  Customise
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!showBanner && (
        <button
          type="button"
          onClick={() => {
            setShowSettings(true);
            setShowBanner(true);
          }}
          style={{
            position: "fixed",
            bottom: 12,
            left: 12,
            zIndex: 9998,
            background: "#286442",
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            padding: "10px 14px",
            cursor: "pointer",
          }}
        >
          Cookie settings
        </button>
      )}
    </>
  );
}

const buttonStyle: React.CSSProperties = {
  background: "#286442",
  color: "#ffffff",
  border: "1px solid #286442",
  borderRadius: 6,
  padding: "11px 18px",
  cursor: "pointer",
  fontWeight: 600,
};
