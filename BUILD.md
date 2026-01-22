# Guia de Build - Cymatics

Este guia explica como fazer o build da aplicação Cymatics para diferentes plataformas.

## Pré-requisitos

1. **Node.js e npm** instalados
2. **electron-builder** será instalado automaticamente como devDependency

## Instalação de Dependências

```bash
npm install
```

Isso instalará o Electron e o electron-builder.

## Criando Ícones da Aplicação

Antes de fazer o build, você precisa criar os ícones da aplicação:

### Para Linux (icon.png)
Crie um arquivo PNG de 512x512 pixels em `public/icon.png`

### Para Windows (icon.ico)
Converta o PNG para ICO com múltiplos tamanhos (16, 32, 48, 64, 128, 256 pixels)
Salve como `public/icon.ico`

### Para macOS (icon.icns)
Converta o PNG para ICNS com múltiplos tamanhos
Salve como `public/icon.icns`

**Dica:** Você pode usar ferramentas online ou o próprio electron-builder para gerar ícones:
- https://www.icoconverter.com/
- https://cloudconvert.com/png-to-icns

## Scripts de Build Disponíveis

### Build para Linux
```bash
npm run build:linux
```
Gera:
- AppImage (executável portátil)
- .deb (pacote Debian/Ubuntu)

### Build para Windows
```bash
npm run build:win
```
Gera:
- Instalador NSIS
- Versão portátil (.exe)

### Build para macOS
```bash
npm run build:mac
```
Gera:
- .dmg (imagem de disco)
- .zip (arquivo compactado)

### Build para todas as plataformas
```bash
npm run build:all
```
⚠️ **Nota:** Para build cross-platform, você pode precisar de ferramentas adicionais instaladas.

### Build padrão (plataforma atual)
```bash
npm run build
```

## Localização dos Arquivos Gerados

Todos os arquivos de build serão gerados na pasta `dist/`:
```
dist/
├── linux/
│   ├── Cymatics-1.0.0.AppImage
│   └── cymatics_1.0.0_amd64.deb
├── win/
│   ├── Cymatics Setup 1.0.0.exe
│   └── Cymatics 1.0.0.exe (portable)
└── mac/
    ├── Cymatics-1.0.0.dmg
    └── Cymatics-1.0.0-mac.zip
```

## Configurações de Build

As configurações de build estão em `package.json` na seção `"build"`:

- **appId**: Identificador único da aplicação
- **productName**: Nome exibido da aplicação
- **directories.output**: Pasta de saída (dist)
- **files**: Arquivos incluídos no build
- **linux/win/mac**: Configurações específicas por plataforma

## Desenvolvimento

Para executar em modo de desenvolvimento:
```bash
npm start
```

## Notas Importantes

1. **Linux**: A flag `--no-sandbox` é necessária para captura de áudio do sistema
   - A aplicação já está configurada para usar `--no-sandbox` automaticamente
   - Se encontrar erro de sandbox ao executar o AppImage, execute: `./Cymatics-*.AppImage --no-sandbox`

2. **Windows**: O instalador NSIS permite escolher o diretório de instalação

3. **macOS**: Pode ser necessário assinar a aplicação para distribuição

## Solução de Problemas

### Erro de Sandbox no Linux

Se você encontrar um erro como:
```
The SUID sandbox helper binary was found, but is not configured correctly
```

**Solução 1 (RECOMENDADA):** Execute o AppImage com as flags necessárias:
```bash
./Cymatics-1.0.0.AppImage --no-sandbox --disable-setuid-sandbox
```

Ou crie um alias para facilitar:
```bash
alias cymatics="./Cymatics-1.0.0.AppImage --no-sandbox --disable-setuid-sandbox"
```

**Solução 2:** Defina variáveis de ambiente antes de executar:
```bash
export ELECTRON_DISABLE_SANDBOX=1
./Cymatics-1.0.0.AppImage
```

**Solução 3:** Use o pacote .deb em vez do AppImage (mais estável):
```bash
sudo dpkg -i dist/linux/cymatics_1.0.0_amd64.deb
```

O pacote .deb não tem o problema do sandbox.

## Recursos da Aplicação

- 🌀 Visualização Psicodélica
- 〰️ Onda Linear
- ⭕ Circular Simples
- 📊 Barras de Frequência
- ✨ Partículas
- 🖱️ Partículas Interativas

## Licença

MIT
