const butInstall = document.getElementById("buttonInstall");

window.addEventListener("beforeinstallprompt", (event) => {
  // Capture the prompt event when it's triggered
  window.deferredPrompt = event;

  // Display the install button by removing its "hidden" class
  butInstall.classList.toggle("hidden", false);
});

butInstall.addEventListener("click", async () => {
  const promptEvent = window.deferredPrompt;

  if (!promptEvent) {
    return;
  }

  // Display the install prompt to the user
  promptEvent.prompt();

  // Reset deferred prompt since it can only be triggered once
  window.deferredPrompt = null;

  // Hide the install button after it's clicked
  butInstall.classList.toggle("hidden", true);
});

window.addEventListener("appinstalled", (event) => {
  // Clean up by resetting the deferredPrompt once the app is installed
  window.deferredPrompt = null;
});