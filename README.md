# Rise Clicker Monorepo

This monorepo contains two main packages: `scripts` and `core`.  

## Packages

### Scripts
The `scripts` package includes functionality to interact with the Rise Racers contract. It is built using TypeScript and utilizes `ts-node` for execution.

- **Main File**: `packages/scripts/src/click.ts`
- **Dependencies**: `ethers`, `dotenv`
- **Scripts**: Run the script using `npm run click` from the `packages/scripts` directory.

### Core
The `core` package provides shared functionality and types that can be used across different packages in the monorepo.

- **Main File**: `packages/core/src/index.ts`
- **Dependencies**: (List any core dependencies here)

## Getting Started

To get started with the monorepo, clone the repository and install the dependencies:

```bash
npm install
```

You can then navigate to each package directory to run specific scripts or build the packages as needed.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features you'd like to see.

## License

This project is licensed under the MIT License. See the LICENSE file for details.