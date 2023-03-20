import * as esbuild from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

//this imported localForage object to create a new object to interact with some instance of an indexedDB in the browser
//config object - name of database you want to create
const fileCache = localForage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      //instead of if statements, use filters to figure out.
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
          //if it finds any import, require, export, it's going to repeat the onresolve and onload step.
          //it would have a new object where the path is. would then try to load that path again (onLoad).
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //cache-ing - check to see if we have already fetched this file, if it is, return it immediately. was in both onloads (css and other),
        //but this way helps us reduce code

        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
        //otherwise make the request and store in cache
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        //if it's trying to load index js, we overrode that func to make sure it doesn't load. here, we loaded it for you, here are the contents.
        //if we are trying to  load any path that isn't index.js, we want to send a fetch request

        //data should contain text content of that file
        const { data, request } = await axios.get(args.path);
        //return object to es build, here are the contents
        //resolveDir applie to the next file we are going to require and it's going to tell wherever we found the prev file

        //need to make sure the css file works in the JS snippet below
        const escaped = data
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `const style = document.createElement('style');
        style.innerText = '${escaped}';
        document.head.appendChild(style)
        `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        //store response in cache as key/value pair (key is args.path, value is result object)

        await fileCache.setItem(args.path, result);
        return result;
      });

      //provide first argument of an object, second argument a function to run anytime esbuild tries to load up a file
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        //if it's trying to load index js, we overrode that func to make sure it doesn't load. here, we loaded it for you, here are the contents.
        //if we are trying to  load any path that isn't index.js, we want to send a fetch request

        //data should contain text content of that file
        const { data, request } = await axios.get(args.path);
        //return object to es build, here are the contents
        //resolveDir applie to the next file we are going to require and it's going to tell wherever we found the prev file
        //need a different loader for esbuild to import css files

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: data,
          resolveDir: new URL("./", request.responseURL).pathname,
        };

        //store response in cache as key/value pair (key is args.path, value is result object)

        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
