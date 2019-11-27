# @oAuth-Buttons/next

The next generation of oauth-buttons.

## Goals & Philosophies

- Easy
  - Installation
    - One CSS, One JS.
    - One JS.
    - npm
  - Use

    - ```html
      <button class="oauth-buttons login-google"></button>
      ```

  - Modification of Styles
  - Adding New
- Lightweight
  - Fast Runtime
  - Small Bundle Size
- Compatibility
  - IE11
  - Safari
  - Chrome
  - Firefox

## Features

- Button Design
- SVG-WebFont fallback
- i18n-able

## Tech Stack Decisions

- Build Tool
  - Selections
    - Handmade - Hyper extensible, hard to manage
    - Gulp - I prefer this than grunt because of api
    - Grunt - Experienced
  - Requirements
    - CSS Auto Generation based on templates
      - sass - sassy. additional build progress required because of JSON
      - emotion-server - cool. can integrate with build system
    - Logo
      - SVG to WebFont
      - [SVG Sprite](https://svgontheweb.com/#spriting) using `<symbol>` and `<use>`
- Modularize
  - web-component
  - html-replacer
  - react
  - vue
- JSON structure demo
  
  ```json
  {
    "id": "google",
    "themeColor": {
      "main": "",
      "sub": ""
    },
    "logo": {
      "svg": "https://cdn.mori.space/oauth-buttons/google.svg",
      "svg-sprite": "ob-google-icon",
      "webfont": "",
      "png": "https://cdn.mori.space/oauth-buttons/google.png",
    }
  }
  ```

- Custom Button Text
  - API demo

    ```js
    ob.textGenerator = (service) =>
      `Login with ${nameMap[service.id]}`
    ```

  - i18n

## Project Structure

:thinking:
