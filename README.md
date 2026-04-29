# Don't Let Mocks Mock You

Typescript porting of [Don't let Mocks mock you repo](https://github.com/zampa00/dont-let-mocks-mock-you)

## Project Description

This project is a RESTful API for a role-playing game (RPG) combat system. It allows players to:

- Create adventurers with different weapons
- Start encounters with monsters
- Perform attacks during encounters
- Use healing potions

The project serves as an example of proper testing techniques, particularly focusing on the effective use of mocks in
unit tests.

## Run the app 

```
npm start
```

## API Usage

The API provides the following endpoints:

### Create an Adventurer

```
POST /create/{name}/{weapon}
```

- `name`: The name of the adventurer
- `weapon`: The weapon used by the adventurer (axe, daggers, sword)

Example:

```
POST /create/Aragorn/sword
```

### Start an Encounter

```
POST /start-encounter/{adventurerId}
```

- `adventurerId`: The UUID of the adventurer

Example:

```
POST /start-encounter/123e4567-e89b-12d3-a456-426614174000
```

### Attack in an Encounter

The adventurer performs their attack and the monster responds with their own attack action, if they are still alive.

```
POST /attack/{adventurerId}
```

- `adventurerId`: The UUID of the adventurer

Example:

```
POST /attack/123e4567-e89b-12d3-a456-426614174000
```

### Use a Healing Potion

The adventurer heals themselves by drinking a potion, if they still have any available and if they respect the maximum
usage limit per combat.
The adventurer's action is to heal themselves and they cannot perform any other action in the same turn, while the
monster will attack normally.

```
POST /heal/{adventurerId}
```

- `adventurerId`: The UUID of the adventurer

Example:

```
POST /heal/123e4567-e89b-12d3-a456-426614174000
```

## Project Structure

- `src/`
  - `app.ts` - Main application entry point
  - `config/` - Configuration classes
  - `controller/` - REST API controllers
  - `domain/` - Business logic and domain models
  - `repository/` - Data access layer

## Testing

```
npm run test
```

## License

Original "Don't Let Mocks Mock you" repo written by Marco Zamprogno and Gianni Bombelli

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

