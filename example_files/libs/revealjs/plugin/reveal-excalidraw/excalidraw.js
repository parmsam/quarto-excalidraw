const loadFromJSON = async (path) => {
  if (!path.endsWith(".json") &&
    !path.endsWith(".excalidraw") &&
    !path.endsWith(".excalidrawlib")) {
    throw new Error("Invalid file extension");
  }
  const response = await fetch(path);
  return await response.json();
}

window.RevealExcalidraw = function () {
  return {
    id: "RevealExcalidraw",
    init: function (deck) {

      const config = deck.getConfig();
      const options = config.excalidraw || {};

      var settings = {};
      console.log(settings);
      settings.shortcut = options.shortcut || "`";
      settings.button = options.button || false;
      settings.template = options.template || "";
      settings.library = options.library || "";

      const excalidrawContainer = document.createElement('div');
      excalidrawContainer.className = "drop-clip"
      excalidrawContainer.style.display = 'none';
      excalidrawContainer.id = 'excalidraw-container';
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
        document.querySelector(".reveal").appendChild(toggleButton);

        link.addEventListener('click', (event) => {
          if (excalidrawContainer.style.display === 'none') {
            currentSlideIndex = deck.getState().indexh;
            excalidrawContainer.style.display = 'block';
          } else {
            excalidrawContainer.style.display = 'none';
            if (currentSlideIndex !== null) {
              setTimeout(() => {
                deck.slide(currentSlideIndex);
              }, 100); 
            }
          }
        });
      }

      document.addEventListener('keydown', (event) => {
        if (event.key === settings.shortcut) {
          if (excalidrawContainer.style.display === 'none') {
            currentSlideIndex = deck.getState().indexh;
            excalidrawContainer.style.display = 'block';
          } else {
            excalidrawContainer.style.display = 'none';
            if (currentSlideIndex !== null) {
              setTimeout(() => {
                deck.slide(currentSlideIndex);
              }, 10);
            }
          }
        }
      });

      const templatePath = settings.template;
      const libraryPath = settings.library;

      async function setupInitialData() {
        let templateData = {};
        if (templatePath !== "") {
          templateData = await loadFromJSON(templatePath);
        }
        let libraryData = null;
        if (libraryPath !== "") {
          libraryData = await loadFromJSON(libraryPath);
        }
        if (libraryData) {
          templateData.libraryItems = libraryData.libraryItems;
        } else {
          templateData.libraryItems = null;
        }
        return templateData;
      }

      const excalidrawOptions = {
        initialData: setupInitialData(),
        langCode: "en",
        viewModeEnabled: settings.viewModeEnabled,
        zenModeEnabled: settings.zenModeEnabled,
        gridModeEnabled: settings.gridModeEnabled,
        theme: settings.theme,
        autoFocus: settings.autoFocus,
      };
      
      const App = () => {
        return React.createElement(
          React.Fragment,
          null,
          React.createElement(
            "div",
            {
              style: { height: "100%", width: "100%" },
            },
            React.createElement(ExcalidrawLib.Excalidraw,
              excalidrawOptions,
            ),
          ),
        );
      };
      const root = ReactDOM.createRoot(excalidrawContainer);
      root.render(React.createElement(App));
      
    },
  };
};