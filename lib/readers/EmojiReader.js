/*!
 * patron - The cleanest command framework for discord.js and eris.
 * Copyright (C) 2020  LJ Talbot
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 2.1 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
const Registry = require("../structures/Registry.js");
const TypeReaderResult = require("../results/TypeReaderResult.js");
const TypeReader = require("../structures/TypeReader.js");
const {regexes} = require("../utils/constants.js");
const readerUtil = require("../utils/readerUtil.js");
const EmojiReader = new TypeReader({type: "emoji"});

EmojiReader.default = true;
EmojiReader.read = function(input, command, message, argument) {
  const lib = Registry.getLibrary();
  const client = lib.getClient(message);
  let value = input.match(regexes.emoji);

  if(value != null) {
    const match = lib.findEmojis(client, emoji => emoji.name === value[1] && emoji.id === value[2]);

    if(match != null)
      return TypeReaderResult.fromSuccess(match);
  }

  let matches = lib.filterEmojis(client, emoji => emoji.name === input);

  if(matches.length === 0) {
    value = input.toLowerCase();
    matches = lib.filterEmojis(client, emoji => emoji.name.toLowerCase().includes(value));
  }

  return readerUtil.handleMatches(
    command,
    message,
    argument,
    matches,
    `You've provided an invalid ${argument.name}.`,
    emoji => `<${emoji.animated ? "a" : ""}:${emoji.name}:${emoji.id}>`
  );
};
module.exports = EmojiReader;
