# Excalidraw Extension For Quarto

Allows you to open up an empty [Excalidraw](https://github.com/excalidraw/excalidraw) canvas within your RevealJS presentation. Excalidraw is a virtual whiteboard for sketching hand-drawn like diagrams. It is similar to the [built-in chalkboard plugin](https://quarto.org/docs/presentations/revealjs/presenting.html#chalkboard) in Quarto. Excalidraw runs on your browser locally in your RevealJS presentation.

## Installing

```bash
quarto add parmsam/quarto-excalidraw
```

This will install the extension under the `_extensions` subdirectory.
If you're using version control, you will want to check in this directory.

## Using

Simply add the extension to the list of revealjs plugins like:

```yaml
title: "Excalidraw Example"
format:
    revealjs: default
revealjs-plugins:
  - excalidraw
```

Then all you have to do is click the 🎨 Artist Palette Emoji button to toggle the Excalidraw canvas. Excalidraw is running on your browser locally in your RevealJS presentation. Click on it again to return to your slides.

Alternatively, you can use the shortcut key to toggle the Excalidraw canvas. The default shortcut key is \` (backtick which is usually next to your 1 key). 

```yaml
title: "Excalidraw Example"
format:
  revealjs:
    chalkboard: true
    excalidraw: 
      button: true
      shortcut: "`"
revealjs-plugins:
  - excalidraw
```

You can change the shortcut key by specifying the `shortcut` option in the configuration. You can also disable the button by setting the `button` option to `false`.

There are other options you can specify in the configuration such as a reference Excalidraw file (see [template.excalidraw](template.excalidraw) for an example) to load in. You can create your own reference file by saving an Excalidraw file and then specifying the file path in `template` option. Ideally the file should be in the same directory as your Qmd file. See [example.qmd](example.qmd) for an example of this in action.

```yaml
title: "Excalidraw Example"
format:
  excalidraw:
    button: true
    shortcut: "`"
    template: "template.excalidraw"
    langCode: "en"
    viewModeEnabled: false
    zenModeEnabled: false
    gridModeEnabled: false
    theme: "light"
    autoFocus: false
revealjs-plugins: 
  - excalidraw
```

You can also specify the language code for the Excalidraw canvas, whether to enable view mode, zen mode, grid mode, and the theme. See the [Excalidraw documentation props page](https://docs.excalidraw.com/docs/@excalidraw/excalidraw/api/props/#onchange) for more information.

## Example

Here is the source code for a minimal example: [example.qmd](example.qmd).

## Resources used 

- https://docs.excalidraw.com/docs/@excalidraw/excalidraw/integration#browser