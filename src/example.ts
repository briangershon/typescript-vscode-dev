import "dotenv/config";

const myVar = process.env.MY_VAR;
if (!myVar) {
  throw new Error("MY_VAR is not defined");
}

const world: string = "world";

export function run() {
  console.log(`${myVar}, ${world}!`);
}
