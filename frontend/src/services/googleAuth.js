
export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.accounts) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

export const signInWithGoogle = (callback) => {
  return new Promise((resolve, reject) => {
    if (!window.google) {
      reject(new Error("Google SDK not loaded"));
      return;
    }

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      callback: (response) => {
        const userInfo = JSON.parse(atob(response.credential.split(".")[1]));
        resolve(userInfo);
      },
    });

    window.google.accounts.id.prompt();
  });
};
