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
      settings.button = options.button || false;
      settings.shortcut = options.shortcut || "`";
      settings.template = options.template || "";
      settings.library = options.library || "";
      settings.useLocalStorage = options.useLocalStorage || false;

      settings.langCode = options.langCode || "en";
      settings.viewModeEnabled = options.viewModeEnabled || false;
      settings.zenModeEnabled = options.zenModeEnabled || false;
      settings.gridModeEnabled = options.gridModeEnabled || false;
      settings.theme = options.theme || "light";
      settings.autoFocus = options.autoFocus || false;
      console.log(settings);

      let currentDeckState = null;
      let excalidrawInstance = null;
      // Guards against the receiving window re-broadcasting an update it just applied.
      let isExternalUpdate = false;

      // The upcoming-slide iframe in speaker view is loaded with controls=false.
      // It should keep showing the next slide, not mirror the Excalidraw overlay.
      const isUpcomingSlide = new URLSearchParams(window.location.search).get('controls') === 'false';

      // BroadcastChannel syncs the Excalidraw overlay between the main window and
      // the speaker-view iframe so drawings appear in the audience view in real time.
      const syncChannel = new BroadcastChannel(`excalidraw-sync-${window.location.pathname}`);

      const excalidrawContainer = document.createElement('div');
      excalidrawContainer.className = "drop-clip"
      excalidrawContainer.style.display = 'none';
      excalidrawContainer.id = 'excalidraw-container';
      document.body.appendChild(excalidrawContainer);

      function showExcalidraw(broadcast = !isUpcomingSlide) {
        currentDeckState = deck.getState();
        excalidrawContainer.style.display = 'block';
        // Excalidraw's React effects (resize observers, focus callbacks) fire
        // asynchronously after becoming visible and can trigger Reveal.js to
        // navigate to slide 0. Restoring state in the next task queue turn
        // counteracts that jump without visible flicker.
        setTimeout(() => {
          if (currentDeckState !== null) {
            deck.setState(currentDeckState);
          }
          if (broadcast) {
            const elements = excalidrawInstance
              ? excalidrawInstance.getSceneElements()
              : [];
            syncChannel.postMessage({ type: 'show', elements });
          }
        }, 0);
      }

      function hideExcalidraw(broadcast = !isUpcomingSlide) {
        excalidrawContainer.style.display = 'none';
        if (currentDeckState !== null) {
          setTimeout(() => {
            deck.setState(currentDeckState);
          }, 10);
        }
        if (broadcast) {
          syncChannel.postMessage({ type: 'hide' });
        }
      }

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
          // Prevent href="#" from changing window.location.hash, which
          // Reveal.js would interpret as navigation to slide 0.
          event.preventDefault();
          if (excalidrawContainer.style.display === 'none') {
            showExcalidraw();
          } else {
            hideExcalidraw();
          }
        });
      }

      document.body.addEventListener('keydown', (event) => {
        if (event.key === settings.shortcut) {
          // Prevent default so the key doesn't trigger any browser or
          // Reveal.js behaviour (e.g. unexpected navigation in speaker view).
          event.preventDefault();
          if (excalidrawContainer.style.display === 'none') {
            showExcalidraw();
          } else {
            hideExcalidraw();
          }
        }
      });

      // Mirror show/hide and element updates from another window (e.g. speaker
      // view iframe → main window). We skip deck.setState here because the
      // receiving window's navigation should not be affected.
      // The upcoming-slide iframe opts out entirely — it should keep showing the next slide.
      syncChannel.onmessage = (event) => {
        if (isUpcomingSlide) return;
        const { type, elements } = event.data;
        if (type === 'show') {
          excalidrawContainer.style.display = 'block';
          if (elements && elements.length > 0 && excalidrawInstance) {
            isExternalUpdate = true;
            excalidrawInstance.updateScene({ elements, commitToHistory: false });
          }
        } else if (type === 'hide') {
          excalidrawContainer.style.display = 'none';
        } else if (type === 'update' && excalidrawInstance && elements) {
          isExternalUpdate = true;
          excalidrawInstance.updateScene({ elements, commitToHistory: false });
        }
      };

      const templatePath = settings.template;
      const libraryPath = settings.library;
      const storageKey = `excalidraw-data-${window.location.pathname}`;

      async function setupInitialData() {
        let templateData = {};

        // First check if we should load from localStorage
        if (settings.useLocalStorage) {
          const savedData = localStorage.getItem(storageKey);
          if (savedData) {
            try {
              const parsedData = JSON.parse(savedData);
              console.log('Loaded Excalidraw data from localStorage');

              // Ensure appState has required properties
              if (parsedData.appState) {
                parsedData.appState.collaborators = parsedData.appState.collaborators || [];
              } else {
                parsedData.appState = { collaborators: [] };
              }

              return parsedData;
            } catch (error) {
              console.warn('Failed to parse saved Excalidraw data, falling back to template:', error);
            }
          }
        }

        // Fall back to template data if no localStorage or loading failed
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

        // Ensure appState has required properties for template data too
        if (templateData.appState) {
          templateData.appState.collaborators = templateData.appState.collaborators || [];
        } else {
          templateData.appState = { collaborators: [] };
        }

        return templateData;
      }

      const excalidrawOptions = {
        initialData: setupInitialData(),
        langCode: settings.langCode,
        viewModeEnabled: settings.viewModeEnabled,
        zenModeEnabled: settings.zenModeEnabled,
        gridModeEnabled: settings.gridModeEnabled,
        theme: settings.theme,
        autoFocus: settings.autoFocus,
        excalidrawAPI: (api) => { excalidrawInstance = api; },
        onChange: (elements, appState, files) => {
          // Skip re-broadcasting updates that originated from another window.
          if (isExternalUpdate) {
            isExternalUpdate = false;
            return;
          }

          if (!isUpcomingSlide) syncChannel.postMessage({ type: 'update', elements });

          if (settings.useLocalStorage) {
            const sanitizedAppState = {
              ...appState,
              collaborators: appState.collaborators || []
            };
            const dataToSave = { elements, appState: sanitizedAppState, files };
            try {
              localStorage.setItem(storageKey, JSON.stringify(dataToSave));
              console.log('Saved Excalidraw data to localStorage');
            } catch (error) {
              console.warn('Failed to save Excalidraw data to localStorage:', error);
            }
          }
        },
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
