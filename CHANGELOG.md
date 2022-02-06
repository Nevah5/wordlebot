# Changelog (Alpha Versions)
## [Release Alpha 1.3](https://github.com/Nevah5/wordlebot/releases/tag/a1.2.1) - 06.02.2022
### Added
- Guild commands for testing
- Guess command

### Changed
- `./src/modules/wordle.js` new game function to work with first new command
- New game function in wordle to work better with interaction

### Removed
- Help embed

## [Alpha 1.2.1](https://github.com/Nevah5/wordlebot/releases/tag/a1.2.1) - 06.02.2022
### Added
- Help embed
- Comments to `./src/modules/wordle.js`
- User rich presence

### Changed
- New game embed

### Removed
- Unescesairy intents

## [Release Alpha 1.2](https://github.com/Nevah5/wordlebot/releases/tag/a1.2) - 06.02.2022
### Added
- Error message embed
- Timestamps to each embed

## [Alpha 1.1.4](https://github.com/Nevah5/wordlebot/releases/tag/a1.1.4) - 06.02.2022
### Added
- Guess word validation

## [Alpha 1.1.3](https://github.com/Nevah5/wordlebot/releases/tag/a1.1.3) - 06.02.2022
### Added
- Database deletion for user data after finishing game

## [Alpha 1.1.2](https://github.com/Nevah5/wordlebot/releases/tag/a1.1.2) - 06.02.2022
## Added
- Last guess embed
- Test if user has guessed right to send last guess embed

## Changed
- Last guess emed to look nicer
- User input can now be both upper- and lowercase.

## [Alpha 1.1.1](https://github.com/Nevah5/wordlebot/releases/tag/a1.1.1) - 06.02.2022
### Added
- Database integration for user guesses
- Checking of all guesses in db history

### Fixed
- Bug where chars not in word would bug the checking code

## [Release Alpha 1.1](https://github.com/Nevah5/wordlebot/releases/tag/a1.1) - 06.02.2022
### Added
- User can guess first guess now
- Input character check validation for wordle colors

### Changed
- User doesn't have to specify wordle id
- Guess embed mistakes

## [Alpha 1.0.6](https://github.com/Nevah5/wordlebot/releases/tag/a1.0.6) - 06.02.2022
### Added
- New game function in wordle module WIP
- Save new game to db
- New game embed
- Input validation to guessing

## [Alpha 1.0.5](https://github.com/Nevah5/wordlebot/releases/tag/a1.0.5) - 05.02.2022
### Changed
- Guessing embed

### Removed
- Send embed with all commands

## [Alpha 1.0.4](https://github.com/Nevah5/wordlebot/releases/tag/a1.0.4) - 03.02.2022
### Added
- Example wordle embed
- Comments to index.js

### Changed
- One embed field to multiple

## [Alpha 1.0.3](https://github.com/Nevah5/wordlebot/releases/tag/a1.0.3) - 03.02.2022
### Changed
- Embed module to now accept message contents

## [Alpha 1.0.2](https://github.com/Nevah5/wordlebot/releases/tag/a1.0.2) - 03.02.2022
### Added
- Embed module with example
- Reply user's message with example embed

## [Alpha 1.0.1](https://github.com/Nevah5/wordlebot/releases/tag/a1.0.1) - 03.02.2022
### Added
- Words module
- Get random word in wordle module

### Changed
- Title form Alpha 1.0 to Release Alpha 1.0 in CHANGELOG.md

## [Release Alpha 1.0](https://github.com/Nevah5/wordlebot/releases/tag/a1.0) - 02.02.2022
### Added
- Readme file with logo and installation guide
- Changelog with first release
- `index.js` with basic message logging and reaction application
- `.env.example` with config
- Licence File
- Required Node Packages in `package.json` and `package-lock.json`
- `.gitignore` with the sensitive files
- Basic example module in `./src/modules/wordle.js`