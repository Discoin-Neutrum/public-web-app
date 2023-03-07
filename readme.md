# web-app officielle de Discoin
en alpha test

dev: thebrainfox#4621

# Pre-release
Si vous êtes sur windows en 64 bits ou mac en 64 bits vous pouvez télécharger la version de la webapp qui correspond.

# Compilation manuelle

requis: nodejs (avec npm)

Ouvrir une fenetre de terminal au dossier.

Installer [electronjs](https://electronjs.org).
````
npm install --save-dev electron
````
Installer "forge-cli" du module electron.
````
npm install --save-dev @electron-forge/cli
````
Finaliser l'instalation du "forge-cli" du module electron.
````
npx electron-forge import
````
Lancer la compilation du logiciel.
````
npm run make
````

l'exécutable .exe (windows) ou .app (macos) devrait se trouver dans le dossier out.
````
C:\\path-to-dir\web-app\out\make\squirrel.windows\x64\dsc-blockchain-alpha-1.0.0 Setup.exe
````
````
/Users/nom-d-utilisateur/path-to-dir/web-app/out/dsc-blockchain-alpha-darwin-x64/dsc-blockchain-alpha.app
````
ces chemins sont des exemples qui montrent des chemins possibles vers l'exécutable. ce chemin est surement inexacte, car selon la version d'electron et les parametres de compilation qui peuvent changer selon la version que vous utilisez et votre plateforme. le chemin d'acces aux executables devrait cependant ressembler à ce que vous allez rencontrer. 

