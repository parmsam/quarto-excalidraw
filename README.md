# Excalidraw Extension For Quarto

Allows you to open up an empty [Excalidraw](https://github.com/excalidraw/excalidraw) canvas within your RevealJS presentation. Excalidraw is a virtual whiteboard for sketching hand-drawn like diagrams. It is similar to the [built-in chalkboard plugin](https://quarto.org/docs/presentations/revealjs/presenting.html#chalkboard) in Quarto.

## Installing

```bash
quarto add parmsam/excalidraw
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

Then all you have to do is click the 🎨 Artist Palette Emoji button to toggle the Excalidraw canvas. Excalidraw is running locally in your specfic slides. Click on it again to return to your slides.

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

## Example

Here is the source code for a minimal example: [example.qmd](example.qmd).

## Resources used 

- https://docs.excalidraw.com/docs/@excalidraw/excalidraw/integration#browser