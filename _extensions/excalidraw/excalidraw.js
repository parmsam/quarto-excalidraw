function loadScript(src) {
  return new Promise((resolve, reject) => {
    var script = document.createElement("script");
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function loadDependencies() {
  await loadScript("https://unpkg.com/react@18.2.0/umd/react.development.js");
  await loadScript("https://unpkg.com/react-dom@18.2.0/umd/react-dom.development.js");
  await loadScript("https://unpkg.com/@excalidraw/excalidraw/dist/excalidraw.development.js");
  // await loadScript("./excalidraw/src/react.development.js");
  // await loadScript("./excalidraw/src/react-dom.development.js");
  // await loadScript("./excalidraw/src/excalidraw.development.js");
}

window.RevealExcalidraw = function () {
  return {
    id: "RevealExcalidraw",
    init: async function (deck) {
      await loadDependencies();

      const config = deck.getConfig();
      const options = config.excalidraw || {};

      var settings = {};
      console.log(settings);
      settings.shortcut = options.shortcut || "`";
      settings.button = options.button || false;

      const excalidrawContainer = document.createElement('div');
      excalidrawContainer.className = "drop-clip"
      excalidrawContainer.id = 'excalidraw-container';
      excalidrawContainer.style.display = 'none';
      excalidrawContainer.style.position = 'fixed';
      excalidrawContainer.style.top = '0';
      excalidrawContainer.style.left = '0';
      excalidrawContainer.style.width = '100%';
      excalidrawContainer.style.height = '100%';
      excalidrawContainer.style.backgroundColor = 'white';
      excalidrawContainer.style.zIndex = '1000';
      document.body.appendChild(excalidrawContainer);

      if (settings.button) {
        const toggleButton = document.createElement('div');
        const link = document.createElement('a');
        toggleButton.className = "drop-button";
        toggleButton.id = "toggle-drop";
        link.href = "#";
        link.title = `Toggle Excalidraw (${settings.shortcut})`;
        link.innerText = "🎨";

        toggleButton.appendChild(link);
        toggleButton.style.position = 'absolute';
        toggleButton.style.bottom = '10px';
        toggleButton.style.left = '50%';
        toggleButton.style.transform = 'translateX(-50%)';
        toggleButton.style.zIndex = '1001'; 
        document.querySelector(".reveal").appendChild(toggleButton);

        link.addEventListener('click', (event) => {
          event.preventDefault(); // Prevent default link behavior
          if (excalidrawContainer.style.display === 'none') {
            // Store the current slide index
            currentSlideIndex = deck.getState().indexh;
            excalidrawContainer.style.display = 'block';
          } else {
            excalidrawContainer.style.display = 'none';
            // Navigate back to the stored slide index
            if (currentSlideIndex !== null) {
              deck.slide(currentSlideIndex);
            }
          }
        });
      }

      document.addEventListener('keydown', (event) => {
        if (event.key === settings.shortcut) {
          excalidrawContainer.style.display =
            excalidrawContainer.style.display === 'none' ? 'block' : 'none';
        }
      });

      const App = () => {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "div",
            {
              style: { height: "100%", width: "100%" },
            },
            React.createElement(ExcalidrawLib.Excalidraw),
          ),
        );
      };

      const root = ReactDOM.createRoot(excalidrawContainer);
      root.render(React.createElement(App));
    },
  };
};