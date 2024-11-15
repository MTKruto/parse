import { build, emptyDir } from "jsr:@deno/dnt@0.41.3";
import { Project } from "jsr:@ts-morph/ts-morph@24.0.0";

const { name, version } = JSON.parse(Deno.readTextFileSync("deno.json"));

const project = new Project();

await emptyDir("./dist");

project.addSourceFilesAtPaths("**/*.ts");

for (const sourceFile of project.getSourceFiles()) {
  for (const importDeclaration of sourceFile.getImportDeclarations()) {
    if (
      importDeclaration.getModuleSpecifier().getLiteralValue() ==
        "@mtkruto/mtkruto"
    ) {
      importDeclaration.setModuleSpecifier("@mtkruto/node");
    }
  }
}

await project.save();

await build({
  entryPoints: ["mod.ts"],
  outDir: "./dist",
  typeCheck: false,
  test: false,
  compilerOptions: {
    lib: ["ESNext", "DOM", "ESNext.AsyncIterable"],
  },
  shims: {},
  packageManager: "pnpm",
  package: {
    name,
    version,
    description: "MTKruto Parse",
    author: "Roj <rojvv@icloud.com>",
    license: "LGPL-3.0-or-later",
    repository: {
      type: "git",
      url: "git+https://github.com/MTKruto/parse.git",
    },
    devDependencies: {
      "@mtkruto/node": "^0.6.1",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", "dist/LICENSE");
  },
});

for (const sourceFile of project.getSourceFiles()) {
  for (const importDeclaration of sourceFile.getImportDeclarations()) {
    if (
      importDeclaration.getModuleSpecifier().getLiteralValue() ==
        "@mtkruto/node"
    ) {
      importDeclaration.setModuleSpecifier("@mtkruto/mtkruto");
    }
  }
}

await project.save();
