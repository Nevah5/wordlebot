# Changelog (Alpha Versions)
## [Alpha 1.4.4](https://github.com/Nevah5/wordlebot/releases/tag/a1.4.4) - 12.02.2022
### Added
- Updated attribute in ranking table

## [Alpha 1.4.3](https://github.com/Nevah5/wordlebot/releases/tag/a1.4.3) - 12.02.2022
### Added
- First and last game stats
- Stats for each server in db image
- Comments to create commands in `index.js`
- Rankings for each guild

### Fixed
- Embed lifetime selection sending reply instead of update
- All selections in stats menu replying instead of update

## [Alpha 1.4.2](https://github.com/Nevah5/wordlebot/releases/tag/a1.4.2) - 09.02.2022
### Added
- Selection menu for stats in new module `./src/modules/interactions.js`
- Working selection menu

### Changed
- All interaction stuff and moved into module

### Fixed
- Slash command bug on /stat when giving no user
- Mistake in Changelog

## [Alpha 1.4.1](https://github.com/Nevah5/wordlebot/releases/tag/a1.4.1) - 08.02.2022
### Added
- Promise to saveid db function
- Save stats into db
- Statistic example embed and data analasys from database
- Graph display for guesses in stats embed
- Descriptions to stats embed

### Fixed
- Bugs

## [Release Alpha 1.4](https://github.com/Nevah5/wordlebot/releases/tag/a1.4) - 08.02.2022
### Added
- Mysql module and integration into db module
- Query to sql db to get current game of user

### Changed
- Example environment file, replaced port with database name
- JSON db to mysql database

## [Alpha 1.3.5](https://github.com/Nevah5/wordlebot/releases/tag/a1.3.5) - 07.02.2022
### Added
- `./src/modules/db.js` module
- All database interactions into db module
- Database configs to `./.env.example`
- Database image to `./image.sql`

### Changed
- Database image

### Removed
- Stats from database image for soon sql database integration

## [Alpha 1.3.4](https://github.com/Nevah5/wordlebot/releases/tag/a1.3.4) - 07.02.2022
### Changed
- Intents

### Fixed
- Indexing of manual ids
- Indexing of manual ids undo

## [Alpha 1.3.3](https://github.com/Nevah5/wordlebot/releases/tag/a1.3.3) - 07.02.2022
### Added
- Easier and playable 5 character long words

## [Alpha 1.3.2](https://github.com/Nevah5/wordlebot/releases/tag/a1.3.2) - 07.02.2022
### Added
- Play again button

### Changed
- Keyboard layout in game embeds
- Keyboard styling in game embeds with lines on top and under

### Fixed
- Keyboard bug where letters not avaiable

## [Alpha 1.3.1](https://github.com/Nevah5/wordlebot/releases/tag/a1.3.1) - 06.02.2022
### Added
- Devlopment info and invite link to `./README.md`
- Create db if not exists when user tries to guess without starting new game
- Keyboard to game embeds

## [Release Alpha 1.3](https://github.com/Nevah5/wordlebot/releases/tag/a1.3) - 06.02.2022
### Added
- Guild commands for testing
- Guess command
- Results embed

### Changed
- `./src/modules/wordle.js` new game function to work with first new command
- New game function in wordle to work better with interaction
- Gameboard name in embeds to results

### Removed
- Help embed
- Message commands including prefix from `./.env.example`
- Spoilers from guesses

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