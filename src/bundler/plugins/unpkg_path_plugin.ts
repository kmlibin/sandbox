import * as esbuild from "esbuild-wasm";


//unpkg.com basically allows us to import different stuff by providing it the name of what's to be imported

export const unpkgPathPlugin = () => {
  //returns a plugin object for esbuild
  return {
    //2 props .name and setup
    //name mostly for debugging
    name: "unpkg-path-plugin",
    //setup function. called auto by esbuil with a single argument (build). build represents bundling process. so we can tweak diff parts
    //of the build process through this function. two ways - attach event listeners to the onResolve and onLoad events.
    //we told esbuild to bundle index.js file in the build in index.tsx.
    //onResolve: esbuild trying to find out where file (index.js) is stored. we can tell esbuild where to find the file (we override)
    //onLoad: then esbuild takes that path generated in the onResolve, {path: args.path, namespace: 'a'}, and uses that path to load that file.
    //if we define the onLoad, we can override esbuild's natural desire to access the file system
    //filter: this is a reg ex. it's how we control when onresolve/onload are executed. ie only execute when we load a js, ts, css, etc file.
    //will eventually have many onresolve functions in our file.
    //namespace: allows us to say here is a set of files and we want to apply some onresolve functions to only those files.
    //only to files with namespace of 'a' applied to them. onresolve returns an object with a path and a namespace prop of a
    setup(build: esbuild.PluginBuild) {
      //will run whenever it's trying to find a specific path to a module (imports, file structure)! first time, path is index.js. loads.
      //runs onresolve again for a package given in onload. get on object with importer (index.js is trying to import), namespace ("a"),
      //path "tiny-test-pkg", this is where it thinks the path is

      //ultimate goal is to detect the path, and instead of returning current path, we want to provide a path to the package.com/url
      //args.path is path to the file we are trying to import in

      //instead of controlling path with if statements, create multiple onResolves and use filter to figure out what code should run. 
      //handle roote entry file of index.js
      build.onResolve({ filter: /(^index\.js$)/ }, () => {
        return { path: "index.js", namespace: "a" };
      });
      //looks for relative file paths ./ and ../
      build.onResolve({ filter: /^\.+\// }, (args: any) => {
        return {
          namespace: "a",
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
        };
      });
      //handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        };
      });



    },
  };
};
