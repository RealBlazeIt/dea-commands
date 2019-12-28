/*
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2019  patron contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import {promises as fs} from "fs";
import * as path from "path";
import {fileURLToPath} from "url";

/**
 * A function which returns all default exports in a folder. This is only available when using ECMAScript modules.
 * @param {String} directory The file path to a directory.
 * @returns {Promise<Array<*>>} An array of all the default exports.
 */
export async function ImportAll(dir) {
  const folder = fileURLToPath(dir);
  const files = await fs.readdir(folder);
  const modules = [];

  for(const file of files) {
    const loc = path.join(dir, file);

    if((await fs.lstat(path.join(folder, file))).isDirectory() && !file.startsWith(".")) {
      modules.push(...await ImportAll(loc));
    }else if(file.endsWith(".js")) {
      const res = await import(loc);

      if("default" in res)
        modules.push(res.default);
    }
  }

  return modules;
}