declare module "cubejs" {
  export default class Cube {
    constructor();
    static initSolver(): void;
    static fromString(state: string): Cube;
    static random(): Cube;
    static inverse(algorithm: string): string;
    move(algorithm: string): this;
    asString(): string;
    isSolved(): boolean;
    solve(maxDepth?: number): string;
    identity(): void;
    randomize(): void;
  }
}
