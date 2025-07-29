## Development Instructions

Clone the project

```
git clone https://github.com/CashScript/vscode-cashscript
```

Install Dependencies

```
cd vscode-cashscript && yarn
```

Open the project in vscode.

```
code .
```

Press F5 anywhere to start the test window, open the examples folder to test out any `.cash` file. All relevent files are located within the `/src` directory.

---

## Welcome to your VS Code Extension

### What's in the folder

- This folder contains all of the files necessary for your extension.
- `package.json` - this is the manifest file in which you declare your language support and define the location of the grammar file that has been copied into your extension.
- `syntaxes/cashscript.tmLanguage.json` - this is the Text mate grammar file that is used for tokenization.
- `language-configuration.json` - this is the language configuration, defining the tokens that are used for comments and brackets.

### Get up and running straight away

- Make sure the language configuration settings in `language-configuration.json` are accurate.
- Press `F5` to open a new window with your extension loaded.
- Create a new file with a file name suffix matching your language.
- Verify that syntax highlighting works and that the language configuration settings are working.

### Make changes

- You can relaunch the extension from the debug toolbar after making changes to the files listed above.
- You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

### Add more language features

- To add features such as intellisense, hovers and validators check out the VS Code extenders documentation at https://code.visualstudio.com/docs

### Install your extension

- To start using your extension with Visual Studio Code copy it into the `<user home>/.vscode/extensions` folder and restart Code.
- To share your extension with the world, read on https://code.visualstudio.com/docs about publishing an extension.

### Publish Extension

To publish the extension, we run the following command:

```
yarn clean && yarn build && yarn package
```

This creates a `cashscript-vscode-{version}.vsix` file in the root of the project.

To publish the extension to the VS Code marketplace, we visit https://marketplace.visualstudio.com/manage/publishers/cashscript, right click on the CashScript extension in the list and select "Update". Then we upload the `cashscript-vscode-{version}.vsix` file and click "Upload".

To publish to the Open VSX Registry, we visit https://open-vsx.org/user-settings/extensions and click "Publish Extension". Then we upload the `cashscript-vscode-{version}.vsix` file and click "Publish".
