//whole goal is to have all esbuild logic in here

import * as esbuild from "esbuild-wasm";

//plugins
import { unpkgPathPlugin } from "./plugins/unpkg_path_plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

let service: esbuild.Service;
const bundle = async (rawCode: string) => {
  //check if we've already started service - only need it one time
  if (!service) {
    //init esbuild, run bundle, send back the result
    service = await esbuild.startService({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
    });
  }

  const env = ["process", "env", "NODE_ENV"].join(".");

  try {
    //this is the result (code), set it to piece of state to pass into preview component
    const result = await service.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(rawCode)],
      define: {
        [env]: '"production"',
        globalName: "window",
      },
    });

    return {
      code: result.outputFiles[0].text,
      err: "",
    };
  } catch (err) {
    if (err instanceof Error) {
      return {
        code: "",
        err: err.message,
      };
    } else {
      throw err;
    }
  }
};

export default bundle;
